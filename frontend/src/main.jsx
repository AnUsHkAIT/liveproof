import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

function CompanyWrapper() {
  const { company } = useParams()
  return <App companySlug={company} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App companySlug={null} />} />
        <Route path="/for/:company" element={<CompanyWrapper />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)