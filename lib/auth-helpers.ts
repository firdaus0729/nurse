import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  const userRole = (session.user as any)?.role
  if (userRole !== 'ADMIN') {
    throw new Error('Forbidden: Only admins can perform this action')
  }
  return session
}

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}
