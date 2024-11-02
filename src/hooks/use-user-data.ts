import { useState, useEffect } from 'react';
import { useSupabase } from './useSupabase'; // Adjust the import path as needed
import { SupabaseClient } from '@supabase/supabase-js';

interface User {
  avatar_url: string;
  full_name: string;
  username: string;
}

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
}

const useUsers = (): UseUsersResult => {
  const supabase: SupabaseClient = useSupabase();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from<User>('users')
          .select('avatar_url, full_name, username');

        if (error) {
          throw error;
        }

        setUsers(data || []);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // Optional real-time subscription can be added here

  }, [supabase]);

  return { users, loading, error };
};

export default useUsers;
interface UseUserResult {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const useUser = (): UseUserResult => {
  const supabase: SupabaseClient = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: { user: loggedInUser } } = await supabase.auth.getUser();

        if (!loggedInUser) {
          throw new Error('No logged in user');
        }

        const { data, error } = await supabase
          .from<User>('users')
          .select('avatar_url, full_name, username')
          .eq('id', loggedInUser.id)
          .single();

        if (error) {
          throw error;
        }

        setUser(data || null);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Optional real-time subscription can be added here

  }, [supabase]);

  return { user, loading, error };
};

export default useUser;
