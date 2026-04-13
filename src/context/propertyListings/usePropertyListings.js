import { useContext } from 'react'
import PropertyListingsContext from './propertyListingsContext.js'

function usePropertyListings() {
  const context = useContext(PropertyListingsContext)

  if (!context) {
    throw new Error(
      'usePropertyListings must be used within PropertyListingsProvider',
    )
  }

  return context
}

export default usePropertyListings
