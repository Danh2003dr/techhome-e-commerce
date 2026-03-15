import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1 rounded-lg text-white">
                <span className="material-icons text-xl">devices</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Tech<span className="text-primary">Home</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Điểm đến công nghệ và giải pháp smart home hàng đầu.
            </p>
            <h5 className="font-bold text-sm mb-4">Đăng ký nhận tin</h5>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                className="flex-grow bg-slate-100 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary px-4 py-2"
                placeholder="Địa chỉ email"
              />
              <button type="submit" className="bg-primary text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <span className="material-icons">send</span>
              </button>
            </form>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Hỗ trợ khách hàng</h5>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-primary">Đổi trả</a></li>
              <li><a href="#" className="hover:text-primary">Vận chuyển</a></li>
              <li><a href="#" className="hover:text-primary">Tra cứu đơn hàng</a></li>
              <li><a href="#" className="hover:text-primary">Hệ thống cửa hàng</a></li>
            </ul>
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="material-icons text-sm text-primary">local_shipping</span>
                <span>Miễn phí vận chuyển đơn từ 500K</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="material-icons text-sm text-primary">verified</span>
                <span>Cam kết giá tốt nhất</span>
              </div>
            </div>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Về chúng tôi</h5>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary">Câu chuyện thương hiệu</a></li>
              <li><a href="#" className="hover:text-primary">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-primary">Phát triển bền vững</a></li>
              <li><a href="#" className="hover:text-primary">Quan hệ nhà đầu tư</a></li>
              <li><a href="#" className="hover:text-primary">TechHome Blog</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Kết nối</h5>
            <div className="flex gap-4 mb-8">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all">
                <span className="material-icons text-xl">facebook</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all">
                <span className="material-icons text-xl">alternate_email</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all">
                <span className="material-icons text-xl">camera_alt</span>
              </a>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 mb-1">Cần hỗ trợ? Gọi ngay</p>
              <p className="text-lg font-bold text-primary">1-800-TECH-HOME</p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">© 2024 TechHome E-Commerce. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-primary">Chính sách bảo mật</a>
            <a href="#" className="hover:text-primary">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-primary">Khả năng truy cập</a>
            <a href="#" className="hover:text-primary">Cookie</a>
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-10 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center font-bold text-[8px] text-slate-400">VISA</div>
            <div className="h-6 w-10 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center font-bold text-[8px] text-slate-400">MASTER</div>
            <div className="h-6 w-10 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center font-bold text-[8px] text-slate-400">AMEX</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
