import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  PencilLine,
  Save,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import ConfirmationModal from '../common/confirmationModal/ConfirmationModal.jsx'
import SectionVisibilityGate from '../common/sectionVisibilityGate/SectionVisibilityGate.jsx'
import useTestimonials from '../../context/testimonials/useTestimonials.js'
import {
  getTestimonialSourceMeta,
  testimonialSourceOptions,
} from '../../data/testimonials.js'
import Pagination from '../common/pagination/Pagination.jsx'
import './Testimonials.scss'

const manageFilters = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Unpublished', value: 'unpublished' },
]
const MANAGE_REVIEWS_PAGE_SIZE = 4

function createEmptyDraft(nextDisplayOrder) {
  return {
    name: '',
    subtitle: '',
    review: '',
    rating: 0,
    source: 'zillow',
    sourceLabel: getTestimonialSourceMeta('zillow').sourceLabel,
    isPublished: true,
    displayOrder: nextDisplayOrder,
  }
}

function createDraftFromTestimonial(testimonial) {
  return {
    ...testimonial,
  }
}

function SourceSelect({ disabled, onChange, options, value }) {
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
    <div className="testimonials-admin-section__select" ref={selectRef}>
      <button
        className={`testimonials-admin-section__select-trigger${
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
        <div className="testimonials-admin-section__select-menu" role="listbox">
          {options.map((option) => (
            <button
              className={`testimonials-admin-section__select-option${
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

function Testimonials() {
  const {
    deleteTestimonial,
    errorMessage,
    isLoading,
    isSaving,
    saveTestimonial,
    setTestimonialPublished,
    testimonials,
  } = useTestimonials()
  const [activeTab, setActiveTab] = useState('editor')
  const [selectedTestimonialId, setSelectedTestimonialId] = useState('')
  const [draft, setDraft] = useState(() => createEmptyDraft(1))
  const [isCreating, setIsCreating] = useState(true)
  const [formMessage, setFormMessage] = useState('')
  const [manageFilter, setManageFilter] = useState('all')
  const [managePage, setManagePage] = useState(1)
  const [confirmationState, setConfirmationState] = useState(null)
  const [isConfirmingAction, setIsConfirmingAction] = useState(false)

  const nextDisplayOrder =
    testimonials.reduce(
      (highestOrder, testimonial) =>
        Math.max(highestOrder, Number(testimonial.displayOrder) || 0),
      0,
    ) + 1

  const filteredTestimonials = useMemo(() => {
    if (manageFilter === 'published') {
      return testimonials.filter((testimonial) => testimonial.isPublished)
    }
    if (manageFilter === 'unpublished') {
      return testimonials.filter((testimonial) => !testimonial.isPublished)
    }

    return testimonials
  }, [manageFilter, testimonials])
  const totalManagePages = Math.max(
    1,
    Math.ceil(filteredTestimonials.length / MANAGE_REVIEWS_PAGE_SIZE),
  )
  const paginatedTestimonials = useMemo(() => {
    const startIndex = (managePage - 1) * MANAGE_REVIEWS_PAGE_SIZE
    return filteredTestimonials.slice(
      startIndex,
      startIndex + MANAGE_REVIEWS_PAGE_SIZE,
    )
  }, [filteredTestimonials, managePage])

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

  function openAddReview() {
    setActiveTab('editor')
    setIsCreating(true)
    setSelectedTestimonialId('')
    setDraft(createEmptyDraft(nextDisplayOrder))
    setFormMessage('')
  }

  function openManageReviews() {
    setActiveTab('manage')
  }

  function handleSelectTestimonial(testimonialId) {
    const testimonial = testimonials.find((item) => item.id === testimonialId)
    if (!testimonial) return

    setActiveTab('editor')
    setIsCreating(false)
    setSelectedTestimonialId(testimonialId)
    setDraft(createDraftFromTestimonial(testimonial))
    setFormMessage('')
  }

  function handleCancelEditor() {
    setActiveTab('manage')
    setIsCreating(true)
    setSelectedTestimonialId('')
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

  function requestDelete(testimonial) {
    setConfirmationState({
      confirmLabel: 'Delete Review',
      description: `This will permanently remove the review from ${testimonial.name}.`,
      onConfirm: () => handleDelete(testimonial),
      title: 'Delete review?',
      tone: 'danger',
    })
  }

  function requestPublishToggle(testimonial) {
    const isUnpublishing = testimonial.isPublished

    setConfirmationState({
      confirmLabel: isUnpublishing ? 'Unpublish Review' : 'Publish Review',
      description: isUnpublishing
        ? `This will hide ${testimonial.name}'s review from the website until you publish it again.`
        : `This will make ${testimonial.name}'s review visible on the website.`,
      onConfirm: () => handlePublishToggle(testimonial),
      title: isUnpublishing ? 'Unpublish review?' : 'Publish review?',
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

  function handleSourceChange(source) {
    const sourceMeta = getTestimonialSourceMeta(source)

    setDraft((currentDraft) => ({
      ...currentDraft,
      source,
      sourceLabel: sourceMeta.sourceLabel,
    }))
  }

  async function handleSave(event) {
    event.preventDefault()

    if (
      !draft.name.trim() ||
      !draft.subtitle.trim() ||
      !draft.review.trim() ||
      !draft.sourceLabel.trim() ||
      Number(draft.rating) < 1
    ) {
      setFormMessage('Complete all testimonial fields before saving.')
      return
    }

    const savedTestimonial = await saveTestimonial(draft)

    if (!savedTestimonial) {
      setFormMessage(
        'Review could not be saved. Check Supabase and try again.',
      )
      return
    }

    setSelectedTestimonialId(savedTestimonial.id)
    setDraft(createEmptyDraft(nextDisplayOrder + (isCreating ? 1 : 0)))
    setIsCreating(true)
    setActiveTab('manage')
    setFormMessage(
      isCreating ? 'Review added successfully.' : 'Review updated successfully.',
    )
  }

  async function handleDelete(testimonial) {
    const didDelete = await deleteTestimonial(testimonial.id)

    if (!didDelete) {
      setFormMessage('Review could not be deleted. Check Supabase and try again.')
      return
    }

    if (selectedTestimonialId === testimonial.id) {
      setSelectedTestimonialId('')
    }

    setActiveTab('manage')
    setIsCreating(true)
    setDraft(createEmptyDraft(nextDisplayOrder))
    setFormMessage('Review deleted successfully.')
  }

  async function handlePublishToggle(testimonial) {
    const didSave = await setTestimonialPublished(
      testimonial.id,
      !testimonial.isPublished,
    )

    if (!didSave) {
      setFormMessage('Review status could not be updated. Try again.')
      return
    }

    setFormMessage(
      testimonial.isPublished ? 'Review unpublished.' : 'Review published.',
    )
  }

  function renderStars(rating, size = 16) {
    return (
      <div
        className="testimonials-admin-section__stars"
        aria-label={`${rating} star review`}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            className={index < rating ? 'is-active' : ''}
            key={`star-${index + 1}`}
            size={size}
            strokeWidth={2}
          />
        ))}
      </div>
    )
  }

  return (
    <SectionVisibilityGate sectionKey="testimonials">
      <div className="testimonials-admin-section">
        <div className="testimonials-admin-section__header">
          <p className="testimonials-admin-section__eyebrow">Testimonials</p>
          <h2 className="testimonials-admin-section__title">Review Management</h2>
          <p className="testimonials-admin-section__copy">
            Manage client reviews, source metadata, star ratings, and publishing
            status from one place.
          </p>
        </div>

        <div className="testimonials-admin-section__tabs" role="tablist">
          <button
            className={`testimonials-admin-section__tab${
              activeTab === 'editor' ? ' is-active' : ''
            }`}
            type="button"
            role="tab"
            aria-selected={activeTab === 'editor'}
            onClick={isCreating ? openAddReview : () => setActiveTab('editor')}
          >
            {isCreating ? 'Add Review' : 'Edit Review'}
          </button>
          <button
            className={`testimonials-admin-section__tab${
              activeTab === 'manage' ? ' is-active' : ''
            }`}
            type="button"
            role="tab"
            aria-selected={activeTab === 'manage'}
            onClick={openManageReviews}
          >
            Manage Reviews
          </button>
        </div>

        {activeTab === 'editor' ? (
          <section className="testimonials-admin-section__panel">
            <form className="testimonials-admin-section__form" onSubmit={handleSave}>
              <div className="testimonials-admin-section__field">
                <label htmlFor="testimonial-name">Name</label>
                <input
                  id="testimonial-name"
                  type="text"
                  value={draft.name}
                  placeholder="Client name"
                  onChange={(event) =>
                    handleFieldChange('name', event.target.value)
                  }
                />
              </div>

              <div className="testimonials-admin-section__field">
                <label htmlFor="testimonial-subtitle">Role / Subtitle</label>
                <input
                  id="testimonial-subtitle"
                  type="text"
                  value={draft.subtitle}
                  placeholder="Client role or summary"
                  onChange={(event) =>
                    handleFieldChange('subtitle', event.target.value)
                  }
                />
              </div>

              <div className="testimonials-admin-section__field">
                <label htmlFor="testimonial-review">Review</label>
                <textarea
                  id="testimonial-review"
                  rows="6"
                  value={draft.review}
                  placeholder="Write the testimonial copy"
                  onChange={(event) =>
                    handleFieldChange('review', event.target.value)
                  }
                ></textarea>
              </div>

              <div className="testimonials-admin-section__field">
                <span>Rating</span>
                <div className="testimonials-admin-section__rating-picker">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const rating = index + 1

                    return (
                      <button
                        className={`testimonials-admin-section__rating-button${
                          draft.rating >= rating ? ' is-active' : ''
                        }`}
                        key={rating}
                        type="button"
                        onClick={() => handleFieldChange('rating', rating)}
                      >
                        <Star aria-hidden="true" size={18} strokeWidth={2} />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="testimonials-admin-section__field">
                <label>Source</label>
                <SourceSelect
                  disabled={isSaving}
                  onChange={handleSourceChange}
                  options={testimonialSourceOptions}
                  value={draft.source}
                />
              </div>

              <div className="testimonials-admin-section__field">
                <label htmlFor="testimonial-source-label">Source Label</label>
                <input
                  id="testimonial-source-label"
                  type="text"
                  value={draft.sourceLabel}
                  placeholder="Verified Zillow Review"
                  onChange={(event) =>
                    handleFieldChange('sourceLabel', event.target.value)
                  }
                />
              </div>

              <div className="testimonials-admin-section__publish-row">
                <div className="testimonials-admin-section__publish-copy">
                  <span>Published</span>
                  <p>Control whether this review appears on the website.</p>
                </div>

                <button
                  className={`testimonials-admin-section__toggle${
                    draft.isPublished ? ' is-active' : ''
                  }`}
                  type="button"
                  role="switch"
                  aria-checked={draft.isPublished}
                  aria-label="Toggle published"
                  onClick={() =>
                    handleFieldChange('isPublished', !draft.isPublished)
                  }
                >
                  <span className="testimonials-admin-section__toggle-thumb"></span>
                </button>
              </div>

              {formMessage ? (
                <div className="testimonials-admin-section__message">
                  {formMessage}
                </div>
              ) : null}

              {errorMessage ? (
                <div className="testimonials-admin-section__message testimonials-admin-section__message--error">
                  {errorMessage}
                </div>
              ) : null}

              <div className="testimonials-admin-section__form-actions">
                <button
                  className="testimonials-admin-section__delete-button"
                  type="button"
                  disabled={isSaving}
                  onClick={handleCancelEditor}
                >
                  <X aria-hidden="true" size={16} strokeWidth={2.1} />
                  <span>Cancel</span>
                </button>

                <button
                  className="testimonials-admin-section__save-button"
                  type="submit"
                  disabled={isSaving}
                >
                  <Save aria-hidden="true" size={16} strokeWidth={2.1} />
                  <span>{isSaving ? 'Saving...' : 'Save Review'}</span>
                </button>
              </div>
            </form>
          </section>
        ) : activeTab === 'manage' ? (
          <section className="testimonials-admin-section__panel">
            <div className="testimonials-admin-section__manage-filters">
              {manageFilters.map((filter) => (
                <button
                  className={`testimonials-admin-section__filter${
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

            {formMessage ? (
              <div className="testimonials-admin-section__message">
                {formMessage}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="testimonials-admin-section__message testimonials-admin-section__message--error">
                {errorMessage}
              </div>
            ) : null}

            {isLoading ? (
              <div className="testimonials-admin-section__empty-state">
                Loading reviews...
              </div>
            ) : filteredTestimonials.length ? (
              <>
                <div className="testimonials-admin-section__list">
                  {paginatedTestimonials.map((testimonial) => (
                  <article
                    className={`testimonials-admin-section__review${
                      selectedTestimonialId === testimonial.id ? ' is-active' : ''
                    }`}
                    key={testimonial.id}
                  >
                    <div className="testimonials-admin-section__review-top">
                      <div>
                        {renderStars(testimonial.rating, 15)}
                        <strong>{testimonial.name}</strong>
                        <p className="testimonials-admin-section__review-subtitle">
                          {testimonial.subtitle}
                        </p>
                      </div>

                      <div className="testimonials-admin-section__review-actions">
                        <button
                          className="testimonials-admin-section__review-action"
                          type="button"
                          onClick={() => handleSelectTestimonial(testimonial.id)}
                        >
                          <PencilLine aria-hidden="true" size={14} strokeWidth={2.1} />
                          <span>Edit</span>
                        </button>

                        <button
                          className="testimonials-admin-section__review-action"
                          type="button"
                          onClick={() => requestPublishToggle(testimonial)}
                        >
                          {testimonial.isPublished ? (
                            <EyeOff aria-hidden="true" size={14} strokeWidth={2.1} />
                          ) : (
                            <Eye aria-hidden="true" size={14} strokeWidth={2.1} />
                          )}
                          <span>
                            {testimonial.isPublished ? 'Unpublish' : 'Publish'}
                          </span>
                        </button>

                        <button
                          className="testimonials-admin-section__review-action testimonials-admin-section__review-action--danger"
                          type="button"
                          onClick={() => requestDelete(testimonial)}
                        >
                          <Trash2 aria-hidden="true" size={14} strokeWidth={2.1} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    <p className="testimonials-admin-section__review-body">
                      {testimonial.review}
                    </p>

                    <div className="testimonials-admin-section__review-meta">
                      <span>{getTestimonialSourceMeta(testimonial.source).label}</span>
                      <span>{testimonial.sourceLabel}</span>
                      <span>
                        {testimonial.isPublished ? 'Published' : 'Unpublished'}
                      </span>
                    </div>
                  </article>
                  ))}
                </div>

                <Pagination
                  currentPage={managePage}
                  onPageChange={setManagePage}
                  totalItems={filteredTestimonials.length}
                  totalPages={totalManagePages}
                />
              </>
            ) : (
              <div className="testimonials-admin-section__empty-state">
                No reviews match this filter.
              </div>
            )}
          </section>
        ) : null}
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

export default Testimonials
