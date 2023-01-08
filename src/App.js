import React, { useEffect } from 'react'
import { Route,Routes,Navigate,redirect} from 'react-router-dom'
import Navbar from './components/Navbar'

const App = () => {
  // const navigate = Navigate()
  // useEffect(()=>{
  //   redirect('/home')
  // },[])
  return (
    <div>
      <Navbar/>
      <Routes>
        {/* <Route path='/*' /> */}
        <Route path='/' element={<h1>Home</h1>}/>
      </Routes>
    </div>
  )
}

export default App