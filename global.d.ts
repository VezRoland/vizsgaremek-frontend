import type { UserMetadata } from "@supabase/supabase-js"

declare module "@supabase/supabase-js" {
  interface UserMetadata {
    name: string,
    role: number
  }
}