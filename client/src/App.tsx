import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { PropsWithChildren } from 'react';
import type { RootState } from './store';
import { MainLayout } from './layouts/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { IssuesPage } from './pages/IssuesPage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { IssueFormPage } from './pages/IssueFormPage';

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  if (!accessToken) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/issues" replace />} />
          <Route path="issues" element={<IssuesPage />} />
          <Route path="issues/new" element={<IssueFormPage />} />
          <Route path="issues/:id" element={<IssueDetailPage />} />
          <Route path="issues/:id/edit" element={<IssueFormPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/issues" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
