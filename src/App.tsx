import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import {Dashboard, UserProfile, PetMedicalRecord, PetReminders, UserWelcome, PetProfile, LostPetComponent} from './components/index';
import PrivateRoute from '../backend/routes/PrivateRoute';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Dashboard />} />
        <Route path="/" element={<UserWelcome />} />
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
         <Route path="/recordatorios/" element={
          <PrivateRoute>
            <PetReminders />
          </PrivateRoute>
        } />
        <Route path="/mascotas" element={
          <PrivateRoute>
            <PetProfile />
          </PrivateRoute>
        } />
        <Route path="/perdidos" element={
          <PrivateRoute>
            <LostPetComponent />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
