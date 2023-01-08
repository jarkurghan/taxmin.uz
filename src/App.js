import React, { useEffect } from 'react'
import { Route,Routes,Navigate,redirect} from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'

const App = () => {

  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<h1>Home</h1>}/>
      </Routes>
    </div>
  )
}

export default App