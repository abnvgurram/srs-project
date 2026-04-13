const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'
const GOOGLE_REVIEWS_API_BASE = 'https://mybusiness.googleapis.com/v4'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

export const hasGoogleReviewsConfig = Boolean(
  googleClientId && googleClientSecret,
)

export function getBaseUrl(event) {
  const protocol =
    event.headers['x-forwarded-proto'] ||
    event.headers['X-Forwarded-Proto'] ||
    'https'
  const host = event.headers.host || event.headers.Host

  if (host) {
    return `${protocol}://${host}`
  }

  return process.env.URL || process.env.DEPLOY_PRIME_URL || ''
}

export function getGoogleRedirectUri(event) {
  return `${getBaseUrl(event)}/.netlify/functions/google-reviews-callback`
}

export function buildGoogleAuthUrl(event, state) {
  const redirectUri = getGoogleRedirectUri(event)
  const scope = [
    'openid',
    'email',
    'https://www.googleapis.com/auth/business.manage',
  ].join(' ')

  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    access_type: 'offline',
    include_granted_scopes: 'true',
    prompt: 'consent',
    scope,
    state,
  })

  return `${GOOGLE_AUTH_URL}?${params.toString()}`
}

export function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separatorIndex = part.indexOf('=')

      if (separatorIndex === -1) return cookies

      const key = part.slice(0, separatorIndex).trim()
      const value = decodeURIComponent(part.slice(separatorIndex + 1))
      cookies[key] = value
      return cookies
    }, {})
}

export function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  }
}

export async function exchangeGoogleCodeForTokens({ code, event }) {
  const redirectUri = getGoogleRedirectUri(event)
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: googleClientId,
      client_secret: googleClientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || 'Token exchange failed.')
  }

  return payload
}

export async function refreshGoogleAccessToken(refreshToken) {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: googleClientId,
      client_secret: googleClientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || 'Token refresh failed.')
  }

  return payload
}

export async function fetchGoogleUser(accessToken) {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.error?.message || 'Unable to fetch Google profile.')
  }

  return payload
}

export function getGoogleLocationParent(integration) {
  const accountId = String(integration.account_id || '').trim()
  const locationId = String(integration.location_id || '').trim()

  if (locationId.startsWith('accounts/')) {
    return locationId
  }

  if (!accountId || !locationId) {
    throw new Error('Google Account ID and Location ID are required before fetching reviews.')
  }

  return `accounts/${accountId}/locations/${locationId}`
}

export async function fetchGoogleReviews({ accessToken, integration }) {
  const parent = getGoogleLocationParent(integration)
  const reviews = []
  let pageToken = ''

  do {
    const params = new URLSearchParams({
      orderBy: 'updateTime desc',
      pageSize: '50',
    })

    if (pageToken) {
      params.set('pageToken', pageToken)
    }

    const response = await fetch(
      `${GOOGLE_REVIEWS_API_BASE}/${parent}/reviews?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    const payload = await response.json()

    if (!response.ok) {
      throw new Error(payload.error?.message || 'Unable to fetch Google reviews.')
    }

    reviews.push(...(payload.reviews || []))
    pageToken = payload.nextPageToken || ''
  } while (pageToken)

  return reviews
}

export function mapGoogleReviewToTestimonial(review, index) {
  const ratingMap = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
  }
  const rating =
    ratingMap[String(review.starRating || '').toUpperCase()] ||
    Number(review.starRating) ||
    5
  const reviewDate = review.updateTime || review.createTime
  const subtitleDate = reviewDate
    ? new Date(reviewDate).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Recent'
  const reviewId = String(review.reviewId || crypto.randomUUID())

  return {
    id: `google-${reviewId}`,
    name: review.reviewer?.displayName || 'Google Reviewer',
    subtitle: `Google Review • ${subtitleDate}`,
    review:
      String(review.comment || '').trim() || 'No written review was provided.',
    rating,
    source: 'google',
    source_label: 'Verified Google Review',
    is_published: true,
    display_order: index + 1,
    updated_at: new Date().toISOString(),
  }
}
