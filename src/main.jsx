import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RootRouter from './RootRouter.jsx'
import './styles/main.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootRouter />
  </StrictMode>,
)
