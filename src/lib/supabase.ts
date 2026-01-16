<<<<<<< HEAD
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
=======
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
>>>>>>> f01ce41a0e9852951a47b0fbaf728be022d3ea59

export type SensorData = {
    id: number;
    distance: number;
    servo_status: string;
    created_at: string;
<<<<<<< HEAD
}
=======
};
>>>>>>> f01ce41a0e9852951a47b0fbaf728be022d3ea59
