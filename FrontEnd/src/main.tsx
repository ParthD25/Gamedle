import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
//pages
import App from './App.tsx'
import DailyGuess from './pages/DailyGuess.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Routes */}
        <Route path='/' element={<App />} />
        <Route path ='/DailyGuess' element={<DailyGuess/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
