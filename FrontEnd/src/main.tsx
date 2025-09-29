import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
//pages
import App from './App.tsx'
import DailyGuess from './pages/DailyGuess.tsx'
import LoginPage from './pages/LoginPage.tsx'
import SignUpPage from './pages/SignUpPage.tsx'
import ForgotPassword from './pages/ForgotPassword.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Routes */}
        <Route path='/'               element={<App />} />
        <Route path='/DailyGuess'     element={<DailyGuess/>}/>
        <Route path='login'           element={<LoginPage/>}/>
        <Route path='signUp'          element={<SignUpPage/>}/>
        <Route path='forgotPassword'  element={<ForgotPassword/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
