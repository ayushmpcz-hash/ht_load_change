import Cookies from 'js-cookie';

export const handleTokenExpiry = (error, navigate = null) => {
  const status = error?.response?.status;
  const detail = error?.response?.data?.detail;

  // ✅ Token expired condition
  if (status === 403 && detail === 'Token expired') {
    // Optional alert / toast
    alert('Session expired. Please login again.');

    // Clear auth data
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    localStorage.clear();

    // Redirect
    if (navigate) {
      navigate('/department-login', { replace: true });
    } else {
      window.location.replace('/department-login');
    }

    return true; // handled
  }

  return false; // not handled
};
