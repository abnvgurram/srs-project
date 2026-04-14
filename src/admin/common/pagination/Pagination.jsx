import { ChevronLeft, ChevronRight } from 'lucide-react'
import './Pagination.scss'

function buildPageItems(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'ellipsis', totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-2', totalPages]
}

function Pagination({ currentPage, onPageChange, totalItems, totalPages }) {
  if (totalPages <= 1) return null

  const pageItems = buildPageItems(currentPage, totalPages)

  return (
    <nav className="admin-pagination" aria-label="Pagination">
      <p className="admin-pagination__summary">
        {totalItems} item{totalItems === 1 ? '' : 's'}
      </p>

      <div className="admin-pagination__controls">
        <button
          className="admin-pagination__button"
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft aria-hidden="true" size={16} strokeWidth={2.2} />
          <span>Prev</span>
        </button>

        <div className="admin-pagination__pages">
          {pageItems.map((item) =>
            typeof item === 'number' ? (
              <button
                className={`admin-pagination__page${
                  item === currentPage ? ' is-active' : ''
                }`}
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            ) : (
              <span className="admin-pagination__ellipsis" key={item}>
                â€¦
              </span>
            ),
          )}
        </div>

        <button
          className="admin-pagination__button"
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span>Next</span>
          <ChevronRight aria-hidden="true" size={16} strokeWidth={2.2} />
        </button>
      </div>
    </nav>
  )
}

export default Pagination
