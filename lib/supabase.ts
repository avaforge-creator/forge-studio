import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Allowed emails for Forge AI Studio
const ALLOWED_EMAILS = [
  'nikanwethr@gmail.com',
  'babakwethr@gmail.com',
  'hsn_shrf@icloud.com'
]

export const isEmailAllowed = (email: string): boolean => {
  return ALLOWED_EMAILS.includes(email.toLowerCase())
}

export const getUserName = (email: string): string => {
  const names: Record<string, string> = {
    'nikanwethr@gmail.com': 'Nikan',
    'babakwethr@gmail.com': 'Babak',
    'hsn_shrf@icloud.com': 'Hossein'
  }
  return names[email.toLowerCase()] || 'User'
}
