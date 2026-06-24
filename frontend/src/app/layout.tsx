import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './(auth)/login/page';
import RegisterPage from './(auth)/register/page';
import OnboardingPage from './(auth)/onboarding/page';
import DashboardLayout from './(dashboard)/layout';
import DashboardPage from './(dashboard)/page';
import TasksPage from './(dashboard)/tasks/page';
import FocusPage from './(dashboard)/focus/page';
import WorkloadPage from './(dashboard)/workload/page';
import ChatPage from './(dashboard)/chat/page';

export const RootLayout: React.FC = () => {
  return (
    <Routes>
      {/* Auth Group */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Dashboard Group */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="focus" element={<FocusPage />} />
        <Route path="workload" element={<WorkloadPage />} />
        <Route path="chat" element={<ChatPage />} />
      </Route>

      {/* Redirect all unmatched routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default RootLayout;
