import { useState } from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dash from './pages/Dashboard'
import './index.css'
import Verify from './pages/VerificationResults'
import History from './pages/VerificationHistory'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dash" element={<Dash/>} />
        <Route path="/VR" element={<Verify/>}/>
        <Route path="/hist" element={<History/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
