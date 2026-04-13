import {
  exchangeGoogleCodeForTokens,
  fetchGoogleUser,
  getBaseUrl,
  hasGoogleReviewsConfig,
  parseCookies,
} from './lib/googleReviews.js'
import {
  hasSupabaseAdminConfig,
  supabaseAdmin,
} from './lib/supabaseAdmin.js'

const REVIEW_INTEGRATIONS_TABLE = 'review_integrations'
const REVIEW_INTEGRATION_TOKENS_TABLE = 'review_integration_tokens'

function buildAdminRedirect(baseUrl, status) {
  return `${baseUrl}/admin?google=${encodeURIComponent(status)}`
}

export async function handler(event) {
  const baseUrl = getBaseUrl(event)
  const params = new URLSearchParams(event.rawQuery || '')
  const code = params.get('code')
  const state = params.get('state')
  const googleError = params.get('error')

  if (!hasGoogleReviewsConfig || !hasSupabaseAdminConfig) {
    return {
      statusCode: 302,
      headers: {
        Location: buildAdminRedirect(baseUrl, 'env-missing'),
      },
    }
  }

  if (googleError) {
    return {
      statusCode: 302,
      headers: {
        Location: buildAdminRedirect(baseUrl, 'cancelled'),
      },
    }
  }

  const cookies = parseCookies(event.headers.cookie || event.headers.Cookie || '')

  if (!code || !state || cookies.google_reviews_state !== state) {
    return {
      statusCode: 302,
      headers: {
        Location: buildAdminRedirect(baseUrl, 'state-mismatch'),
      },
    }
  }

  try {
    const tokenPayload = await exchangeGoogleCodeForTokens({ code, event })
    const accessToken = tokenPayload.access_token
    const refreshToken = tokenPayload.refresh_token || ''
    const expiresAt = tokenPayload.expires_in
      ? new Date(Date.now() + tokenPayload.expires_in * 1000).toISOString()
      : null
    const user = accessToken ? await fetchGoogleUser(accessToken) : null

    const { error: integrationError } = await supabaseAdmin
      .from(REVIEW_INTEGRATIONS_TABLE)
      .upsert(
        {
          provider: 'google',
          connection_status: 'connected',
          connected_identity: user?.email || '',
          last_error: '',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'provider' },
      )

    if (integrationError) {
      throw new Error('Could not save Google integration status.')
    }

    const { error: tokenError } = await supabaseAdmin
      .from(REVIEW_INTEGRATION_TOKENS_TABLE)
      .upsert(
        {
          provider: 'google',
          access_token: accessToken || '',
          refresh_token: refreshToken,
          scope: tokenPayload.scope || '',
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'provider' },
      )

    if (tokenError) {
      throw new Error('Could not save Google OAuth tokens.')
    }

    return {
      statusCode: 302,
      headers: {
        Location: buildAdminRedirect(baseUrl, 'connected'),
        'Set-Cookie':
          'google_reviews_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
      },
    }
  } catch (error) {
    await supabaseAdmin
      .from(REVIEW_INTEGRATIONS_TABLE)
      .upsert(
        {
          provider: 'google',
          connection_status: 'error',
          last_error: error.message,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'provider' },
      )

    return {
      statusCode: 302,
      headers: {
        Location: buildAdminRedirect(baseUrl, 'error'),
        'Set-Cookie':
          'google_reviews_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
      },
    }
  }
}
