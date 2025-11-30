import React from 'react'
    import ReactDOM from 'react-dom/client'
    import App from './App.jsx'
    import './index.css'
    import { ShopifyProvider } from './context/ShopifyContext' // ✅ AJOUT

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <ShopifyProvider> {/* ✅ ON ENVELOPPE L'APP */}
          <App />
        </ShopifyProvider>
      </React.StrictMode>,
    )