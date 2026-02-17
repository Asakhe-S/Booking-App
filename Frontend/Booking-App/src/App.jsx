import React, { useContext, useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { UserContext } from './components/UserContext.jsx'
import Navbar from './components/Navbar.jsx'
import { Outlet } from 'react-router-dom'

function App() {
  const { user, setUser } = useContext(UserContext);
  const [ loading, setLoading ] = useState(true);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [setUser]);

  if (loading) {
    return <div>Loading...</div>;
  }
  

  return (
    <>
      <Navbar></Navbar>
      <Outlet></Outlet>
    </>
    
  )
}

export default App
