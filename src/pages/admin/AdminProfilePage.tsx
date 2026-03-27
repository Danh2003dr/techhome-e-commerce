import React from 'react';
import ProfilePage from '@/pages/account/ProfilePage';

/**
 * Admin profile page: keep user inside AdminLayout by routing via /admin/profile.
 * (We currently reuse the existing customer ProfilePage UI for now.)
 */
const AdminProfilePage: React.FC = () => {
  return <ProfilePage variant="admin" />;
};

export default AdminProfilePage;

