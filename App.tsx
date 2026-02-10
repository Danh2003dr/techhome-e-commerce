import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import SearchResults from './pages/SearchResults';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import ProductListingPage from './pages/ProductListingPage';
import ProfilePage from './pages/ProfilePage';
import MobileCategoryPage from './pages/MobileCategoryPage';
import CoolingCategoryPage from './pages/CoolingCategoryPage';
import AccessoriesCategoryPage from './pages/AccessoriesCategoryPage';
import AudioCategoryPage from './pages/AudioCategoryPage';
import SmartHomeCategoryPage from './pages/SmartHomeCategoryPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import WarrantyPage from './pages/WarrantyPage';
import SavedAddressesPage from './pages/SavedAddressesPage';
import WishlistPage from './pages/WishlistPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ComparePage from './pages/ComparePage';
import { getProductDetailExtras } from './data';

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

  if (isDealsPage) {
    return <ProductListingPage />;
  }
  if (isProfilePage) {
    return <ProfilePage />;
  }
  if (isMobileCategoryPage) {
    return <MobileCategoryPage />;
  }
  if (isCoolingCategoryPage) {
    return <CoolingCategoryPage />;
  }
  if (isAccessoriesCategoryPage) {
    return <AccessoriesCategoryPage />;
  }
  if (isAudioCategoryPage) {
    return <AudioCategoryPage />;
  }
  if (isSmartHomeCategoryPage) {
    return <SmartHomeCategoryPage />;
  }
  if (hasFullProductLayout) {
    return <ProductDetail />;
  }

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

const App: React.FC = () => {
  return (
    <HashRouter>
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
    </HashRouter>
  );
};

export default App;
