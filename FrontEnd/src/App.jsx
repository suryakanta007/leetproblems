import React from 'react'
import { Routes,Route,Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'

const App = () => {
  return (
   <>
    <div className='flex flex-col items-center justify-center'>
    <Routes>
      <Route
      path='/login'
      element={<LoginPage/>}
      />
      <Route
      path='signup'
      element={<SignupPage/>}
      />
      <Route
      path='/'
      element={<HomePage/>}
      />
    </Routes>
    </div>
    
   </>
  )
}

export default App