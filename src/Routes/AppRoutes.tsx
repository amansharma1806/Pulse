import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from "../Layout/AdminDashboard";
import Random from "../Components/Patient/Sidebar/Random";
import LoginPage from "../Pages/Loginpage";
import RegisterPage from "../Pages/Registerpage";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import PatientDashboard from "../Layout/PatientDashboard";
import PatientProfilePage from "../Pages/Patient/PatientProfilePage";
import DoctorDashboard from "../Layout/DoctorDashboard";
import DoctorProfilePage from "../Pages/Doctor/DoctorProfilePage";
import PatientAppointmentPage from "../Pages/Patient/PatientAppointmentPage";
import DoctorAppointmentPage from "../Pages/Doctor/DoctorAppointmentPage";
import DoctorAppointmentDetailsPage from "../Pages/Doctor/DoctorAppointmentDetailsPage";
import PharmacyPage from "../Pages/Doctor/PharmacyPage";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={ <PublicRoute><LoginPage /></PublicRoute> } />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

                {/* All dashboard routes go here */}
                <Route path="/" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>   }>
                    <Route path="/dashboard" element={<Random />} />
                    <Route path="/pharmacy" element={<Random />} />
                    <Route path="/patients" element={<Random />} />
                    <Route path="/doctors" element={<Random />} />
                </Route>
                 <Route path="/doctor" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>   }>
                    <Route path="dashboard" element={<Random />} />
                    <Route path="patient" element={<Random />} />
                    <Route path="profile" element={<DoctorProfilePage />} />

                    <Route path="appointments/:id" element={<DoctorAppointmentDetailsPage />} />

                    <Route path="appointments" element={<DoctorAppointmentPage />} />
                    <Route path="pharmacy" element={<PharmacyPage />} />
                </Route>
                <Route path="/patient" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>   }>
                    <Route path="dashboard" element={<Random />} />
                    <Route path="profile" element={<PatientProfilePage />} />
                    <Route path="appointments" element={<PatientAppointmentPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
