import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import {Dashboard, UserProfile, PetMedicalRecord} from './components/index';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/perfil" element={<UserProfile />} />
        <Route path="/ficha-medica" element={<PetMedicalRecord />} />
        {/* <Route 
          path="/perfil" 
          element={<PrivateRoute element={UserProfile} />} 
        /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
