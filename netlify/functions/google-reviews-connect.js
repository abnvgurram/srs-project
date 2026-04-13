import { randomUUID } from 'node:crypto'
import {
  buildGoogleAuthUrl,
  hasGoogleReviewsConfig,
} from './lib/googleReviews.js'

export async function handler(event) {
  if (!hasGoogleReviewsConfig) {
    return {
      statusCode: 302,
      headers: {
        Location: '/admin?google=env-missing',
      },
    }
  }

  const state = randomUUID()
  const authUrl = buildGoogleAuthUrl(event, state)

  return {
    statusCode: 302,
    headers: {
      Location: authUrl,
      'Set-Cookie': `google_reviews_state=${encodeURIComponent(state)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  }
}
