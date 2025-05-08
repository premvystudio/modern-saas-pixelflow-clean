import { put } from '@vercel/blob'
import { broadcaster } from './broadcaster'

export async function uploadPreview(id: string, file: Blob) {
  const { url } = await put(`previews/${id}.jpg`, file, { access: 'public' })
  await broadcaster.broadcast('JobChannel', { id }, { lowres: url, progress: 50 })
  return url
} 