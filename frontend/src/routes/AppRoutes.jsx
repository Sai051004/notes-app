import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { MainLayout } from '../layouts/MainLayout.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import CreateNotePage from '../pages/CreateNotePage.jsx';
import EditNotePage from '../pages/EditNotePage.jsx';
import SharedNotesPage from '../pages/SharedNotesPage.jsx';
import SearchPage from '../pages/SearchPage.jsx';
import NoteHistoryPage from '../pages/NoteHistoryPage.jsx';
import AboutPage from '../pages/AboutPage.jsx';

export const AppRoutes = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>

    <Route
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/" element={<DashboardPage />} />
      <Route path="/notes/new" element={<CreateNotePage />} />
      <Route path="/notes/:id/edit" element={<EditNotePage />} />
      <Route path="/notes/:id/history" element={<NoteHistoryPage />} />
      <Route path="/shared" element={<SharedNotesPage />} />
      <Route path="/search" element={<SearchPage />} />
    </Route>

    <Route path="/about" element={<AboutPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
