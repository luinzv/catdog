import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import {Dashboard, UserProfile, PetMedicalRecord, PetReminders, UserWelcome, PetProfile} from './components/index';
import PrivateRoute from './routes/PrivateRoute';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bienvenida" element={<UserWelcome />} />
        <Route path="/perfil" element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        } />
         <Route path="/ficha-medica/:id" element={
          <PrivateRoute>
            <PetMedicalRecord />
          </PrivateRoute>
        } />
         <Route path="/recordatorios/:id" element={
          <PrivateRoute>
            <PetReminders />
          </PrivateRoute>
        } />
        <Route path="/mascotas" element={
          <PrivateRoute>
            <PetProfile />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
