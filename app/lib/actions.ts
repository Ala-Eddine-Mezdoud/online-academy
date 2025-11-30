'use server';

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client
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

export async function createUser(email: string, role: string, metadata: any) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
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

export async function checkAdminConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    isConfigured: !!(url && key),
    missingKey: !key
  };
}
