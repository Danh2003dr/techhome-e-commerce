import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { resetPassword } from '@/services/backend';
import { isApiConfigured, ApiError } from '@/services/api';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token || token.trim().length < 16) {
      setError('Liên kết không hợp lệ. Hãy dùng link trong email hoặc yêu cầu gửi lại.');
      return;
    }
    if (password.length < 8) {
      setError('Mật khẩu mới tối thiểu 8 ký tự (theo yêu cầu độ phức tạp từ server).');
      return;
    }
    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (!isApiConfigured()) {
      setError('Chưa cấu hình kết nối máy chủ.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Đặt lại mật khẩu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
        <p className="text-slate-700 dark:text-slate-300">Thiếu token trong đường dẫn.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Đặt lại mật khẩu</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Nhập mật khẩu mới cho tài khoản của bạn.</p>

        {success ? (
          <div className="space-y-4">
            <p className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">Đã đặt lại mật khẩu thành công.</p>
            <Link to="/login" className="inline-block text-primary font-semibold hover:underline">
              Đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reset_new" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Mật khẩu mới
              </label>
              <input
                id="reset_new"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label htmlFor="reset_confirm" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                id="reset_confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm"
              />
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-blue-600 disabled:opacity-60"
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-primary hover:underline">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
