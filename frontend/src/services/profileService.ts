import { supabase } from '../lib/supabase';
import type { Profile, ProfileInsert, ProfileUpdate } from '../types/database.types';

/**
 * Fetch a user profile by their authentication ID.
 * @param userId - The ID of the authenticated user.
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // PostgREST code PGRST116: no rows returned (profile not created yet)
      return null;
    }
    throw new Error(`Error fetching profile: ${error.message}`);
  }

  return data;
}

/**
 * Create a new user profile.
 * @param profile - The profile row details to insert.
 */
export async function createProfile(profile: ProfileInsert): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Error creating profile: ${error.message}`);
  }

  return data;
}

/**
 * Update an existing user profile.
 * @param userId - The ID of the user profile to update.
 * @param updates - The updated fields.
 */
export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Error updating profile: ${error.message}`);
  }

  return data;
}

/**
 * Default profile data config helper for the Onboarding flow.
 * Name: "Muhammad Bahrul Widad", Role: "Founder AMATI Studio", Daily Capacity: 8 hours
 */
export const DEFAULT_ONBOARDING_PROFILE = {
  full_name: 'Muhammad Bahrul Widad',
  role: 'Founder AMATI Studio',
  daily_capacity_hours: 8,
  avatar_url: null,
};

/**
 * Helper to fetch a profile and automatically seed default values if it is not found.
 * 
 * @param userId - The ID of the authenticated user.
 * @param defaultData - Fallback details to apply if no profile exists.
 */
export async function getOrCreateProfile(
  userId: string,
  defaultData: Omit<ProfileInsert, 'id'> = DEFAULT_ONBOARDING_PROFILE
): Promise<Profile> {
  const existing = await getProfile(userId);
  if (existing) {
    return existing;
  }

  // Create profile with default onboarding data if not found
  return await createProfile({
    id: userId,
    ...defaultData,
  });
}
