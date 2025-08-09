import './App.css'
import FloatingShape from './components/FloatingShapes'

//Pages
import SignUpPage from "./pages/SignUpPage";
import Login from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import EmailVerificationPage from './pages/EmailVerificationPage';
import LoadingSpinner from './pages/LoadingSpinner';
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from './pages/ResetPasswordPage';

import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

//Protect routes that require authenticated
const ProtectedRoute = ({children})=>{
  const {isAuthenticated, user} = useAuthStore();
  if(!isAuthenticated){
    return <Navigate to="/login" replace/>
  }
  if(!user.isVerified){
    return <Navigate to="/email-verification" replace/>
  }
  return children
}

//Redirect to home page if authenticated
const RedirectAuthenticatedUser = ({children})=>{
  const {isAuthenticated, user} = useAuthStore();
  if(isAuthenticated && user.isVerified){
    return <Navigate to="/" replace/>
  }
  return children;
};

function App() {

  const {checkAuth, isCheckingAuth, isAuthenticated, user} = useAuthStore();

  useEffect(()=>{
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth) return <LoadingSpinner/>

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
        <FloatingShape color="bg-green-500" size="w-64 h-64" top="5%" left="10%" delay={0}/>
        <FloatingShape color="bg-emerald-500" size="w-48 h48" top="70%" left="80%" delay={5}/>
        <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="10%" delay={2}/>

        <Routes>
          <Route path='/' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path='/signup' element={<RedirectAuthenticatedUser><SignUpPage/></RedirectAuthenticatedUser>}/>
          <Route path='/login' element={<RedirectAuthenticatedUser><Login/></RedirectAuthenticatedUser>}/>
          <Route path='/email-verification' element={<RedirectAuthenticatedUser><EmailVerificationPage/></RedirectAuthenticatedUser>}/>
          <Route path='/forgot-password' element={<RedirectAuthenticatedUser><ForgotPasswordPage/></RedirectAuthenticatedUser>}/>
          <Route path='/reset-password/:token' element={<RedirectAuthenticatedUser><ResetPasswordPage/></RedirectAuthenticatedUser>}/>
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
        <Toaster/>
      </div>
    </>
  )
}

export default App;

