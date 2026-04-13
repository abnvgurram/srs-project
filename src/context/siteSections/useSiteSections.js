import { useContext } from 'react'
import SiteSectionsContext from './siteSectionsContext.js'

function useSiteSections() {
  const context = useContext(SiteSectionsContext)

  if (!context) {
    throw new Error('useSiteSections must be used within SiteSectionsProvider')
  }

  return context
}

export default useSiteSections
