import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthSessionHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const onSessionExpired = () => {
      toast.info('Session expired. Please sign in again.');
      navigate('/login', { replace: true });
    };

    window.addEventListener('notes:session-expired', onSessionExpired);
    return () => window.removeEventListener('notes:session-expired', onSessionExpired);
  }, [navigate]);

  return null;
};
