import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  PencilLine,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import './Properties.scss'
import {
  normalizePropertyPrice,
  orderPropertyImages,
  propertyFilters,
  propertyTypeMeta,
} from '../../data/properties.js'
import usePropertyListings from '../../context/propertyListings/usePropertyListings.js'
import PropertyImageCarousel from '../../components/Properties/propertyImageCarousel/PropertyImageCarousel.jsx'
import ConfirmationModal from '../common/confirmationModal/ConfirmationModal.jsx'
import Pagination from '../common/pagination/Pagination.jsx'
import SectionVisibilityGate from '../common/sectionVisibilityGate/SectionVisibilityGate.jsx'
import { hasSupabaseConfig, supabase } from '../../lib/supabase.js'

const propertyTypeOptions = propertyFilters.filter(
  (filter) => filter.value === 'buy' || filter.value === 'rent',
)

const manageFilters = [
  { label: 'All', value: 'all' },
  { label: 'Sale', value: 'buy' },
  { label: 'Rent', value: 'rent' },
  { label: 'Sold', value: 'sold' },
]
const MANAGE_PROPERTIES_PAGE_SIZE = 4
const PROPERTY_IMAGES_PAGE_SIZE = 5
const PROPERTY_IMAGES_BUCKET = 'property-images'
const PROPERTY_IMAGES_PUBLIC_PATH = `/storage/v1/object/public/${PROPERTY_IMAGES_BUCKET}/`

function PropertyImagePreview({ imageUrl, label }) {
  const [hasError, setHasError] = useState(false)

  if (!imageUrl.trim()) return null

  return (
    <div className="properties-admin-section__image-preview">
      {hasError ? (
        <div className="properties-admin-section__image-preview-fallback">
          Preview unavailable
        </div>
      ) : (
        <img
          className="properties-admin-section__image-preview-image"
          src={imageUrl}
          alt={label}
          loading="lazy"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  )
}

function isUploadedPropertyImage(imageUrl) {
  const normalizedImageUrl = String(imageUrl ?? '').trim()

  return (
    Boolean(normalizedImageUrl) &&
    normalizedImageUrl.includes(PROPERTY_IMAGES_PUBLIC_PATH)
  )
}

function getUploadedPropertyImageLabel(imageUrl) {
  try {
    const url = new URL(imageUrl)
    const fileName = url.pathname.split('/').filter(Boolean).at(-1)
    return fileName ? decodeURIComponent(fileName) : 'Uploaded image'
  } catch {
    return 'Uploaded image'
  }
}

function getPropertyImageStoragePath(imageUrl) {
  try {
    const url = new URL(imageUrl)
    const marker = `/storage/v1/object/public/${PROPERTY_IMAGES_BUCKET}/`
    const markerIndex = url.pathname.indexOf(marker)

    if (markerIndex === -1) return null

    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length))
  } catch {
    return null
  }
}

function createImageDisplayNumbers(imageUrls) {
  return imageUrls.map((_, index) => index + 1)
}

function getNextImageDisplayNumber(currentDisplayNumbers) {
  return currentDisplayNumbers.length
    ? Math.max(...currentDisplayNumbers) + 1
    : 1
}

function normalizeAdminPriceInput(price) {
  return String(price ?? '')
    .replace(/^\$\s*/, '')
    .replace(/\s*(?:\/\s*m|\/\s*mo|\/\s*month|per\s*month)$/i, '')
    .trimStart()
}

function normalizeAdminSizeInput(size) {
  return String(size ?? '')
    .replace(/\s*sqft$/i, '')
    .trimStart()
}

function hasMeaningfulPrice(price) {
  return Boolean(String(price ?? '').trim())
}

function createSuggestionList(values) {
  const seenValues = new Set()

  return values.filter((value) => {
    const normalizedValue = String(value ?? '').trim()
    const normalizedKey = normalizedValue.toLowerCase()

    if (!normalizedValue || seenValues.has(normalizedKey)) return false

    seenValues.add(normalizedKey)
    return true
  })
}

function BrandedSuggestionField({
  id,
  inputMode,
  label,
  onChange,
  placeholder,
  prefix,
  suffix,
  suggestions = [],
  value,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [dismissedSuggestions, setDismissedSuggestions] = useState([])
  const fieldRef = useRef(null)
  const filteredSuggestions = useMemo(() => {
    const normalizedValue = String(value ?? '').trim().toLowerCase()
    const availableSuggestions = suggestions.filter(
      (suggestion) => !dismissedSuggestions.includes(suggestion),
    )

    if (!normalizedValue) {
      return availableSuggestions.slice(0, 6)
    }

    const primaryMatches = availableSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().startsWith(normalizedValue),
    )
    const secondaryMatches = availableSuggestions.filter((suggestion) => {
      const normalizedSuggestion = suggestion.toLowerCase()

      return (
        !normalizedSuggestion.startsWith(normalizedValue) &&
        normalizedSuggestion.includes(normalizedValue)
      )
    })

    return [...primaryMatches, ...secondaryMatches].slice(0, 6)
  }, [dismissedSuggestions, suggestions, value])

  useEffect(() => {
    function handleOutsideMouseDown(event) {
      if (!fieldRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    window.addEventListener('mousedown', handleOutsideMouseDown)

    return () => {
      window.removeEventListener('mousedown', handleOutsideMouseDown)
    }
  }, [])

  return (
    <div className="properties-admin-section__field">
      <label htmlFor={id}>{label}</label>

      <div className="properties-admin-section__suggestion-field" ref={fieldRef}>
        {prefix || suffix ? (
          <div
            className={`properties-admin-section__input-with-prefix${
              prefix ? ' has-prefix' : ''
            }${
              suffix ? ' has-suffix' : ''
            }`}
          >
            {prefix ? (
              <span className="properties-admin-section__input-prefix">
                {prefix}
              </span>
            ) : null}
            <input
              autoComplete="new-password"
              id={id}
              inputMode={inputMode}
              type="text"
              value={value}
              placeholder={placeholder}
              onChange={(event) => {
                onChange(event.target.value)
                setIsOpen(true)
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setIsOpen(false)
                }
              }}
            />
            {suffix ? (
              <span className="properties-admin-section__input-suffix">
                {suffix}
              </span>
            ) : null}
          </div>
        ) : (
          <input
            autoComplete="new-password"
            id={id}
            inputMode={inputMode}
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(event) => {
              onChange(event.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setIsOpen(false)
              }
            }}
          />
        )}

        {isOpen && filteredSuggestions.length ? (
          <div
            className="properties-admin-section__suggestions"
            role="listbox"
          >
            {filteredSuggestions.map((suggestion) => (
              <div
                className="properties-admin-section__suggestion-row"
                key={`${id}-${suggestion}`}
              >
                <button
                  className="properties-admin-section__suggestion"
                  type="button"
                  onClick={() => {
                    onChange(suggestion)
                    setIsOpen(false)
                  }}
                >
                  {prefix
                    ? `${prefix} ${suggestion}${suffix ? ` ${suffix}` : ''}`
                    : suffix
                      ? `${suggestion} ${suffix}`
                      : suggestion}
                </button>

                <button
                  className="properties-admin-section__suggestion-dismiss"
                  type="button"
                  aria-label={`Dismiss suggestion ${suggestion}`}
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    setDismissedSuggestions((currentDismissedSuggestions) =>
                      currentDismissedSuggestions.includes(suggestion)
                        ? currentDismissedSuggestions
                        : [...currentDismissedSuggestions, suggestion],
                    )
                  }}
                >
                  <X aria-hidden="true" size={14} strokeWidth={2.2} />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function PropertySelectionCheckbox({ checked, label, onChange }) {
  return (
    <button
      className={`properties-admin-section__select-box${
        checked ? ' is-active' : ''
      }`}
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
    >
      {checked ? <Check aria-hidden="true" size={14} strokeWidth={2.6} /> : null}
    </button>
  )
}

function createEmptyDraft(nextDisplayOrder) {
  return {
    type: 'buy',
    isPublished: true,
    price: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    description: '',
    beds: '',
    baths: '',
    size: '',
    imageUrls: [],
    coverImageIndex: -1,
    displayOrder: nextDisplayOrder,
  }
}

function getPriceFieldLabel(type) {
  return type === 'rent' ? 'Rent' : 'Price'
}

function getPriceFieldSuffix(type) {
  return type === 'rent' ? 'per month' : ''
}

function getPriceFieldPlaceholder(type) {
  return type === 'rent' ? 'Enter monthly rent' : 'Enter amount'
}

function createDraftFromListing(listing) {
  return {
    ...listing,
    price: normalizeAdminPriceInput(listing.price),
    size: normalizeAdminSizeInput(listing.size),
    imageUrls: listing.imageUrls.length ? listing.imageUrls : [],
    coverImageIndex: Number.isInteger(listing.coverImageIndex)
      ? listing.coverImageIndex
      : -1,
  }
}

function normalizeFileName(fileName) {
  return String(fileName ?? 'image')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
}

function PropertyTypeSelect({ disabled, onChange, options, value }) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)
  const selectedOption =
    options.find((option) => option.value === value) ?? {
      label: propertyTypeMeta[value]?.badge ?? 'Category',
      value,
    }

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!selectRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    window.addEventListener('mousedown', handleOutsideClick)

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <div className="properties-admin-section__select" ref={selectRef}>
      <button
        className={`properties-admin-section__select-trigger${
          isOpen ? ' is-open' : ''
        }`}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{selectedOption.label}</span>
        <ChevronDown aria-hidden="true" size={16} strokeWidth={2.1} />
      </button>

      {isOpen ? (
        <div className="properties-admin-section__select-menu" role="listbox">
          {options.map((option) => (
            <button
              className={`properties-admin-section__select-option${
                option.value === value ? ' is-active' : ''
              }`}
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              <span>{option.label}</span>
              {option.value === value ? (
                <Check aria-hidden="true" size={16} strokeWidth={2.2} />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function Properties() {
  const {
    deletePropertyListing,
    errorMessage,
    isLoading,
    isSaving,
    propertyListings,
    savePropertyListing,
    setPropertyListingPublished,
  } = usePropertyListings()
  const [activeTab, setActiveTab] = useState('editor')
  const [selectedListingId, setSelectedListingId] = useState('')
  const [draft, setDraft] = useState(() => createEmptyDraft(1))
  const [imageDisplayNumbers, setImageDisplayNumbers] = useState([])
  const [isCreating, setIsCreating] = useState(true)
  const [formMessage, setFormMessage] = useState('')
  const [manageFilter, setManageFilter] = useState('all')
  const [managePage, setManagePage] = useState(1)
  const [imagePage, setImagePage] = useState(1)
  const [confirmationState, setConfirmationState] = useState(null)
  const [isConfirmingAction, setIsConfirmingAction] = useState(false)
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [initialImageUrls, setInitialImageUrls] = useState([])
  const [pendingDeletedImageUrls, setPendingDeletedImageUrls] = useState([])
  const [selectedPropertyIds, setSelectedPropertyIds] = useState([])
  const imageUploadInputRef = useRef(null)

  const nextDisplayOrder =
    propertyListings.reduce(
      (highestOrder, listing) =>
        Math.max(highestOrder, Number(listing.displayOrder) || 0),
      0,
    ) + 1

  const filteredListings = useMemo(() => {
    if (manageFilter === 'all') return propertyListings
    return propertyListings.filter((listing) => listing.type === manageFilter)
  }, [manageFilter, propertyListings])
  const totalManagePages = Math.max(
    1,
    Math.ceil(filteredListings.length / MANAGE_PROPERTIES_PAGE_SIZE),
  )
  const paginatedListings = useMemo(() => {
    const startIndex = (managePage - 1) * MANAGE_PROPERTIES_PAGE_SIZE
    return filteredListings.slice(
      startIndex,
      startIndex + MANAGE_PROPERTIES_PAGE_SIZE,
    )
  }, [filteredListings, managePage])
  const totalImagePages = Math.max(
    1,
    Math.ceil(draft.imageUrls.length / PROPERTY_IMAGES_PAGE_SIZE),
  )
  const paginatedDraftImages = useMemo(() => {
    const startIndex = (imagePage - 1) * PROPERTY_IMAGES_PAGE_SIZE

    return draft.imageUrls
      .map((imageUrl, index) => ({
        imageUrl,
        index,
      }))
      .slice(startIndex, startIndex + PROPERTY_IMAGES_PAGE_SIZE)
  }, [draft.imageUrls, imagePage])
  const selectedProperties = useMemo(
    () => propertyListings.filter((listing) => selectedPropertyIds.includes(listing.id)),
    [propertyListings, selectedPropertyIds],
  )
  const selectedMarkableAsSoldProperties = useMemo(
    () => selectedProperties.filter((listing) => listing.type !== 'sold'),
    [selectedProperties],
  )
  const selectedPublishedProperties = useMemo(
    () => selectedProperties.filter((listing) => listing.isPublished),
    [selectedProperties],
  )
  const fieldSuggestions = useMemo(
    () => ({
      baths: createSuggestionList(propertyListings.map((listing) => listing.baths)),
      beds: createSuggestionList(propertyListings.map((listing) => listing.beds)),
      city: createSuggestionList(propertyListings.map((listing) => listing.city)),
      price: createSuggestionList(
        propertyListings.map((listing) => normalizeAdminPriceInput(listing.price)),
      ),
      size: createSuggestionList(
        propertyListings.map((listing) =>
          String(listing.size ?? '').replace(/\s*sqft$/i, '').trim(),
        ),
      ),
      state: createSuggestionList(propertyListings.map((listing) => listing.state)),
      streetAddress: createSuggestionList(
        propertyListings.map((listing) => listing.streetAddress),
      ),
      zipCode: createSuggestionList(
        propertyListings.map((listing) => listing.zipCode),
      ),
    }),
    [propertyListings],
  )

  useEffect(() => {
    if (!formMessage) return undefined

    const timeoutId = window.setTimeout(() => {
      setFormMessage('')
    }, 2000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [formMessage])

  useEffect(() => {
    setManagePage(1)
  }, [manageFilter])

  useEffect(() => {
    if (managePage > totalManagePages) {
      setManagePage(totalManagePages)
    }
  }, [managePage, totalManagePages])

  useEffect(() => {
    if (imagePage > totalImagePages) {
      setImagePage(totalImagePages)
    }
  }, [imagePage, totalImagePages])

  useEffect(() => {
    setSelectedPropertyIds((currentIds) =>
      currentIds.filter((listingId) =>
        filteredListings.some((listing) => listing.id === listingId),
      ),
    )
  }, [filteredListings])

  function openAddProperty() {
    setActiveTab('editor')
    setIsCreating(true)
    setSelectedListingId('')
    setDraft(createEmptyDraft(nextDisplayOrder))
    setImageDisplayNumbers([])
    setImagePage(1)
    setInitialImageUrls([])
    setPendingDeletedImageUrls([])
    setFormMessage('')
  }

  function openManageProperties() {
    setActiveTab('manage')
  }

  function handleSelectListing(listingId) {
    const listing = propertyListings.find((item) => item.id === listingId)

    if (!listing) return

    setActiveTab('editor')
    setIsCreating(false)
    setSelectedListingId(listingId)
    setDraft(createDraftFromListing(listing))
    setImageDisplayNumbers(createImageDisplayNumbers(listing.imageUrls))
    setImagePage(1)
    setInitialImageUrls(listing.imageUrls)
    setPendingDeletedImageUrls([])
    setFormMessage('')
  }

  function handleCancelEditor() {
    setActiveTab('manage')
    setIsCreating(true)
    setSelectedListingId('')
    setDraft(createEmptyDraft(nextDisplayOrder))
    setImageDisplayNumbers([])
    setImagePage(1)
    setInitialImageUrls([])
    setPendingDeletedImageUrls([])
    setFormMessage('')
  }

  function handleFieldChange(field, value) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]:
        field === 'price'
          ? normalizeAdminPriceInput(value)
          : field === 'size'
            ? normalizeAdminSizeInput(value)
            : value,
    }))
  }

  function clearSelectedProperties() {
    setSelectedPropertyIds([])
  }

  function toggleSelectedProperty(listingId) {
    setSelectedPropertyIds((currentIds) =>
      currentIds.includes(listingId)
        ? currentIds.filter((currentId) => currentId !== listingId)
        : [...currentIds, listingId],
    )
  }

  function closeConfirmation() {
    if (isConfirmingAction) return
    setConfirmationState(null)
  }

  function requestDelete(listing) {
    setConfirmationState({
      confirmLabel: 'Delete Property',
      description: `This will remove "${listing.address}" from Properties and delete its uploaded images from Supabase storage.`,
      onConfirm: () => handleDelete(listing),
      title: 'Delete property?',
      tone: 'danger',
    })
  }

  function requestPublishToggle(listing) {
    const isUnpublishing = listing.isPublished

    setConfirmationState({
      confirmLabel: isUnpublishing ? 'Unpublish Property' : 'Publish Property',
      description: isUnpublishing
        ? `This will hide "${listing.address}" from the website until you publish it again.`
        : `This will make "${listing.address}" visible on the website.`,
      onConfirm: () => handlePublishToggle(listing),
      title: isUnpublishing ? 'Unpublish property?' : 'Publish property?',
      tone: isUnpublishing ? 'danger' : 'default',
    })
  }

  function requestBulkUnpublish() {
    if (!selectedPublishedProperties.length) return

    setConfirmationState({
      confirmLabel: `Unpublish ${selectedPublishedProperties.length} Properties`,
      description: `This will hide ${selectedPublishedProperties.length} selected propert${
        selectedPublishedProperties.length === 1 ? 'y' : 'ies'
      } from the website.`,
      onConfirm: handleBulkUnpublish,
      title: 'Unpublish selected properties?',
      tone: 'danger',
    })
  }

  function requestMarkAsSold(listing) {
    if (listing.type === 'sold') return

    setConfirmationState({
      confirmLabel: 'Mark as Sold',
      description: `This will move "${listing.address}" into Sold properties.`,
      onConfirm: () => handleMarkAsSold(listing),
      title: 'Mark property as sold?',
      tone: 'danger',
    })
  }

  function requestBulkMarkAsSold() {
    if (!selectedMarkableAsSoldProperties.length) return

    setConfirmationState({
      confirmLabel: `Mark ${selectedMarkableAsSoldProperties.length} Properties as Sold`,
      description: `This will move ${selectedMarkableAsSoldProperties.length} selected propert${
        selectedMarkableAsSoldProperties.length === 1 ? 'y' : 'ies'
      } into Sold properties.`,
      onConfirm: handleBulkMarkAsSold,
      title: 'Mark selected properties as sold?',
      tone: 'danger',
    })
  }

  function requestBulkDelete() {
    if (!selectedProperties.length) return

    setConfirmationState({
      confirmLabel: `Delete ${selectedProperties.length} Properties`,
      description: `This will remove ${selectedProperties.length} selected propert${
        selectedProperties.length === 1 ? 'y' : 'ies'
      } and delete their uploaded images from Supabase storage.`,
      onConfirm: handleBulkDelete,
      title: 'Delete selected properties?',
      tone: 'danger',
    })
  }

  function requestRemoveImage(index, imageUrl) {
    if (!String(imageUrl ?? '').trim()) {
      handleRemoveImageField(index)
      return
    }

    const isUploadedImage = isUploadedPropertyImage(imageUrl)
    const existsOnSavedListing = initialImageUrls.includes(imageUrl)

    setConfirmationState({
      confirmLabel: 'Delete Image',
      description: isUploadedImage
        ? existsOnSavedListing
          ? 'This will remove the image from this property. The uploaded file will be deleted from Supabase storage after you save the property.'
          : 'This will remove the image and delete the uploaded file from Supabase storage immediately.'
        : 'This will remove the image URL from this property.',
      onConfirm: () => handleRemoveImageField(index),
      title: 'Delete image?',
      tone: 'danger',
    })
  }

  async function handleConfirmAction() {
    if (!confirmationState?.onConfirm) return

    setIsConfirmingAction(true)

    try {
      await confirmationState.onConfirm()
      setConfirmationState(null)
    } finally {
      setIsConfirmingAction(false)
    }
  }

  function handleImageChange(index, value) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      coverImageIndex:
        currentDraft.coverImageIndex === index && !value.trim()
          ? -1
          : currentDraft.coverImageIndex,
      imageUrls: currentDraft.imageUrls.map((imageUrl, imageIndex) =>
        imageIndex === index ? value : imageUrl,
      ),
    }))
  }

  function handleSelectCoverImage(index) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      coverImageIndex: index,
    }))
  }

  function prependImageUrls(nextImageUrls) {
    setImageDisplayNumbers((currentDisplayNumbers) => {
      const nextDisplayNumbers = [...currentDisplayNumbers]

      nextImageUrls.forEach(() => {
        nextDisplayNumbers.unshift(getNextImageDisplayNumber(nextDisplayNumbers))
      })

      return nextDisplayNumbers
    })

    setDraft((currentDraft) => {
      return {
        ...currentDraft,
        imageUrls: [...nextImageUrls, ...currentDraft.imageUrls],
        coverImageIndex:
          currentDraft.coverImageIndex >= 0
            ? currentDraft.coverImageIndex + nextImageUrls.length
            : -1,
      }
    })
  }

  function handleAddImageField() {
    setImagePage(1)
    setImageDisplayNumbers((currentDisplayNumbers) => [
      getNextImageDisplayNumber(currentDisplayNumbers),
      ...currentDisplayNumbers,
    ])
    setDraft((currentDraft) => ({
      ...currentDraft,
      imageUrls: ['', ...currentDraft.imageUrls],
      coverImageIndex:
        currentDraft.coverImageIndex >= 0 ? currentDraft.coverImageIndex + 1 : -1,
    }))
  }

  async function deletePropertyImagesFromStorage(imageUrls) {
    if (!hasSupabaseConfig || !supabase) return true

    const storagePaths = imageUrls
      .filter((imageUrl) => isUploadedPropertyImage(imageUrl))
      .map((imageUrl) => getPropertyImageStoragePath(imageUrl))
      .filter(Boolean)

    if (!storagePaths.length) return true

    const { error } = await supabase.storage
      .from(PROPERTY_IMAGES_BUCKET)
      .remove(storagePaths)

    return !error
  }

  async function handleRemoveImageField(index) {
    const imageUrl = draft.imageUrls[index] ?? ''
    const isUploadedImage = isUploadedPropertyImage(imageUrl)
    const existsOnSavedListing = initialImageUrls.includes(imageUrl)

    if (isUploadedImage && !existsOnSavedListing) {
      const didDeleteFromStorage = await deletePropertyImagesFromStorage([imageUrl])

      if (!didDeleteFromStorage) {
        setFormMessage('Image could not be deleted from Supabase storage. Try again.')
        return
      }
    }

    setDraft((currentDraft) => {
      const nextImageUrls = currentDraft.imageUrls.filter(
        (_, imageIndex) => imageIndex !== index,
      )
      const nextCoverImageIndex =
        currentDraft.coverImageIndex === index
          ? -1
          : currentDraft.coverImageIndex > index
            ? currentDraft.coverImageIndex - 1
            : currentDraft.coverImageIndex

      return {
        ...currentDraft,
        imageUrls: nextImageUrls,
        coverImageIndex: nextCoverImageIndex,
      }
    })
    setImageDisplayNumbers((currentDisplayNumbers) =>
      currentDisplayNumbers.filter((_, imageIndex) => imageIndex !== index),
    )

    if (isUploadedImage && existsOnSavedListing) {
      setPendingDeletedImageUrls((currentImageUrls) =>
        currentImageUrls.includes(imageUrl)
          ? currentImageUrls
          : [...currentImageUrls, imageUrl],
      )
    }
  }

  async function handleUploadImages(event) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''

    if (!files.length) return

    if (!hasSupabaseConfig || !supabase) {
      setFormMessage(
        'Supabase is not configured yet. Add the environment variables before uploading images.',
      )
      return
    }

    setIsUploadingImages(true)
    setFormMessage('')

    const draftFolder = selectedListingId || `draft-${crypto.randomUUID()}`
    const uploadedImageUrls = []
    const failedUploads = []

    for (const [index, file] of files.entries()) {
      const filePath = `properties/${draftFolder}/${Date.now()}-${index}-${normalizeFileName(file.name)}`
      const { error: uploadError } = await supabase.storage
        .from(PROPERTY_IMAGES_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        failedUploads.push(file.name)
        continue
      }

      const { data } = supabase.storage
        .from(PROPERTY_IMAGES_BUCKET)
        .getPublicUrl(filePath)

      if (data?.publicUrl) {
        uploadedImageUrls.push(data.publicUrl)
      } else {
        failedUploads.push(file.name)
      }
    }

    if (uploadedImageUrls.length) {
      setImagePage(1)
      prependImageUrls(uploadedImageUrls)
    }

    if (uploadedImageUrls.length && failedUploads.length) {
      setFormMessage(
        `${uploadedImageUrls.length} image(s) uploaded. ${failedUploads.length} failed.`,
      )
    } else if (uploadedImageUrls.length) {
      setFormMessage(`${uploadedImageUrls.length} image(s) uploaded successfully.`)
    } else {
      setFormMessage('Images could not be uploaded. Check the storage bucket and policies.')
    }

    setIsUploadingImages(false)
  }

  async function handleSave(event) {
    event.preventDefault()

    const normalizedImageEntries = draft.imageUrls
      .map((imageUrl, index) => ({
        imageUrl: imageUrl.trim(),
        index,
      }))
      .filter(({ imageUrl }) => Boolean(imageUrl))
    const normalizedImageUrls = normalizedImageEntries.map(
      ({ imageUrl }) => imageUrl,
    )
    const normalizedCoverImageIndex = normalizedImageEntries.findIndex(
      ({ index }) => index === draft.coverImageIndex,
    )

    if (
      !draft.streetAddress.trim() ||
      !draft.city.trim() ||
      !draft.state.trim() ||
      !draft.zipCode.trim() ||
      !hasMeaningfulPrice(draft.price) ||
      !draft.beds.trim() ||
      !draft.baths.trim() ||
      !draft.size.trim()
    ) {
      setFormMessage('Complete all property fields before saving.')
      return
    }

    if (!normalizedImageUrls.length) {
      setFormMessage('Add at least one image before saving the property.')
      return
    }

    if (normalizedCoverImageIndex === -1) {
      setFormMessage('Choose which image should be the cover before saving.')
      return
    }

    const savedListing = await savePropertyListing({
      ...draft,
      price: normalizePropertyPrice(draft.price, draft.type),
      imageUrls: normalizedImageUrls,
      coverImageIndex: normalizedCoverImageIndex,
    })

    if (!savedListing) {
      setFormMessage('Property could not be saved. Check Supabase and try again.')
      return
    }

    let nextMessage = isCreating
      ? 'Property added successfully.'
      : 'Property updated successfully.'

    if (pendingDeletedImageUrls.length) {
      const didDeletePendingImages = await deletePropertyImagesFromStorage(
        pendingDeletedImageUrls,
      )

      if (!didDeletePendingImages) {
        nextMessage =
          'Property saved, but some removed images could not be deleted from Supabase storage.'
      }
    }

    setSelectedListingId(savedListing.id)
    setDraft(createEmptyDraft(nextDisplayOrder + (isCreating ? 1 : 0)))
    setImageDisplayNumbers([])
    setIsCreating(true)
    setInitialImageUrls([])
    setPendingDeletedImageUrls([])
    setActiveTab('manage')
    setFormMessage(nextMessage)
  }

  async function handleDelete(listing) {
    const didDelete = await deletePropertyListing(listing.id)

    if (!didDelete) {
      setFormMessage('Property could not be deleted. Check Supabase and try again.')
      return
    }

    const didDeleteImages = await deletePropertyImagesFromStorage(listing.imageUrls)

    if (selectedListingId === listing.id) {
      setSelectedListingId('')
    }

    setActiveTab('manage')
    setIsCreating(true)
    setDraft(createEmptyDraft(nextDisplayOrder))
    setImageDisplayNumbers([])
    setInitialImageUrls([])
    setPendingDeletedImageUrls([])
    setFormMessage(
      didDeleteImages
        ? 'Property deleted successfully.'
        : 'Property deleted, but some uploaded images could not be deleted from Supabase storage.',
    )
  }

  async function handlePublishToggle(listing) {
    const didSave = await setPropertyListingPublished(
      listing.id,
      !listing.isPublished,
    )

    if (!didSave) {
      setFormMessage('Property status could not be updated. Try again.')
      return
    }

    setFormMessage(
      listing.isPublished ? 'Property unpublished.' : 'Property published.',
    )
  }

  async function handleMarkAsSold(listing) {
    const savedListing = await savePropertyListing({
      ...listing,
      type: 'sold',
    })

    if (!savedListing) {
      setFormMessage('Property could not be marked as sold. Try again.')
      return
    }

    setFormMessage('Property marked as sold.')
  }

  async function handleBulkUnpublish() {
    if (!selectedPublishedProperties.length) return

    const results = await Promise.all(
      selectedPublishedProperties.map((listing) =>
        setPropertyListingPublished(listing.id, false),
      ),
    )
    const successCount = results.filter(Boolean).length

    if (!successCount) {
      setFormMessage('Selected properties could not be unpublished. Try again.')
      return
    }

    clearSelectedProperties()
    setFormMessage(
      successCount === selectedPublishedProperties.length
        ? `${successCount} properties unpublished.`
        : `${successCount} properties unpublished. Some items could not be updated.`,
    )
  }

  async function handleBulkMarkAsSold() {
    if (!selectedMarkableAsSoldProperties.length) return

    let successCount = 0

    for (const listing of selectedMarkableAsSoldProperties) {
      const savedListing = await savePropertyListing({
        ...listing,
        type: 'sold',
      })

      if (savedListing) {
        successCount += 1
      }
    }

    if (!successCount) {
      setFormMessage('Selected properties could not be marked as sold. Try again.')
      return
    }

    clearSelectedProperties()
    setFormMessage(
      successCount === selectedMarkableAsSoldProperties.length
        ? `${successCount} properties marked as sold.`
        : `${successCount} properties marked as sold. Some items could not be updated.`,
    )
  }

  async function handleBulkDelete() {
    if (!selectedProperties.length) return

    let deletedCount = 0
    let storageDeleteFailed = false

    for (const listing of selectedProperties) {
      const didDelete = await deletePropertyListing(listing.id)

      if (!didDelete) continue

      deletedCount += 1

      const didDeleteImages = await deletePropertyImagesFromStorage(listing.imageUrls)
      if (!didDeleteImages) {
        storageDeleteFailed = true
      }

      if (selectedListingId === listing.id) {
        setSelectedListingId('')
      }
    }

    clearSelectedProperties()

    if (!deletedCount) {
      setFormMessage('Selected properties could not be deleted. Try again.')
      return
    }

    if (selectedProperties.some((listing) => listing.id === selectedListingId)) {
      setActiveTab('manage')
      setIsCreating(true)
      setDraft(createEmptyDraft(nextDisplayOrder))
      setImageDisplayNumbers([])
      setInitialImageUrls([])
      setPendingDeletedImageUrls([])
    }

    setFormMessage(
      storageDeleteFailed
        ? `${deletedCount} properties deleted, but some uploaded images could not be deleted from Supabase storage.`
        : `${deletedCount} properties deleted successfully.`,
    )
  }

  return (
    <SectionVisibilityGate sectionKey="properties">
      <div className="properties-admin-section">
        <div className="properties-admin-section__header">
          <p className="properties-admin-section__eyebrow">Properties</p>
          <h2 className="properties-admin-section__title">Properties Control Panel</h2>
          <p className="properties-admin-section__copy">
            Manage property content, media, category, publishing state, and listing
            details from one place.
          </p>
        </div>

        <div className="properties-admin-section__tabs" role="tablist">
          <button
            className={`properties-admin-section__tab${
              activeTab === 'editor' ? ' is-active' : ''
            }`}
            type="button"
            role="tab"
            aria-selected={activeTab === 'editor'}
            onClick={isCreating ? openAddProperty : () => setActiveTab('editor')}
          >
            {isCreating ? 'Add Property' : 'Edit Property'}
          </button>
          <button
            className={`properties-admin-section__tab${
              activeTab === 'manage' ? ' is-active' : ''
            }`}
            type="button"
            role="tab"
            aria-selected={activeTab === 'manage'}
            onClick={openManageProperties}
          >
            Manage Properties
          </button>
        </div>

        {activeTab === 'editor' ? (
          <section className="properties-admin-section__panel">
          <form
            autoComplete="off"
            className="properties-admin-section__form"
            onSubmit={handleSave}
          >
            <BrandedSuggestionField
              id="listing-street-address"
              label="Address"
              onChange={(value) => handleFieldChange('streetAddress', value)}
              placeholder="Street address"
              suggestions={fieldSuggestions.streetAddress}
              value={draft.streetAddress}
            />

            <div className="properties-admin-section__form-grid properties-admin-section__form-grid--address">
              <BrandedSuggestionField
                id="listing-city"
                label="City"
                onChange={(value) => handleFieldChange('city', value)}
                placeholder="City"
                suggestions={fieldSuggestions.city}
                value={draft.city}
              />

              <BrandedSuggestionField
                id="listing-state"
                label="State"
                onChange={(value) => handleFieldChange('state', value)}
                placeholder="State"
                suggestions={fieldSuggestions.state}
                value={draft.state}
              />

              <BrandedSuggestionField
                id="listing-zip-code"
                inputMode="numeric"
                label="ZIP code"
                onChange={(value) => handleFieldChange('zipCode', value)}
                placeholder="ZIP code"
                suggestions={fieldSuggestions.zipCode}
                value={draft.zipCode}
              />
            </div>

            <div className="properties-admin-section__field">
              <label>Category</label>
              <PropertyTypeSelect
                disabled={isSaving}
                onChange={(nextType) => handleFieldChange('type', nextType)}
                options={propertyTypeOptions}
                value={draft.type}
              />
            </div>

            <BrandedSuggestionField
              id="listing-price"
              label={getPriceFieldLabel(draft.type)}
              onChange={(value) => handleFieldChange('price', value)}
              placeholder={getPriceFieldPlaceholder(draft.type)}
              prefix="$"
              suffix={getPriceFieldSuffix(draft.type)}
              suggestions={fieldSuggestions.price}
              value={draft.price}
            />

            <div className="properties-admin-section__form-grid">
              <BrandedSuggestionField
                id="listing-beds"
                label="Beds"
                onChange={(value) => handleFieldChange('beds', value)}
                placeholder="Beds"
                suggestions={fieldSuggestions.beds}
                value={draft.beds}
              />

              <BrandedSuggestionField
                id="listing-baths"
                label="Baths"
                onChange={(value) => handleFieldChange('baths', value)}
                placeholder="Baths"
                suggestions={fieldSuggestions.baths}
                value={draft.baths}
              />

              <BrandedSuggestionField
                id="listing-size"
                label="Sqft"
                onChange={(value) => handleFieldChange('size', value)}
                placeholder="Sqft"
                suffix="sqft"
                suggestions={fieldSuggestions.size}
                value={draft.size}
              />
            </div>

            <div className="properties-admin-section__field">
              <label htmlFor="listing-description">Description</label>
              <textarea
                autoComplete="off"
                id="listing-description"
                rows="5"
                value={draft.description}
                placeholder="Property description"
                onChange={(event) =>
                  handleFieldChange('description', event.target.value)
                }
              ></textarea>
            </div>

            <div className="properties-admin-section__images">
              <div className="properties-admin-section__images-copy">
                <h4>Property images</h4>
              </div>

              <div className="properties-admin-section__image-tools">
                <div className="properties-admin-section__image-tool-actions">
                  <input
                    className="properties-admin-section__file-input"
                    ref={imageUploadInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUploadImages}
                  />

                  <button
                    className="properties-admin-section__secondary-button"
                    type="button"
                    disabled={isUploadingImages || isSaving}
                    onClick={() => imageUploadInputRef.current?.click()}
                  >
                    <Upload aria-hidden="true" size={15} strokeWidth={2.1} />
                    <span>{isUploadingImages ? 'Uploading...' : 'Upload Images'}</span>
                  </button>

                  <button
                    className="properties-admin-section__secondary-button"
                    type="button"
                    onClick={handleAddImageField}
                  >
                    <Plus aria-hidden="true" size={15} strokeWidth={2.1} />
                    <span>Add by URL</span>
                  </button>
                </div>
              </div>

              <div className="properties-admin-section__image-list">
                {paginatedDraftImages.map(({ imageUrl, index }) => {
                  const displayNumber = imageDisplayNumbers[index] ?? index + 1

                  return (
                    <div
                      className="properties-admin-section__image-row"
                      key={`${selectedListingId || 'new'}-image-${index}`}
                    >
                      <div className="properties-admin-section__image-entry">
                        {isUploadedPropertyImage(imageUrl) ? (
                          <>
                            <div className="properties-admin-section__image-card-header">
                              <div className="properties-admin-section__image-card-copy">
                                <span className="properties-admin-section__image-card-title">
                                  Image {displayNumber}
                                </span>
                                <span className="properties-admin-section__image-card-meta">
                                  Uploaded image
                                </span>
                                <span className="properties-admin-section__image-card-name">
                                  {getUploadedPropertyImageLabel(imageUrl)}
                                </span>
                              </div>

                              <div className="properties-admin-section__image-actions">
                                <button
                                  className={`properties-admin-section__cover-button${
                                    draft.coverImageIndex === index ? ' is-active' : ''
                                  }`}
                                  type="button"
                                  disabled={!imageUrl.trim()}
                                  onClick={() => handleSelectCoverImage(index)}
                                >
                                  <span>
                                    {draft.coverImageIndex === index
                                      ? 'Cover image'
                                      : 'Set as cover'}
                                  </span>
                                </button>

                                <button
                                  className="properties-admin-section__icon-button"
                                  type="button"
                                  aria-label={`Remove image ${displayNumber}`}
                                  onClick={() => requestRemoveImage(index, imageUrl)}
                                >
                                  <Trash2
                                    aria-hidden="true"
                                    size={16}
                                    strokeWidth={2.1}
                                  />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>

                            <PropertyImagePreview
                              key={imageUrl || `preview-${index}`}
                              imageUrl={imageUrl}
                              label={`Preview for image ${displayNumber}`}
                            />
                          </>
                        ) : (
                          <>
                            <label
                              className="properties-admin-section__field"
                              htmlFor={`listing-image-${index}`}
                            >
                              <span>Image {displayNumber} URL</span>
                            </label>

                            <div className="properties-admin-section__image-input-row">
                              <input
                                autoComplete="new-password"
                                id={`listing-image-${index}`}
                                type="url"
                                value={imageUrl}
                                placeholder="Image URL"
                                onChange={(event) =>
                                  handleImageChange(index, event.target.value)
                                }
                              />

                              <div className="properties-admin-section__image-actions">
                                <button
                                  className={`properties-admin-section__cover-button${
                                    draft.coverImageIndex === index ? ' is-active' : ''
                                  }`}
                                  type="button"
                                  onClick={() => handleSelectCoverImage(index)}
                                >
                                  <span>
                                    {draft.coverImageIndex === index
                                      ? 'Cover image'
                                      : 'Set as cover'}
                                  </span>
                                </button>

                                <button
                                  className="properties-admin-section__icon-button"
                                  type="button"
                                  aria-label={`Remove image ${displayNumber}`}
                                  onClick={() => requestRemoveImage(index, imageUrl)}
                                >
                                  <Trash2
                                    aria-hidden="true"
                                    size={16}
                                    strokeWidth={2.1}
                                  />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>

                            <PropertyImagePreview
                              key={imageUrl || `preview-${index}`}
                              imageUrl={imageUrl}
                              label={`Preview for image ${displayNumber}`}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <Pagination
                currentPage={imagePage}
                onPageChange={setImagePage}
                totalItems={draft.imageUrls.length}
                totalPages={totalImagePages}
              />

              {!draft.imageUrls.length ? (
                <div className="properties-admin-section__empty-state">
                  No property images added yet. Use Upload Images or Add by URL to
                  start.
                </div>
              ) : null}
            </div>

            {formMessage ? (
              <div className="properties-admin-section__message">
                {formMessage}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="properties-admin-section__message properties-admin-section__message--error">
                {errorMessage}
              </div>
            ) : null}

            <div className="properties-admin-section__form-actions">
              <button
                className="properties-admin-section__delete-button"
                type="button"
                disabled={isSaving}
                onClick={handleCancelEditor}
              >
                <X aria-hidden="true" size={16} strokeWidth={2.1} />
                <span>Cancel</span>
              </button>

              <button
                className="properties-admin-section__save-button"
                type="submit"
                disabled={isSaving}
              >
                <Save aria-hidden="true" size={16} strokeWidth={2.1} />
                <span>{isSaving ? 'Saving...' : 'Save Property'}</span>
              </button>
            </div>
          </form>
          </section>
        ) : (
          <section className="properties-admin-section__panel">
          <div className="properties-admin-section__manage-bar">
            <div className="properties-admin-section__manage-filters">
              {manageFilters.map((filter) => (
                <button
                  className={`properties-admin-section__filter${
                    manageFilter === filter.value ? ' is-active' : ''
                  }`}
                  key={filter.value}
                  type="button"
                  onClick={() => {
                    setManageFilter(filter.value)
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {selectedPropertyIds.length ? (
            <div className="properties-admin-section__bulk-actions">
              <span className="properties-admin-section__bulk-count">
                Selected: {selectedPropertyIds.length}
              </span>

              <div className="properties-admin-section__bulk-buttons">
                {selectedMarkableAsSoldProperties.length ? (
                  <button
                    className="properties-admin-section__secondary-button"
                    type="button"
                    onClick={requestBulkMarkAsSold}
                  >
                    <Check aria-hidden="true" size={15} strokeWidth={2.4} />
                    <span>
                      Mark {selectedMarkableAsSoldProperties.length} Selected as Sold
                    </span>
                  </button>
                ) : null}

                {selectedPublishedProperties.length ? (
                  <button
                    className="properties-admin-section__secondary-button"
                    type="button"
                    onClick={requestBulkUnpublish}
                  >
                    <EyeOff aria-hidden="true" size={15} strokeWidth={2.1} />
                    <span>
                      Unpublish {selectedPublishedProperties.length} Selected
                    </span>
                  </button>
                ) : null}

                <button
                  className="properties-admin-section__delete-button"
                  type="button"
                  onClick={requestBulkDelete}
                >
                  <Trash2 aria-hidden="true" size={15} strokeWidth={2.1} />
                  <span>Delete {selectedPropertyIds.length} Selected</span>
                </button>

                <button
                  className="properties-admin-section__secondary-button"
                  type="button"
                  onClick={clearSelectedProperties}
                >
                  <X aria-hidden="true" size={15} strokeWidth={2.1} />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          ) : null}

          {formMessage ? (
            <div className="properties-admin-section__message">
              {formMessage}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="properties-admin-section__message properties-admin-section__message--error">
              {errorMessage}
            </div>
          ) : null}

          {isLoading ? (
            <div className="properties-admin-section__empty-state">
              Loading properties...
            </div>
          ) : filteredListings.length ? (
            <>
              <div className="properties-admin-section__list">
                {paginatedListings.map((listing) => {
                const images = orderPropertyImages(
                  listing.imageUrls,
                  listing.coverImageIndex,
                )

                return (
                  <article
                    className={`properties-admin-section__listing${
                      selectedListingId === listing.id ? ' is-active' : ''
                    }`}
                    key={listing.id}
                  >
                    <div className="properties-admin-section__listing-select">
                      <PropertySelectionCheckbox
                        checked={selectedPropertyIds.includes(listing.id)}
                        label={`Select property ${listing.address}`}
                        onChange={() => toggleSelectedProperty(listing.id)}
                      />
                    </div>

                    <div className="properties-admin-section__listing-media">
                      <PropertyImageCarousel
                        alt={listing.address}
                        className="properties-admin-section__listing-carousel"
                        images={images}
                        size="compact"
                      />
                    </div>

                    <div className="properties-admin-section__listing-copy">
                      <div className="properties-admin-section__listing-top">
                        <div className="properties-admin-section__listing-badges">
                          <span
                            className={`properties-admin-section__listing-badge properties-admin-section__listing-badge--${listing.badgeVariant}`}
                          >
                            {listing.badge}
                          </span>
                          <span
                            className={`properties-admin-section__listing-status${
                              listing.isPublished ? ' is-published' : ' is-unpublished'
                            }`}
                          >
                            {listing.isPublished ? 'Published' : 'Unpublished'}
                          </span>
                        </div>

                        <div className="properties-admin-section__listing-actions">
                          <button
                            className="properties-admin-section__listing-action"
                            type="button"
                            onClick={() => handleSelectListing(listing.id)}
                          >
                            <PencilLine
                              aria-hidden="true"
                              size={14}
                              strokeWidth={2.1}
                            />
                            <span>Edit</span>
                          </button>

                          <button
                            className="properties-admin-section__listing-action"
                            type="button"
                            onClick={() => requestPublishToggle(listing)}
                          >
                            {listing.isPublished ? (
                              <EyeOff
                                aria-hidden="true"
                                size={14}
                                strokeWidth={2.1}
                              />
                            ) : (
                              <Eye
                                aria-hidden="true"
                                size={14}
                                strokeWidth={2.1}
                              />
                            )}
                            <span>
                              {listing.isPublished ? 'Unpublish' : 'Publish'}
                            </span>
                          </button>

                          {listing.type !== 'sold' ? (
                            <button
                              className="properties-admin-section__listing-action"
                              type="button"
                              onClick={() => requestMarkAsSold(listing)}
                            >
                              <Check
                                aria-hidden="true"
                                size={14}
                                strokeWidth={2.4}
                              />
                              <span>Mark Sold</span>
                            </button>
                          ) : null}

                          <button
                            className="properties-admin-section__listing-action properties-admin-section__listing-action--danger"
                            type="button"
                            onClick={() => requestDelete(listing)}
                          >
                            <Trash2
                              aria-hidden="true"
                              size={14}
                              strokeWidth={2.1}
                            />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      <strong>{listing.address}</strong>
                      <p>{listing.price}</p>

                      <div className="properties-admin-section__listing-meta">
                        <span>{listing.beds ? `${listing.beds} Beds` : '- Beds'}</span>
                        <span>{listing.baths ? `${listing.baths} Baths` : '- Baths'}</span>
                        <span>{listing.size}</span>
                        <span>{listing.imageUrls.length} image(s)</span>
                      </div>
                    </div>
                  </article>
                )
                })}
              </div>

              <Pagination
                currentPage={managePage}
                onPageChange={setManagePage}
                totalItems={filteredListings.length}
                totalPages={totalManagePages}
              />
            </>
          ) : (
            <div className="properties-admin-section__empty-state">
              No properties match this filter.
            </div>
          )}
          </section>
        )}
      </div>

      <ConfirmationModal
        confirmLabel={confirmationState?.confirmLabel}
        description={confirmationState?.description}
        isLoading={isConfirmingAction}
        isOpen={Boolean(confirmationState)}
        onCancel={closeConfirmation}
        onConfirm={handleConfirmAction}
        title={confirmationState?.title}
        tone={confirmationState?.tone}
      />
    </SectionVisibilityGate>
  )
}

export default Properties
