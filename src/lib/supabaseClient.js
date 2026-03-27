import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jkeprhuzmlewbhlpnzmf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprZXByaHV6bWxld2JobHBuem1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjExMjQsImV4cCI6MjA4OTkzNzEyNH0.UiS5BpWqahwIpajvdR8FqXQG4DrJ7OPAZfc6QXp_I6M'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
