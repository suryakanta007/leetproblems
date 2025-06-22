import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import Layout from './layout/Layout'

const App = () => {

  const { authUser, checkAuth, ischeckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  console.log("Auth User : ", authUser);
  if (ischeckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }


  return (
    <>
      <div className='flex flex-col items-center justify-center'>
        <Toaster />
        <Routes>
          <Route path='/' element={<Layout/>}>
            <Route
              index
              element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
            />
          </Route>
          <Route
            path='/login'
            element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
          />
          <Route
            path='/signup'
            element={!authUser ? <SignupPage /> : <Navigate to={"/"} />}
          />

        </Routes>
      </div>

    </>
  )
}

export default App