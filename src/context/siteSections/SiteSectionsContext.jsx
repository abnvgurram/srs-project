import { useEffect, useState } from 'react'
import {
  defaultSectionVisibility,
  normalizeSectionVisibility,
} from '../../config/siteSections.js'
import { hasSupabaseConfig, supabase } from '../../lib/supabase.js'
import SiteSectionsContext from './siteSectionsContext.js'

const SITE_SETTINGS_TABLE = 'site_settings'
const SITE_SETTINGS_ROW_ID = 1

function SiteSectionsProvider({ children }) {
  const [sectionVisibility, setSectionVisibility] = useState({
    ...defaultSectionVisibility,
  })
  const [isLoading, setIsLoading] = useState(hasSupabaseConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSyncedAt, setLastSyncedAt] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isCancelled = false

    async function loadSiteSettings() {
      if (!hasSupabaseConfig) {
        setIsLoading(false)
        setErrorMessage(
          'Supabase is not configured yet. Add the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values first.',
        )
        return
      }

      const { data, error } = await supabase
        .from(SITE_SETTINGS_TABLE)
        .select('sections_visibility, updated_at')
        .eq('id', SITE_SETTINGS_ROW_ID)
        .maybeSingle()

      if (isCancelled) return

      if (error) {
        setErrorMessage(
          'Unable to load section visibility from Supabase. Run the SQL setup and check the table policies.',
        )
        setIsLoading(false)
        return
      }

      if (!data) {
        setErrorMessage(
          'No site settings row was found. Run the SQL setup script in Supabase first.',
        )
        setIsLoading(false)
        return
      }

      setSectionVisibility(normalizeSectionVisibility(data.sections_visibility))
      setLastSyncedAt(data.updated_at ?? new Date().toISOString())
      setErrorMessage('')
      setIsLoading(false)
    }

    loadSiteSettings()

    return () => {
      isCancelled = true
    }
  }, [])

  async function persistSectionVisibility(nextVisibility) {
    const previousVisibility = sectionVisibility
    setSectionVisibility(nextVisibility)

    if (!hasSupabaseConfig) {
      setSectionVisibility(previousVisibility)
      setErrorMessage(
        'Supabase is not configured yet. Add the environment variables before saving changes.',
      )
      return false
    }

    setIsSaving(true)
    setErrorMessage('')

    const { data, error } = await supabase
      .from(SITE_SETTINGS_TABLE)
      .update({
        sections_visibility: nextVisibility,
        updated_at: new Date().toISOString(),
      })
      .eq('id', SITE_SETTINGS_ROW_ID)
      .select('sections_visibility, updated_at')
      .single()

    if (error) {
      setSectionVisibility(previousVisibility)
      setErrorMessage(
        'Unable to save section visibility to Supabase. Check the SQL row and the update policy.',
      )
      setIsSaving(false)
      return false
    }

    setSectionVisibility(normalizeSectionVisibility(data.sections_visibility))
    setLastSyncedAt(data.updated_at ?? new Date().toISOString())
    setIsSaving(false)
    return true
  }

  function setSectionEnabled(sectionKey, isEnabled) {
    return persistSectionVisibility({
      ...sectionVisibility,
      [sectionKey]: isEnabled,
    })
  }

  function setMultipleSectionsEnabled(sectionKeys, isEnabled) {
    const sectionKeySet = new Set(sectionKeys)

    return persistSectionVisibility(
      Object.keys(sectionVisibility).reduce((nextVisibility, key) => {
        nextVisibility[key] = sectionKeySet.has(key)
          ? isEnabled
          : sectionVisibility[key]

        return nextVisibility
      }, {}),
    )
  }

  function showAllSections() {
    return persistSectionVisibility({ ...defaultSectionVisibility })
  }

  function hideAllSections() {
    return persistSectionVisibility(
      Object.fromEntries(
        Object.keys(defaultSectionVisibility).map((key) => [key, false]),
      ),
    )
  }

  function resetSections() {
    return persistSectionVisibility({ ...defaultSectionVisibility })
  }

  return (
    <SiteSectionsContext.Provider
      value={{
        errorMessage,
        hasSupabaseConfig,
        hideAllSections,
        isLoading,
        isSaving,
        lastSyncedAt,
        resetSections,
        sectionVisibility,
        setMultipleSectionsEnabled,
        setSectionEnabled,
        showAllSections,
      }}
    >
      {children}
    </SiteSectionsContext.Provider>
  )
}

export { SiteSectionsProvider }
