import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
// pages
import App from './App.tsx'
import DailyGuess from './pages/DailyGuess.tsx'
import LoginPage from './pages/LoginPage.tsx'
import SignUpPage from './pages/SignUpPage.tsx'
import ForgotPassword from './pages/ForgotPassword.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import Leaderboard from './components/Leaderboard.tsx'
import { Lookup } from './pages/Lookup.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<App />} />
            <Route path='DailyGuess' element={<ProtectedRoute><DailyGuess/></ProtectedRoute>} />
            <Route path='login' element={<LoginPage/>} />
            <Route path='signup' element={<SignUpPage/>} />
            <Route path='/Leaderboard' element={<Leaderboard/>} />
            <Route path='/Lookup' element={<Lookup/>} />
            <Route path='forgotPassword' element={<ForgotPassword/>} />
            <Route path='profile' element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
