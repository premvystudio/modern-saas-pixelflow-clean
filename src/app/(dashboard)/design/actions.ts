// @ts-nocheck
'use server'

import { broadcast } from '../../../lib/broadcaster'
import { redis } from '../../../lib/redis'
import { currentUser } from '@clerk/nextjs/server'
import { nanoid } from 'nanoid'

export async function createJob(prompt: string) {
  const user = await currentUser()
  if (!user) throw new Error('unauthenticated')

  const id = nanoid()

  // Persist minimal job state for workers
  await redis.xadd('design:jobs', '*', {
    id,
    prompt,
    status: 'pending',
    created_at: Date.now(),
  })

  // Optimistic UI broadcast
  await broadcast('JobChannel', { id }, { status: 'pending', progress: 0 })

  return id
} 