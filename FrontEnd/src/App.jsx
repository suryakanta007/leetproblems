import React,{useEffect} from 'react'
import { Routes,Route,Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import {Toaster} from 'react-hot-toast'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'

const App = () => {

  const {authUser,checkAuth,ischeckingAuth}= useAuthStore();

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  if(ischeckingAuth&&!authUser){
    return(
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }


  return (
   <>
    <div className='flex flex-col items-center justify-center'>
    <Toaster/>
    <Routes>
      <Route
      path='/login'
      element={!authUser?<LoginPage/>:<Navigate to={"/"}/>}
      />
      <Route
      path='/signup'
      element={!authUser?<SignupPage/>:<Navigate to={"/"}/>}
      />
      <Route
      path='/'
      element={authUser?<HomePage/>:<Navigate to={"/login"}/>}
      />
    </Routes>
    </div>
    
   </>
  )
}

export default App