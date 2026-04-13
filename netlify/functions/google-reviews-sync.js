import {
  fetchGoogleReviews,
  getGoogleLocationParent,
  hasGoogleReviewsConfig,
  jsonResponse,
  mapGoogleReviewToTestimonial,
  refreshGoogleAccessToken,
} from './lib/googleReviews.js'
import {
  hasSupabaseAdminConfig,
  supabaseAdmin,
} from './lib/supabaseAdmin.js'

const REVIEW_INTEGRATIONS_TABLE = 'review_integrations'
const REVIEW_INTEGRATION_TOKENS_TABLE = 'review_integration_tokens'
const TESTIMONIALS_TABLE = 'testimonials'

async function loadGoogleIntegration() {
  const { data: integration, error: integrationError } = await supabaseAdmin
    .from(REVIEW_INTEGRATIONS_TABLE)
    .select('*')
    .eq('provider', 'google')
    .maybeSingle()

  if (integrationError || !integration) {
    throw new Error(
      'Google integration settings were not found. Save the Google settings first.',
    )
  }

  const { data: tokens, error: tokenError } = await supabaseAdmin
    .from(REVIEW_INTEGRATION_TOKENS_TABLE)
    .select('*')
    .eq('provider', 'google')
    .maybeSingle()

  if (tokenError || !tokens) {
    throw new Error('Google has not been connected yet.')
  }

  return { integration, tokens }
}

async function ensureGoogleAccessToken(tokens) {
  const expiresAt = tokens.expires_at ? new Date(tokens.expires_at).getTime() : 0
  const isExpired = !tokens.access_token || !expiresAt || Date.now() >= expiresAt

  if (!isExpired) {
    return {
      accessToken: tokens.access_token,
      nextTokenRecord: null,
    }
  }

  if (!tokens.refresh_token) {
    throw new Error('Google refresh token is missing. Reconnect Google first.')
  }

  const refreshed = await refreshGoogleAccessToken(tokens.refresh_token)

  return {
    accessToken: refreshed.access_token,
    nextTokenRecord: {
      access_token: refreshed.access_token,
      refresh_token: tokens.refresh_token,
      scope: refreshed.scope || tokens.scope || '',
      expires_at: refreshed.expires_in
        ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
        : tokens.expires_at,
      updated_at: new Date().toISOString(),
    },
  }
}

export async function handler() {
  if (!hasGoogleReviewsConfig || !hasSupabaseAdminConfig) {
    return jsonResponse(500, {
      message:
        'Google review sync is not configured. Add Google and Supabase server environment variables in Netlify.',
    })
  }

  try {
    const { integration, tokens } = await loadGoogleIntegration()
    getGoogleLocationParent(integration)

    const { accessToken, nextTokenRecord } = await ensureGoogleAccessToken(tokens)

    if (nextTokenRecord) {
      const { error: tokenUpdateError } = await supabaseAdmin
        .from(REVIEW_INTEGRATION_TOKENS_TABLE)
        .upsert(
          {
            provider: 'google',
            ...nextTokenRecord,
          },
          { onConflict: 'provider' },
        )

      if (tokenUpdateError) {
        throw new Error('Could not refresh Google access token.')
      }
    }

    const reviews = await fetchGoogleReviews({
      accessToken,
      integration,
    })
    const testimonials = reviews.map(mapGoogleReviewToTestimonial)

    if (testimonials.length) {
      const { error: syncError } = await supabaseAdmin
        .from(TESTIMONIALS_TABLE)
        .upsert(testimonials, { onConflict: 'id' })

      if (syncError) {
        throw new Error('Google reviews were fetched but could not be synced to Supabase.')
      }
    }

    const syncedAt = new Date().toISOString()
    const { error: integrationUpdateError } = await supabaseAdmin
      .from(REVIEW_INTEGRATIONS_TABLE)
      .upsert(
        {
          provider: 'google',
          connection_status: 'connected',
          last_synced_at: syncedAt,
          last_error: '',
          updated_at: syncedAt,
        },
        { onConflict: 'provider' },
      )

    if (integrationUpdateError) {
      throw new Error('Google reviews synced, but integration status could not be updated.')
    }

    return jsonResponse(200, {
      message: `Fetched and synced ${testimonials.length} Google review(s) to Supabase.`,
      syncedCount: testimonials.length,
      syncedAt,
    })
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

    return jsonResponse(400, {
      message: error.message,
    })
  }
}
