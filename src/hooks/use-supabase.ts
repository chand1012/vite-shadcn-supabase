import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

// get from VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const useSupabase = () => {
  const [supabase] = useState(() => createClient(supabaseUrl, supabaseAnonKey))

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // handle sign in event
      } else if (event === 'SIGNED_OUT') {
        // handle sign out event
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return supabase
}
