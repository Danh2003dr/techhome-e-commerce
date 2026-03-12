import React from 'react';
import { HashRouter } from 'react-router-dom';
import { CheckoutProvider } from '@/context/CheckoutContext';
import AppRoutes from '@/routes/AppRoutes';

const App: React.FC = () => (
  <HashRouter>
    <CheckoutProvider>
      <AppRoutes />
    </CheckoutProvider>
  </HashRouter>
);

export default App;
