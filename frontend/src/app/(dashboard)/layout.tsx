import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import AppContainer from '../../components/layout/AppContainer';
import TopNavbar from '../../components/layout/TopNavbar';
import SettingsSlideOver from '../../components/layout/SettingsSlideOver';
import WorkspaceLoader from '../../components/layout/WorkspaceLoader';
import { api } from '../../lib/api';
import { authStorage } from '../../lib/auth';
import { User } from '../../types';

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    // Fast-path: no token → redirect immediately
    if (!authStorage.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Verify token with server and get user data
    api.getCurrentUser()
      .then((currentUser) => {
        if (!currentUser) {
          navigate('/login');
        } else {
          setUser(currentUser);
          const onboardingCompleted = localStorage.getItem('nexa_onboarding_completed');
          if (!onboardingCompleted) {
            navigate('/onboarding');
          } else {
            setAuthChecked(true);
          }
        }
      })
      .catch(() => {
        navigate('/login');
      });
  }, [navigate]);

  const handleSettingsSave = async () => {
    // Refresh user state so header renders updated name/avatar instantly
    const refreshed = await api.getCurrentUser();
    if (refreshed) setUser(refreshed);
    setSettingsOpen(false);
    // Notify child views (like Workload page) that settings saved
    window.dispatchEvent(new Event('nexa_settings_updated'));
  };

  if (!authChecked || !user) {
    return <WorkspaceLoader />;
  }

  return (
    <div className="w-screen h-screen bg-[#F8F9FB] overflow-hidden flex select-none font-sans relative">
      {/* Navigation panel */}
      <Sidebar />

      {/* Workspace canvas */}
      <AppContainer>
        <TopNavbar onProfileClick={() => setSettingsOpen(true)} user={user} />

        {/* Active Route Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F8F9FB] custom-scrollbar flex flex-col">
          <Outlet />
        </main>
      </AppContainer>

      {/* Settings Side Panel Overlay */}
      <SettingsSlideOver 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        onSave={handleSettingsSave} 
        user={user}
      />
    </div>
  );
};

export default DashboardLayout;
