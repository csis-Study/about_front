import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/client-login');
  };

  return (
    <div onClick={handleLogout}>退出登录</div>
  );
};

export default Logout;