import React from 'react';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { AvatarProvider } from '@/context/AvatarContext';
import { CartProvider } from '@/context/CartContext';
import { CheckoutProvider } from '@/context/CheckoutContext';
import { SupportChatProvider } from '@/context/SupportChatContext';
import SupportChatWidget from '@/components/support/SupportChatWidget';
import AppRoutes from '@/routes/AppRoutes';

const App: React.FC = () => (
  <HashRouter>
    <AvatarProvider>
      <AuthProvider>
        <SupportChatProvider>
          <CartProvider>
            <CheckoutProvider>
              <AppRoutes />
              <SupportChatWidget />
            </CheckoutProvider>
          </CartProvider>
        </SupportChatProvider>
      </AuthProvider>
    </AvatarProvider>
  </HashRouter>
);

export default App;
