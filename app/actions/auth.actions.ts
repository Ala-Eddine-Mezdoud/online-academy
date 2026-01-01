'use server';

import { createAdminSupabase, createServerSupabase } from '@/app/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createUser(email: string, role: string, metadata: any) {
  try {
    const supabaseAdmin = createAdminSupabase();
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: 'TempPassword123!', // Temporary password, user should reset
      email_confirm: true,
      user_metadata: { role, ...metadata }
    });

    if (error) {
      console.error('Error creating user:', error);
      throw new Error(error.message);
    }

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

    revalidatePath('/dashboard/admin/users');
    return { success: true, userId: data.user.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function checkAdminConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    isConfigured: !!(url && key),
    missingKey: !key
  };
}
