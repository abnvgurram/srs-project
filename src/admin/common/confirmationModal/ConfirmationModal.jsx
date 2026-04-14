import { useEffect } from 'react'
import './ConfirmationModal.scss'

function ConfirmationModal({
  confirmLabel = 'Confirm',
  description,
  isLoading = false,
  isOpen = false,
  onCancel,
  onConfirm,
  title,
  tone = 'default',
}) {
  useEffect(() => {
    if (!isOpen) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape' && !isLoading) {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLoading, isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="confirmation-modal"
      role="presentation"
      onClick={() => {
        if (!isLoading) onCancel()
      }}
    >
      <div
        className={`confirmation-modal__dialog confirmation-modal__dialog--${tone}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirmation-modal__header">
          <p className="confirmation-modal__eyebrow">Confirm Action</p>
          <h3 className="confirmation-modal__title" id="confirmation-modal-title">
            {title}
          </h3>
        </div>

        <p
          className="confirmation-modal__description"
          id="confirmation-modal-description"
        >
          {description}
        </p>

        <div className="confirmation-modal__actions">
          <button
            className="confirmation-modal__button confirmation-modal__button--secondary"
            type="button"
            disabled={isLoading}
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className={`confirmation-modal__button confirmation-modal__button--${tone}`}
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
