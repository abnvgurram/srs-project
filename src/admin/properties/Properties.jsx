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
  X,
} from 'lucide-react'
import './Properties.scss'
import { propertyFilters } from '../../data/properties.js'
import usePropertyListings from '../../context/propertyListings/usePropertyListings.js'
import PropertyImageCarousel from '../../components/Properties/propertyImageCarousel/PropertyImageCarousel.jsx'
import ConfirmationModal from '../common/confirmationModal/ConfirmationModal.jsx'
import Pagination from '../common/pagination/Pagination.jsx'
import SectionVisibilityGate from '../common/sectionVisibilityGate/SectionVisibilityGate.jsx'

const propertyTypeOptions = propertyFilters.filter(
  (filter) => filter.value !== 'all',
)

const manageFilters = [
  { label: 'All', value: 'all' },
  { label: 'Sale', value: 'buy' },
  { label: 'Rent', value: 'rent' },
  { label: 'Sold', value: 'sold' },
]
const MANAGE_PROPERTIES_PAGE_SIZE = 4

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
    imageUrls: [''],
    coverImageIndex: 0,
    displayOrder: nextDisplayOrder,
  }
}

function createDraftFromListing(listing) {
  return {
    ...listing,
    imageUrls: listing.imageUrls.length ? listing.imageUrls : [''],
  }
}

function PropertyTypeSelect({ disabled, onChange, options, value }) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0]

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
  const [isCreating, setIsCreating] = useState(true)
  const [formMessage, setFormMessage] = useState('')
  const [manageFilter, setManageFilter] = useState('all')
  const [managePage, setManagePage] = useState(1)
  const [confirmationState, setConfirmationState] = useState(null)
  const [isConfirmingAction, setIsConfirmingAction] = useState(false)

  const nextDisplayOrder =
    propertyListings.reduce(
      (highestOrder, listing) =>
        Math.max(highestOrder, Number(listing.displayOrder) || 0),
      0,
    ) + 1
  const canAddMoreImages = draft.imageUrls.length < 5

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

  function openAddProperty() {
    setActiveTab('editor')
    setIsCreating(true)
    setSelectedListingId('')
    setDraft(createEmptyDraft(nextDisplayOrder))
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
    setFormMessage('')
  }

  function handleCancelEditor() {
    setActiveTab('manage')
    setIsCreating(true)
    setSelectedListingId('')
    setDraft(createEmptyDraft(nextDisplayOrder))
    setFormMessage('')
  }

  function handleFieldChange(field, value) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }))
  }

  function closeConfirmation() {
    if (isConfirmingAction) return
    setConfirmationState(null)
  }

  function requestDelete(listing) {
    setConfirmationState({
      confirmLabel: 'Delete Property',
      description: `This will remove "${listing.address}" from Featured Properties.`,
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
      imageUrls: currentDraft.imageUrls.map((imageUrl, imageIndex) =>
        imageIndex === index ? value : imageUrl,
      ),
    }))
  }

  function handleAddImageField() {
    if (!canAddMoreImages) return

    setDraft((currentDraft) => ({
      ...currentDraft,
      imageUrls: [...currentDraft.imageUrls, ''],
    }))
  }

  function handleRemoveImageField(index) {
    setDraft((currentDraft) => {
      const nextImageUrls = currentDraft.imageUrls.filter(
        (_, imageIndex) => imageIndex !== index,
      )

      return {
        ...currentDraft,
        imageUrls: nextImageUrls.length ? nextImageUrls : [''],
        coverImageIndex: 0,
      }
    })
  }

  async function handleSave(event) {
    event.preventDefault()

    const normalizedImageUrls = draft.imageUrls
      .map((imageUrl) => imageUrl.trim())
      .filter(Boolean)

    if (
      !draft.streetAddress.trim() ||
      !draft.city.trim() ||
      !draft.state.trim() ||
      !draft.zipCode.trim() ||
      !draft.price.trim() ||
      !draft.beds.trim() ||
      !draft.baths.trim() ||
      !draft.size.trim()
    ) {
      setFormMessage('Complete all property fields before saving.')
      return
    }

    if (!normalizedImageUrls.length) {
      setFormMessage('Add at least one image URL before saving the property.')
      return
    }

    const savedListing = await savePropertyListing({
      ...draft,
      imageUrls: normalizedImageUrls,
      coverImageIndex: 0,
    })

    if (!savedListing) {
      setFormMessage('Property could not be saved. Check Supabase and try again.')
      return
    }

    setSelectedListingId(savedListing.id)
    setDraft(createEmptyDraft(nextDisplayOrder + (isCreating ? 1 : 0)))
    setIsCreating(true)
    setActiveTab('manage')
    setFormMessage(
      isCreating ? 'Property added successfully.' : 'Property updated successfully.',
    )
  }

  async function handleDelete(listing) {
    const didDelete = await deletePropertyListing(listing.id)

    if (!didDelete) {
      setFormMessage('Property could not be deleted. Check Supabase and try again.')
      return
    }

    if (selectedListingId === listing.id) {
      setSelectedListingId('')
    }

    setActiveTab('manage')
    setIsCreating(true)
    setDraft(createEmptyDraft(nextDisplayOrder))
    setFormMessage('Property deleted successfully.')
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

  return (
    <SectionVisibilityGate sectionKey="properties">
      <div className="properties-admin-section">
        <div className="properties-admin-section__header">
          <p className="properties-admin-section__eyebrow">Featured Properties</p>
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
          <form className="properties-admin-section__form" onSubmit={handleSave}>
            <div className="properties-admin-section__field">
              <label htmlFor="listing-street-address">Address</label>
              <input
                id="listing-street-address"
                type="text"
                value={draft.streetAddress}
                placeholder="Street address"
                onChange={(event) =>
                  handleFieldChange('streetAddress', event.target.value)
                }
              />
            </div>

            <div className="properties-admin-section__form-grid properties-admin-section__form-grid--address">
              <div className="properties-admin-section__field">
                <label htmlFor="listing-city">City</label>
                <input
                  id="listing-city"
                  type="text"
                  value={draft.city}
                  placeholder="City"
                  onChange={(event) =>
                    handleFieldChange('city', event.target.value)
                  }
                />
              </div>

              <div className="properties-admin-section__field">
                <label htmlFor="listing-state">State</label>
                <input
                  id="listing-state"
                  type="text"
                  value={draft.state}
                  placeholder="State"
                  onChange={(event) =>
                    handleFieldChange('state', event.target.value)
                  }
                />
              </div>

              <div className="properties-admin-section__field">
                <label htmlFor="listing-zip-code">ZIP code</label>
                <input
                  id="listing-zip-code"
                  type="text"
                  value={draft.zipCode}
                  placeholder="ZIP code"
                  onChange={(event) =>
                    handleFieldChange('zipCode', event.target.value)
                  }
                />
              </div>
            </div>

            <div className="properties-admin-section__field">
              <label htmlFor="listing-price">Price</label>
              <input
                id="listing-price"
                type="text"
                value={draft.price}
                placeholder="Price"
                onChange={(event) =>
                  handleFieldChange('price', event.target.value)
                }
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

            <div className="properties-admin-section__form-grid">
              <div className="properties-admin-section__field">
                <label htmlFor="listing-beds">Beds</label>
                <input
                  id="listing-beds"
                  type="text"
                  value={draft.beds}
                  placeholder="Beds"
                  onChange={(event) =>
                    handleFieldChange('beds', event.target.value)
                  }
                />
              </div>

              <div className="properties-admin-section__field">
                <label htmlFor="listing-baths">Baths</label>
                <input
                  id="listing-baths"
                  type="text"
                  value={draft.baths}
                  placeholder="Baths"
                  onChange={(event) =>
                    handleFieldChange('baths', event.target.value)
                  }
                />
              </div>

              <div className="properties-admin-section__field">
                <label htmlFor="listing-size">Sqft</label>
                <input
                  id="listing-size"
                  type="text"
                  value={draft.size}
                  placeholder="Sqft"
                  onChange={(event) =>
                    handleFieldChange('size', event.target.value)
                  }
                />
              </div>
            </div>

            <div className="properties-admin-section__field">
              <label htmlFor="listing-description">Description</label>
              <textarea
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
                <p>Image 1 becomes the main cover image on the website. Max 5.</p>
              </div>

              <div className="properties-admin-section__image-list">
                {draft.imageUrls.map((imageUrl, index) => (
                  <div
                    className="properties-admin-section__image-row"
                    key={`${selectedListingId || 'new'}-image-${index}`}
                  >
                    <div className="properties-admin-section__image-entry">
                      <label
                        className="properties-admin-section__field"
                        htmlFor={`listing-image-${index}`}
                      >
                        <span>Image {index + 1} URL</span>
                      </label>

                      <div className="properties-admin-section__image-input-row">
                        <input
                          id={`listing-image-${index}`}
                          type="url"
                          value={imageUrl}
                          placeholder="Image URL"
                          onChange={(event) =>
                            handleImageChange(index, event.target.value)
                          }
                        />

                        <button
                          className="properties-admin-section__icon-button"
                          type="button"
                          aria-label={`Remove image ${index + 1}`}
                          onClick={() => handleRemoveImageField(index)}
                        >
                          <Trash2 aria-hidden="true" size={16} strokeWidth={2.1} />
                          <span>Delete</span>
                        </button>
                      </div>

                      <PropertyImagePreview
                        key={imageUrl || `preview-${index}`}
                        imageUrl={imageUrl}
                        label={`Preview for image ${index + 1}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="properties-admin-section__image-actions">
                <button
                  className="properties-admin-section__secondary-button"
                  type="button"
                  disabled={!canAddMoreImages}
                  onClick={handleAddImageField}
                >
                  <Plus aria-hidden="true" size={15} strokeWidth={2.1} />
                  <span>Add another</span>
                </button>
              </div>
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
                const images = listing.imageUrls

                return (
                  <article
                    className={`properties-admin-section__listing${
                      selectedListingId === listing.id ? ' is-active' : ''
                    }`}
                    key={listing.id}
                  >
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
                        <span>{listing.beds}</span>
                        <span>{listing.baths}</span>
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
