import React from 'react';
import { Link } from 'react-router-dom';

const AccountFooter: React.FC = () => {
  return (
    <footer className="mt-20 py-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <span className="material-icons text-white text-xl">devices</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tech<span className="text-primary">Home</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Điểm đến cho thiết bị điện tử và giải pháp nhà thông minh chất lượng, phục vụ nhu cầu sống hiện đại của bạn.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-6">Hỗ trợ</h4>
          <ul className="text-[14px] text-slate-500 space-y-3">
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Trung tâm trợ giúp
              </a>
            </li>
            <li>
              <Link to="/orders" className="hover:text-primary transition-colors">
                Theo dõi đơn hàng
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Vận chuyển
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Đổi trả & hoàn tiền
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-6">Công ty</h4>
          <ul className="text-[14px] text-slate-500 space-y-3">
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Về chúng tôi
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Tuyển dụng
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Điều khoản dịch vụ
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-6">Bản tin</h4>
          <p className="text-[14px] text-slate-500 mb-5 leading-relaxed">
            Đăng ký để nhận ưu đãi, thông tin khuyến mãi và cập nhật sản phẩm mới.
          </p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm w-full focus:ring-2 focus:ring-primary"
              placeholder="Địa chỉ email"
              type="email"
            />
            <button type="submit" className="bg-primary text-white px-4 rounded-xl hover:bg-blue-600 transition-colors shadow-md">
              <span className="material-icons">send</span>
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs font-medium text-slate-400">© 2024 TechHome. Bảo lưu mọi quyền.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-slate-400 hover:text-primary transition-colors">
            <span className="material-icons">leaderboard</span>
          </a>
          <a href="#" className="text-slate-400 hover:text-primary transition-colors">
            <span className="material-icons">share</span>
          </a>
          <a href="#" className="text-slate-400 hover:text-primary transition-colors">
            <span className="material-icons">rss_feed</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AccountFooter;
