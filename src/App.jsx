import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import NotificationBar from './components/NotificationBar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LoginModal from './components/LoginModal';
import OwnerLoginModal from './components/OwnerLoginModal';
import Home from './pages/Home';
import ParentDashboard from './pages/ParentDashboard';
import OwnerPortal_x9f2 from './pages/OwnerPortal_x9f2';

export default function App() {
  const [isParentLoginOpen, setIsParentLoginOpen] = useState(false);
  const [isOwnerLoginOpen, setIsOwnerLoginOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF3E7] text-[#231A12] selection:bg-[#D97B29] selection:text-white">
      
      {/* 1. Brand Header in Espresso (#3B2314) */}
      <Navbar 
        onOpenParentLogin={() => setIsParentLoginOpen(true)}
      />

      {/* 2. Thin Line of Notifications */}
      <NotificationBar />

      {/* 3. Main Content Routes */}
      <main className="flex-1">
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                onOpenParentLogin={() => setIsParentLoginOpen(true)}
              />
            } 
          />

          <Route 
            path="/parent-dashboard" 
            element={
              <ProtectedRoute requiredRole="PARENT">
                <ParentDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin-portal-x9f2" 
            element={
              <ProtectedRoute requiredRole="OWNER">
                <OwnerPortal_x9f2 />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 4. Footer in Espresso (#3B2314) with Bottom Owner Login */}
      <Footer 
        onOpenOwnerLogin={() => setIsOwnerLoginOpen(true)}
      />

      {/* 5. Minimal Parent Login Modal */}
      <LoginModal
        isOpen={isParentLoginOpen}
        onClose={() => setIsParentLoginOpen(false)}
      />

      {/* 6. Owner Login Modal */}
      <OwnerLoginModal
        isOpen={isOwnerLoginOpen}
        onClose={() => setIsOwnerLoginOpen(false)}
      />

    </div>
  );
}
