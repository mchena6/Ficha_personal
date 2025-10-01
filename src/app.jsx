import './app.css'
import Tarjeta from './layouts/Tarjeta'
import Home from './layouts/Home'
import Personas from './layouts/Personas'
import {Routes, Route} from 'react-router-dom'
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/tarjeta' element={<Tarjeta/>}/>
        <Route path='/personas' element={<Personas/>}/>
        <Route path="/tarjeta/:id" element={<Tarjeta />} />
      </Routes>
    </>
  )
}

export default App
