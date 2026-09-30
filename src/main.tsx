import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CollectionProvider } from './context/CollectionContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CollectionProvider>
      <App />
    </CollectionProvider>
  </StrictMode>,
)
