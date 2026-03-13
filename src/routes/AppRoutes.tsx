import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import HomePage from '@/pages/store/HomePage';
import SearchResults from '@/pages/store/SearchResults';
import ProductDetail from '@/pages/store/ProductDetail';
import CartPage from '@/pages/checkout/CartPage';
import ProductListingPage from '@/pages/store/ProductListingPage';
import ProfilePage from '@/pages/account/ProfilePage';
import MobileCategoryPage from '@/pages/store/MobileCategoryPage';
import AccessoriesCategoryPage from '@/pages/store/AccessoriesCategoryPage';
import AudioCategoryPage from '@/pages/store/AudioCategoryPage';
import OrderConfirmationPage from '@/pages/checkout/OrderConfirmationPage';
import CheckoutPage from '@/pages/checkout/CheckoutPage';
import LoginPage from '@/pages/auth/LoginPage';
import OrderHistoryPage from '@/pages/account/OrderHistoryPage';
import OrderDetailsPage from '@/pages/account/OrderDetailsPage';
import WarrantyPage from '@/pages/account/WarrantyPage';
import SavedAddressesPage from '@/pages/account/SavedAddressesPage';
import WishlistPage from '@/pages/account/WishlistPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import NotFoundPage from '@/pages/NotFoundPage';

const AppRoutes: React.FC = () => (
  <Routes>
    {/* Routes với MainLayout (có Header/Footer) */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/deals" element={<ProductListingPage />} />
      <Route path="/category/mobile" element={<MobileCategoryPage />} />
      <Route path="/category/accessories" element={<AccessoriesCategoryPage />} />
      <Route path="/category/audio" element={<AudioCategoryPage />} />
    </Route>

    {/* Routes không có MainLayout (auth pages, account pages có AccountHeader riêng) */}
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
    <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/orders" element={<OrderHistoryPage />} />
    <Route path="/order/:orderId" element={<OrderDetailsPage />} />
    <Route path="/warranty" element={<WarrantyPage />} />
    <Route path="/addresses" element={<SavedAddressesPage />} />
    <Route path="/wishlist" element={<WishlistPage />} />
    <Route path="/*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
