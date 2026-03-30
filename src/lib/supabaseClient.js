import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vewnahraroyudkjjapde.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZld25haHJhcm95dWRramphcGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODk1MjksImV4cCI6MjA5MDQ2NTUyOX0.gjrn6-09Y9uOvPtw99NSIn4wi5njSuv1NoC4_zbxyq4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
