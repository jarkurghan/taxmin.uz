import React, { useEffect } from 'react'
import { Route,Routes,useNavigate} from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'
import MatchesPage from './pages/MatchesPage'

const App = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    navigate('/home')
  },[])
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/home' element={<h1>Home</h1>}/>
        <Route path='/matches' element={<MatchesPage/>}/>
      </Routes>
    </div>
  )
}

export default App