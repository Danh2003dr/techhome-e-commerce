import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import HomePage from '@/pages/store/HomePage';
import SearchResults from '@/pages/store/SearchResults';
import ProductDetail from '@/pages/store/ProductDetail';
import CartPage from '@/pages/checkout/CartPage';
import ProductListingPage from '@/pages/store/ProductListingPage';
import ProfilePage from '@/pages/account/ProfilePage';
import CategoryDynamicPage from '@/pages/store/CategoryDynamicPage';
import OrderConfirmationPage from '@/pages/checkout/OrderConfirmationPage';
import CheckoutPage from '@/pages/checkout/CheckoutPage';
import LoginPage from '@/pages/auth/LoginPage';
import OrderHistoryPage from '@/pages/account/OrderHistoryPage';
import OrderDetailsPage from '@/pages/account/OrderDetailsPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ForbiddenPage from '@/pages/ForbiddenPage';
import AdminLayout from '@/pages/admin/AdminLayout';
import DashboardPage from '@/pages/admin/DashboardPage';
import ProductListPage from '@/pages/admin/products/ProductListPage';
import ProductFormPage from '@/pages/admin/products/ProductFormPage';
import ProductStockPage from '@/pages/admin/products/ProductStockPage';
import OrderListPage from '@/pages/admin/orders/OrderListPage';
import OrderDetailPage from '@/pages/admin/orders/OrderDetailPage';
import InvoicePage from '@/pages/admin/orders/InvoicePage';
import SEOSettingsPage from '@/pages/admin/seo/SEOSettingsPage';
import CalendarPage from '@/pages/admin/CalendarPage';
import VoucherBuilderPage from '@/pages/admin/vouchers/VoucherBuilderPage';
import AdminRoute from '@/routes/AdminRoute';

const AppRoutes: React.FC = () => (
        <Routes>
    {/* Routes với MainLayout (có Header/Footer) */}
    <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/deals" element={<ProductListingPage />} />
    <Route path="/category/:slug" element={<CategoryDynamicPage />} />
    </Route>

    {/* Routes không có MainLayout (auth pages, account pages có AccountHeader riêng) */}
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/order-confirmation" element={<Navigate to="/orders" replace />} />
    <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/403" element={<ForbiddenPage />} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
    <Route path="/orders" element={<OrderHistoryPage />} />
    <Route path="/order/:orderId" element={<OrderDetailsPage />} />
    <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<DashboardPage />} />
      <Route path="/admin/calendar" element={<CalendarPage />} />
      <Route path="/admin/vouchers" element={<VoucherBuilderPage />} />
      <Route path="/admin/products" element={<ProductListPage />} />
      <Route path="/admin/products/stock" element={<ProductStockPage />} />
      <Route path="/admin/products/new" element={<ProductFormPage />} />
      <Route path="/admin/products/:id" element={<ProductFormPage />} />

      {/* Static path must be before :orderId so "invoice" is not captured as orderId */}
      <Route path="/admin/orders/invoice" element={<InvoicePage />} />
      <Route path="/admin/orders" element={<OrderListPage />} />
      <Route path="/admin/orders/:orderId" element={<OrderDetailPage />} />

      <Route path="/admin/seo" element={<SEOSettingsPage />} />
    </Route>
    <Route path="/*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
