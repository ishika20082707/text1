/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BeaconProvider, useBeacon } from './context/BeaconContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

// Pages
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { AdmissionProcess } from './pages/AdmissionProcess';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

// Route guard for role-based authentication
const StudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useBeacon();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== 'student') return <Navigate to="/admin/dashboard" replace />;
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useBeacon();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== 'admin') return <Navigate to="/student/dashboard" replace />;
  return <>{children}</>;
};

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/admission" element={<AdmissionProcess />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Role-Based Routes */}
          <Route
            path="/student/dashboard"
            element={
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <BeaconProvider>
      <HashRouter>
        <MainLayout />
      </HashRouter>
    </BeaconProvider>
  );
}
