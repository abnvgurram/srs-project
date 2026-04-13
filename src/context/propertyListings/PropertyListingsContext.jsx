import { useEffect, useState } from 'react'
import {
  normalizePropertyListing,
  toPropertyRecord,
} from '../../data/properties.js'
import { hasSupabaseConfig, supabase } from '../../lib/supabase.js'
import PropertyListingsContext from './propertyListingsContext.js'

const PROPERTY_LISTINGS_TABLE = 'property_listings'

function PropertyListingsProvider({ children }) {
  const [propertyListings, setPropertyListings] = useState([])
  const [isLoading, setIsLoading] = useState(hasSupabaseConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isCancelled = false

    async function loadPropertyListings() {
      if (!hasSupabaseConfig) {
        setIsLoading(false)
        setErrorMessage('')
        return
      }

      const { data, error } = await supabase
        .from(PROPERTY_LISTINGS_TABLE)
        .select('*')
        .order('display_order', { ascending: true })

      if (isCancelled) return

      if (error) {
        setErrorMessage(
          'Unable to load listings from Supabase. Run the property listings SQL setup first.',
        )
        setIsLoading(false)
        return
      }

      if (!data?.length) {
        setPropertyListings([])
        setErrorMessage('')
        setIsLoading(false)
        return
      }

      setPropertyListings(
        data.map((listing, index) => normalizePropertyListing(listing, index)),
      )
      setErrorMessage('')
      setIsLoading(false)
    }

    loadPropertyListings()

    return () => {
      isCancelled = true
    }
  }, [])

  async function savePropertyListing(listingInput) {
    const listingIndex = propertyListings.findIndex(
      (listing) => listing.id === listingInput.id,
    )
    const nextDisplayOrder =
      propertyListings.reduce(
        (highestOrder, listing) =>
          Math.max(highestOrder, Number(listing.displayOrder) || 0),
        0,
      ) + 1
    const normalizedListing = normalizePropertyListing(
      {
        ...listingInput,
        id: listingInput.id ?? crypto.randomUUID(),
        displayOrder:
          listingInput.displayOrder ??
          (listingIndex >= 0
            ? propertyListings[listingIndex].displayOrder
            : nextDisplayOrder),
      },
      listingIndex >= 0 ? listingIndex : propertyListings.length,
    )

    if (!hasSupabaseConfig) {
      setErrorMessage(
        'Supabase is not configured yet. Add the environment variables before saving listings.',
      )
      return null
    }

    setIsSaving(true)
    setErrorMessage('')

    const { data, error } = await supabase
      .from(PROPERTY_LISTINGS_TABLE)
      .upsert(toPropertyRecord(normalizedListing), { onConflict: 'id' })
      .select('*')
      .single()

    if (error) {
      setErrorMessage(
        'Unable to save the listing in Supabase. Check the property_listings table policies.',
      )
      setIsSaving(false)
      return null
    }

    const savedListing = normalizePropertyListing(
      data,
      listingIndex >= 0 ? listingIndex : propertyListings.length,
    )

    setPropertyListings((currentListings) => {
      const existingIndex = currentListings.findIndex(
        (listing) => listing.id === savedListing.id,
      )

      if (existingIndex === -1) {
        return [...currentListings, savedListing].sort(
          (left, right) => left.displayOrder - right.displayOrder,
        )
      }

      return currentListings
        .map((listing) => (listing.id === savedListing.id ? savedListing : listing))
        .sort((left, right) => left.displayOrder - right.displayOrder)
    })

    setIsSaving(false)
    return savedListing
  }

  async function deletePropertyListing(listingId) {
    if (!hasSupabaseConfig) {
      setErrorMessage(
        'Supabase is not configured yet. Add the environment variables before deleting listings.',
      )
      return false
    }

    setIsSaving(true)
    setErrorMessage('')

    const { error } = await supabase
      .from(PROPERTY_LISTINGS_TABLE)
      .delete()
      .eq('id', listingId)

    if (error) {
      setErrorMessage(
        'Unable to delete the listing in Supabase. Check the property_listings table policies.',
      )
      setIsSaving(false)
      return false
    }

    setPropertyListings((currentListings) =>
      currentListings.filter((listing) => listing.id !== listingId),
    )
    setIsSaving(false)
    return true
  }

  async function setPropertyListingPublished(listingId, isPublished) {
    const listing = propertyListings.find((item) => item.id === listingId)

    if (!listing) return false

    const savedListing = await savePropertyListing({
      ...listing,
      isPublished,
    })

    return Boolean(savedListing)
  }

  return (
    <PropertyListingsContext.Provider
      value={{
        deletePropertyListing,
        errorMessage,
        isLoading,
        isSaving,
        propertyListings,
        setPropertyListingPublished,
        savePropertyListing,
      }}
    >
      {children}
    </PropertyListingsContext.Provider>
  )
}

export { PropertyListingsProvider }
