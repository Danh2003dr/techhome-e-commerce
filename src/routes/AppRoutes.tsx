import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getProductDetailExtras } from '@/data';
import HomePage from '@/pages/store/HomePage';
import SearchResults from '@/pages/store/SearchResults';
import ProductDetail from '@/pages/store/ProductDetail';
import CartPage from '@/pages/checkout/CartPage';
import ProductListingPage from '@/pages/store/ProductListingPage';
import ProfilePage from '@/pages/account/ProfilePage';
import MobileCategoryPage from '@/pages/store/MobileCategoryPage';
import CoolingCategoryPage from '@/pages/store/CoolingCategoryPage';
import AccessoriesCategoryPage from '@/pages/store/AccessoriesCategoryPage';
import AudioCategoryPage from '@/pages/store/AudioCategoryPage';
import SmartHomeCategoryPage from '@/pages/store/SmartHomeCategoryPage';
import OrderConfirmationPage from '@/pages/checkout/OrderConfirmationPage';
import LoginPage from '@/pages/auth/LoginPage';
import OrderHistoryPage from '@/pages/account/OrderHistoryPage';
import OrderDetailsPage from '@/pages/account/OrderDetailsPage';
import WarrantyPage from '@/pages/account/WarrantyPage';
import SavedAddressesPage from '@/pages/account/SavedAddressesPage';
import WishlistPage from '@/pages/account/WishlistPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ComparePage from '@/pages/store/ComparePage';
import NotFoundPage from '@/pages/NotFoundPage';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isDealsPage = location.pathname === '/deals';
  const isProfilePage = location.pathname === '/profile';
  const isMobileCategoryPage = location.pathname === '/category/mobile';
  const isCoolingCategoryPage = location.pathname === '/category/cooling';
  const isAccessoriesCategoryPage = location.pathname === '/category/accessories';
  const isAudioCategoryPage = location.pathname === '/category/audio';
  const isSmartHomeCategoryPage = location.pathname === '/category/smart-home';
  const productIdMatch = location.pathname.match(/^\/product\/(.+)$/);
  const productId = productIdMatch?.[1];
  const hasFullProductLayout = productId != null && getProductDetailExtras(productId) != null;

  if (isDealsPage) return <ProductListingPage />;
  if (isProfilePage) return <ProfilePage />;
  if (isMobileCategoryPage) return <MobileCategoryPage />;
  if (isCoolingCategoryPage) return <CoolingCategoryPage />;
  if (isAccessoriesCategoryPage) return <AccessoriesCategoryPage />;
  if (isAudioCategoryPage) return <AudioCategoryPage />;
  if (isSmartHomeCategoryPage) return <SmartHomeCategoryPage />;
  if (hasFullProductLayout) return <ProductDetail />;

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/deals" element={<ProductListingPage />} />
    <Route path="/category/mobile" element={<MobileCategoryPage />} />
    <Route path="/category/cooling" element={<CoolingCategoryPage />} />
    <Route path="/category/accessories" element={<AccessoriesCategoryPage />} />
    <Route path="/category/audio" element={<AudioCategoryPage />} />
    <Route path="/category/smart-home" element={<SmartHomeCategoryPage />} />
    <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
    <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/dashboard" element={<OrderHistoryPage />} />
    <Route path="/order/:orderId" element={<OrderDetailsPage />} />
    <Route path="/warranty" element={<WarrantyPage />} />
    <Route path="/addresses" element={<SavedAddressesPage />} />
    <Route path="/wishlist" element={<WishlistPage />} />
    <Route path="/compare" element={<ComparePage />} />
    <Route path="/*" element={<AppContent />} />
  </Routes>
);

export default AppRoutes;
