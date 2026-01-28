'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerSupabase } from './supabase/server';

// Service Role Client - ONLY for auth.admin operations (creating users)
const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase Service Role Key. Please add SUPABASE_SERVICE_ROLE_KEY to your .env file to enable user creation.'
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// Authenticated Server Client - for database operations (respects RLS)
const getAuthenticatedClient = async () => {
  return await createServerSupabase();
};

export async function createUser(email: string, role: string, metadata: any, password?: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password || 'TempPassword123!',
      email_confirm: true,
      user_metadata: { role, ...metadata }
    });

    if (error) {
      console.error('Error creating user:', error);
      throw new Error(error.message);
    }

    // Create profile record
    // Note: The trigger might handle this automatically if set up, but we'll do it manually to be safe and ensure data consistency
    // However, if there is a trigger, this might fail.
    // Let's assume we need to create the profile manually as per previous code.
    // But wait, if we create the user, the ID is generated.
    // We need to insert into profiles using THAT ID.
    
    // Check if profile exists (created by trigger)
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (!existingProfile) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: data.user.id,
          role: role,
          ...metadata
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Clean up user if profile creation fails?
        // await supabaseAdmin.auth.admin.deleteUser(data.user.id);
        throw new Error(profileError.message);
      }
    } else {
      // Update existing profile with metadata
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ role, ...metadata })
        .eq('id', data.user.id);
        
      if (updateError) throw updateError;
    }

    return { success: true, userId: data.user.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Delete the auth user - this will cascade to delete the profile
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (error) {
      console.error('Error deleting user:', error);
      throw new Error(error.message);
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function checkAdminConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // Service role key is only required for creating users via auth.admin API
  // Database operations use authenticated client with RLS
  return {
    isConfigured: !!url,
    missingKey: !key, // Only affects user creation
    userCreationEnabled: !!(url && key)
  };
}


export async function adminGetAllEnrollments() {
  try {
    const supabase = await getAuthenticatedClient();
    
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (
          title,
          teacher_id
        ),
        profiles:student_id (
          name,
          email,
          role
        )
      `);
    
    if (error) {
      console.error('Error fetching enrollments:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error: any) {
    console.error('adminGetAllEnrollments error:', error);
    return [];
  }
}

export async function adminEnrollAction(courseId: number, studentId: string) {
  try {
    const supabase = await getAuthenticatedClient();
    
    // Check for existing enrollment (including soft-deleted ones)
    const { data: existing } = await supabase
      .from('enrollments')
      .select('*')
      .eq('course_id', courseId)
      .eq('student_id', studentId)
      .maybeSingle();
    
    if (existing) {
      // If it was soft-deleted, reactivate it
      if (existing.deleted_at) {
        const { data, error } = await supabase
          .from('enrollments')
          .update({ deleted_at: null, progress: 0, enrolled_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw new Error(error.message);
        return { success: true, data, message: 'Enrollment reactivated' };
      }
      return { success: false, error: 'Student is already enrolled in this course' };
    }
    
    const { data, error } = await supabase
      .from('enrollments')
      .insert({ course_id: courseId, student_id: studentId, progress: 0 })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating enrollment:', error);
      throw new Error(error.message);
    }
    
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminDeleteEnrollmentAction(enrollmentId: number) {
  try {
    const supabase = await getAuthenticatedClient();
    
    const { data, error } = await supabase
      .from('enrollments')
      .delete()
      .eq('id', enrollmentId)
      .select()
      .single();
    
    if (error) {
      console.error('Error deleting enrollment:', error);
      throw new Error(error.message);
    }
    
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminUpdateEnrollmentAction(enrollmentId: number, progress: number) {
  try {
    const supabase = await getAuthenticatedClient();
    
    const { data, error } = await supabase
      .from('enrollments')
      .update({ progress })
      .eq('id', enrollmentId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating enrollment:', error);
      throw new Error(error.message);
    }
    
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminCreateTeacherLinks(teacherId: string, links: { platform: string; url: string }[]) {
  try {
    const supabase = await getAuthenticatedClient();
    
    if (!links || links.length === 0) {
      return { success: true, data: [] };
    }
    
    const linksToInsert = links
      .filter(link => link.platform && link.url)
      .map(link => ({
        teacher_id: teacherId,
        platform: link.platform,
        url: link.url
      }));
    
    if (linksToInsert.length === 0) {
      return { success: true, data: [] };
    }
    
    const { data, error } = await supabase
      .from('teacher_links')
      .insert(linksToInsert)
      .select();
    
    if (error) {
      console.error('Error creating teacher links:', error);
      throw new Error(error.message);
    }
    
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminUpdateTeacherLinks(teacherId: string, links: { id?: number; platform: string; url: string }[]) {
  try {
    const supabase = await getAuthenticatedClient();
    
    // Get existing links
    const { data: existingLinks } = await supabase
      .from('teacher_links')
      .select('id')
      .eq('teacher_id', teacherId);
    
    const existingIds = existingLinks?.map(l => l.id) || [];
    const newLinkIds = links.filter(l => l.id).map(l => l.id);
    
    // Delete links that are no longer in the list
    const idsToDelete = existingIds.filter(id => !newLinkIds.includes(id));
    if (idsToDelete.length > 0) {
      await supabase
        .from('teacher_links')
        .delete()
        .in('id', idsToDelete);
    }
    
    // Update existing links and insert new ones
    for (const link of links) {
      if (!link.platform || !link.url) continue;
      
      if (link.id) {
        // Update existing
        await supabase
          .from('teacher_links')
          .update({ platform: link.platform, url: link.url })
          .eq('id', link.id);
      } else {
        // Insert new
        await supabase
          .from('teacher_links')
          .insert({ teacher_id: teacherId, platform: link.platform, url: link.url });
      }
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Course-related admin actions
export async function adminCreateCourseLearnings(courseId: number, learnings: { content: string }[]) {
  try {
    const supabase = await getAuthenticatedClient();
    
    if (!learnings || learnings.length === 0) {
      return { success: true, data: [] };
    }
    
    const toInsert = learnings
      .filter(l => l.content && l.content.trim())
      .map(l => ({ course_id: courseId, content: l.content }));
    
    if (toInsert.length === 0) return { success: true, data: [] };
    
    const { data, error } = await supabase
      .from('course_learnings')
      .insert(toInsert)
      .select();
    
    if (error) throw new Error(error.message);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminCreateCourseSyllabus(courseId: number, syllabus: { week_number: number; title: string; content: string }[]) {
  try {
    const supabase = await getAuthenticatedClient();
    
    if (!syllabus || syllabus.length === 0) {
      return { success: true, data: [] };
    }
    
    const toInsert = syllabus
      .filter(s => s.title && s.title.trim())
      .map(s => ({ course_id: courseId, week_number: s.week_number, title: s.title, content: s.content }));
    
    if (toInsert.length === 0) return { success: true, data: [] };
    
    const { data, error } = await supabase
      .from('course_syllabus')
      .insert(toInsert)
      .select();
    
    if (error) throw new Error(error.message);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminCreateCourseFaq(courseId: number, faqs: { question: string; answer: string }[]) {
  try {
    const supabase = await getAuthenticatedClient();
    
    if (!faqs || faqs.length === 0) {
      return { success: true, data: [] };
    }
    
    const toInsert = faqs
      .filter(f => f.question && f.question.trim() && f.answer && f.answer.trim())
      .map(f => ({ course_id: courseId, question: f.question, answer: f.answer }));
    
    if (toInsert.length === 0) return { success: true, data: [] };
    
    const { data, error } = await supabase
      .from('course_faq')
      .insert(toInsert)
      .select();
    
    if (error) throw new Error(error.message);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminUpdateCourseLearnings(courseId: number, learnings: { id?: number; content: string }[]) {
  try {
    const supabase = await getAuthenticatedClient();
    
    const { data: existing } = await supabase
      .from('course_learnings')
      .select('id')
      .eq('course_id', courseId);
    
    const existingIds = existing?.map(l => l.id) || [];
    const newIds = learnings.filter(l => l.id).map(l => l.id);
    const idsToDelete = existingIds.filter(id => !newIds.includes(id));
    
    if (idsToDelete.length > 0) {
      await supabase.from('course_learnings').delete().in('id', idsToDelete);
    }
    
    for (const item of learnings) {
      if (!item.content || !item.content.trim()) continue;
      if (item.id) {
        await supabase.from('course_learnings').update({ content: item.content }).eq('id', item.id);
      } else {
        await supabase.from('course_learnings').insert({ course_id: courseId, content: item.content });
      }
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminUpdateCourseSyllabus(courseId: number, syllabus: { id?: number; week_number: number; title: string; content: string }[]) {
  try {
    const supabase = await getAuthenticatedClient();
    
    const { data: existing } = await supabase
      .from('course_syllabus')
      .select('id')
      .eq('course_id', courseId);
    
    const existingIds = existing?.map(l => l.id) || [];
    const newIds = syllabus.filter(l => l.id).map(l => l.id);
    const idsToDelete = existingIds.filter(id => !newIds.includes(id));
    
    if (idsToDelete.length > 0) {
      await supabase.from('course_syllabus').delete().in('id', idsToDelete);
    }
    
    for (const item of syllabus) {
      if (!item.title || !item.title.trim()) continue;
      if (item.id) {
        await supabase.from('course_syllabus').update({ week_number: item.week_number, title: item.title, content: item.content }).eq('id', item.id);
      } else {
        await supabase.from('course_syllabus').insert({ course_id: courseId, week_number: item.week_number, title: item.title, content: item.content });
      }
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminUpdateCourseFaq(courseId: number, faqs: { id?: number; question: string; answer: string }[]) {
  try {
    const supabase = await getAuthenticatedClient();
    
    const { data: existing } = await supabase
      .from('course_faq')
      .select('id')
      .eq('course_id', courseId);
    
    const existingIds = existing?.map(l => l.id) || [];
    const newIds = faqs.filter(l => l.id).map(l => l.id);
    const idsToDelete = existingIds.filter(id => !newIds.includes(id));
    
    if (idsToDelete.length > 0) {
      await supabase.from('course_faq').delete().in('id', idsToDelete);
    }
    
    for (const item of faqs) {
      if (!item.question || !item.question.trim()) continue;
      if (item.id) {
        await supabase.from('course_faq').update({ question: item.question, answer: item.answer }).eq('id', item.id);
      } else {
        await supabase.from('course_faq').insert({ course_id: courseId, question: item.question, answer: item.answer });
      }
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
