import React from 'react';
import { Link } from 'react-router-dom';
import { warrantyItems } from '@/data';
import AccountSidebar from '@/components/account/AccountSidebar';
import AccountHeader from '@/components/account/AccountHeader';
import AccountFooter from '@/components/account/AccountFooter';
import Breadcrumb from '@/components/common/Breadcrumb';

const WarrantyPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <AccountHeader />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-10 flex gap-10 w-full">
        <AccountSidebar />

        {/* Main */}
        <main className="flex-grow space-y-8 min-w-0">
          <div>
            <Breadcrumb
              items={[
                { label: 'Trang chủ', path: '/' },
                { label: 'Tài khoản', path: '/profile' },
                { label: 'Bảo hành' },
              ]}
            />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Trạng thái bảo hành</h1>
            <p className="text-slate-500 mt-1.5">Theo dõi và quản lý bảo hành sản phẩm.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {warrantyItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05),0_2px_10px_-2px_rgba(0,0,0,0.03)] overflow-hidden ${item.status === 'expired' ? 'opacity-75' : ''}`}
              >
                <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 flex-shrink-0">
                      <span className="material-icons text-4xl text-slate-400">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{item.productName}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Số seri: <span className="font-mono text-slate-700 dark:text-slate-300">{item.serial}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {item.status === 'active' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                            Đang bảo hành
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" />
                            Hết hạn
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    {item.status === 'active' ? (
                      <button type="button" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-primary/20">
                        Yêu cầu bảo hành
                      </button>
                    ) : (
                      <button type="button" className="border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        Gia hạn bảo hành
                      </button>
                    )}
                  </div>
                </div>
                <div className="px-6 sm:px-8 py-5 bg-slate-50/50 dark:bg-slate-800/30 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Ngày mua</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.purchaseDate}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Ngày hết hạn</p>
                    <p
                      className={`text-sm font-semibold ${
                        item.expiryVariant === 'red' ? 'text-red-500' : item.expiryVariant === 'amber' ? 'text-amber-600' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.expiryDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Gói bảo hành</p>
                    <p className={`text-sm font-semibold ${item.planHighlight ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{item.planType}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-2xl p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full shadow-lg flex items-center justify-center mb-6">
              <span className="material-icons text-primary text-3xl">add_moderator</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Có sản phẩm mới?</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8 text-[15px]">Đăng ký sản phẩm TechHome mới mua để kích hoạt bảo hành và nhận hỗ trợ ưu đãi.</p>
            <button type="button" className="bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-primary/20">
              Đăng ký sản phẩm mới
            </button>
          </div>
        </main>
      </div>

      <AccountFooter />
    </div>
  );
};

export default WarrantyPage;
