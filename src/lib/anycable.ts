// Custom AnyCable client for Next.js 
// This implementation is designed to be compatible with Edge Runtime and avoid Node.js crypto dependencies
'use client'

import { createCable } from '@anycable/web'

// Create a simple cable instance - to avoid TypeScript errors, we'll use the
// simplest form of createCable and add configuration if needed later
export const cable = createCable(process.env.NEXT_PUBLIC_ANYCABLE_URL || '')

// This simpler approach follows the official examples
// We keep the client component clean and avoid any Node.js specific imports
// Authentication will be handled by cookies + server middleware 