import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
      {/* <div className="text-4xl text-red-600 font-bold p-10">TEST RENDER - If you see this, React is working</div> */}
    </HelmetProvider>
  </StrictMode>,
)
