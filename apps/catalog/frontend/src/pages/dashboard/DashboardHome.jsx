import React from 'react';
import { useTranslation } from 'react-i18next';

const DashboardHome = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('dashboard.welcome', 'Bienvenido al Dashboard')}</h2>
      <p>
        {t(
          'dashboard.instructions',
          'Selecciona una opción del menú para comenzar.',
        )}
      </p>
    </div>
  );
};

export default DashboardHome;
