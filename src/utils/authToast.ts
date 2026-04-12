import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth-specific toast functions with jewelry theme
export const authToast = {
  loginRequired: (message: string = 'Please log in or create an account to use this feature.') => {
    return toast.warning(message, {
      position: 'top-right',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark',
      style: {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        border: '1px solid #f59e0b',
        borderRadius: '12px',
        color: '#f5f5dc',
        fontFamily: 'serif',
        fontSize: '14px',
        fontWeight: '500',
        padding: '16px 20px',
        boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
      },
    });
  },

  success: (message: string) => {
    return toast.success(message, {
      position: 'top-right',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark',
      style: {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        border: '1px solid #d4af37',
        borderRadius: '12px',
        color: '#f5f5dc',
        fontFamily: 'serif',
        fontSize: '14px',
        fontWeight: '500',
        padding: '16px 20px',
        boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)',
      },
    });
  },

  error: (message: string) => {
    return toast.error(message, {
      position: 'top-right',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark',
      style: {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        border: '1px solid #dc2626',
        borderRadius: '12px',
        color: '#f5f5dc',
        fontFamily: 'serif',
        fontSize: '14px',
        fontWeight: '500',
        padding: '16px 20px',
        boxShadow: '0 8px 32px rgba(220, 38, 38, 0.3)',
      },
    });
  }
};

// Hook for easy auth toast usage
export const useAuthToast = () => {
  const showLoginRequired = (message?: string) => {
    authToast.loginRequired(message);
  };

  return {
    showLoginRequired,
    success: authToast.success,
    error: authToast.error,
  };
};

export default authToast;