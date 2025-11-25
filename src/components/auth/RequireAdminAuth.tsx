import { useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface RequireAdminAuthProps {
  children: ReactNode;
}

export function RequireAdminAuth({ children }: RequireAdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const adminSession = localStorage.getItem('admin_session');
        
        if (!adminSession) {
          setIsAuthenticated(false);
          return;
        }

        const session = JSON.parse(adminSession);
        const expiresAt = new Date(session.expiresAt);
        const now = new Date();

        if (now > expiresAt) {
          localStorage.removeItem('admin_session');
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error checking admin auth:', error);
        localStorage.removeItem('admin_session');
        setIsAuthenticated(false);
      }
    };

    checkAdminAuth();
  }, [location]);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/admin/login', { state: { from: location.pathname }, replace: true });
    }
  }, [isAuthenticated, location, navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
