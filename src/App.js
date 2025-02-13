import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './page/HomePage'
import ServerMonitor from './page/ServerMonitor'
import LongTerm from './page/LongTerm'

function App() {
  return (
    <div>
      <Routes>

      <Route path='/serverDetail' element={<ServerMonitor />}  />
      <Route path='/' element={<HomePage />}  />

      </Routes>
    </div>
  )
}

export default App