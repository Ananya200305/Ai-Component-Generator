import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import NoHome from './pages/NoHome'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='*' element={<NoHome/>}/>
    </Routes>
  )
}

export default App
