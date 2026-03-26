import React from 'react';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { AvatarProvider } from '@/context/AvatarContext';
import { CartProvider } from '@/context/CartContext';
import { CheckoutProvider } from '@/context/CheckoutContext';
import { WishlistProvider } from '@/context/WishlistContext';
import AppRoutes from '@/routes/AppRoutes';

const App: React.FC = () => (
  <HashRouter>
    <AvatarProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CheckoutProvider>
              <AppRoutes />
            </CheckoutProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </AvatarProvider>
  </HashRouter>
);

export default App;
