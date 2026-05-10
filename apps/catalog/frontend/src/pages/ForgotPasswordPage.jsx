import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import ForgotPasswordStatus from '../components/auth/ForgotPasswordStatus';
import useCreatePasswordReset from '../hooks/userSession/forgotPassword/useCreatePasswordReset';
import usePasswordResetStatus from '../hooks/userSession/forgotPassword/usePasswordResetStatus';

const ForgotPasswordPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const user_id = params.user_id;
  const { createRequest, loading: loadingCreate, error: errorCreate } = useCreatePasswordReset();
  const { status: fetchedStatus, loading: loadingStatus, error: errorStatus } = usePasswordResetStatus(user_id);

  // Cuando el usuario envía el formulario
  const handleRequest = async (uname) => {
    return await createRequest(uname);
  };

  // Cuando el usuario quiere consultar el estado
  // Cuando el usuario quiere reintentar
  // Redirige a /forgot sin recargar la SPA
  const handleRetry = () => {
    navigate('/forgot');
  };

  // Cuando el usuario quiere cambiar contraseña (redirigir a reset-password)
  const handleReset = () => {
    navigate(`/reset-password?user_id=${encodeURIComponent(user_id)}`);
  };

  // Mostrar formulario si no hay user_id en la URL
  if (!user_id) {
    return <ForgotPasswordForm onSubmit={handleRequest} loading={loadingCreate} error={errorCreate} />;
  }

  // Si hay user_id, mostrar estado
  if (fetchedStatus === null && loadingStatus) {
    return <div style={{ textAlign: 'center', marginTop: 40 }}>Cargando estado...</div>;
  }
  if (errorStatus) {
    return <ForgotPasswordStatus status="none" onRetry={handleRetry} onReset={handleReset} />;
  }
  return <ForgotPasswordStatus status={fetchedStatus || 'none'} onRetry={handleRetry} onReset={handleReset} />;
};

export default ForgotPasswordPage;
