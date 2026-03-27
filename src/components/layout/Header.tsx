import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAvatar } from '@/context/AvatarContext';
import { useCart } from '@/context/CartContext';
import { DEFAULT_PROFILE_IMAGE } from '@/constants/user';
import { useWishlist } from '@/context/WishlistContext';
import { useApiCategories } from '@/hooks/useProductApi';
import { isApiConfigured } from '@/services/api';
import { resolveStorefrontPathForCategorySlug } from '@/services/categoryNavigation';
import type { Category } from '@/types';

function CategoryMenuThumb({ cat }: { cat: Category }) {
  const [imgErr, setImgErr] = useState(false);
  const url = cat.imageUrl?.trim();
  const showImg = Boolean(url && !imgErr);
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700">
      {showImg ? (
        <img src={url} alt="" className="h-full w-full object-cover" onError={() => setImgErr(true)} />
      ) : (
        <span className="material-icons text-xl text-slate-600 transition-colors group-hover:text-primary dark:text-slate-400">
          {cat.icon}
        </span>
      )}
    </span>
  );
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { avatarUrl } = useAvatar();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [hoveredParentId, setHoveredParentId] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const { totalCount: cartCount } = useCart();
  const { totalCount: wishlistCount } = useWishlist();
  const { data: apiCategories } = useApiCategories();

  const displayAvatar = avatarUrl ?? user?.avatarUrl ?? DEFAULT_PROFILE_IMAGE;

  const categoryMenu = useMemo(() => {
    const raw = isApiConfigured() ? apiCategories : [];
    const normalizeId = (value: Category['id'] | Category['parentId']): string | null => {
      if (value == null) return null;
      const s = String(value).trim();
      return s === '' ? null : s;
    };

    // Only show top-level categories (danh mục cha) in the first column.
    const parents = [...raw.filter((c) => c.parentId == null)].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    const childrenByParent = new Map<string, Category[]>();
    for (const c of raw) {
      const parentKey = normalizeId(c.parentId);
      if (!parentKey) continue;
      const bucket = childrenByParent.get(parentKey) ?? [];
      bucket.push(c);
      childrenByParent.set(parentKey, bucket);
    }
    for (const [key, items] of childrenByParent) {
      childrenByParent.set(key, [...items].sort((a, b) => a.name.localeCompare(b.name, 'vi')));
    }

    return { parents, childrenByParent, normalizeId };
  }, [apiCategories]);

  const activeParentId = hoveredParentId ?? categoryMenu.normalizeId(categoryMenu.parents[0]?.id);
  const activeParent = activeParentId
    ? categoryMenu.parents.find((p) => categoryMenu.normalizeId(p.id) === activeParentId) ?? null
    : null;
  const activeChildren = activeParentId ? categoryMenu.childrenByParent.get(activeParentId) ?? [] : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    if (accountOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };

    if (isCategoriesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoriesOpen]);

  useEffect(() => {
    if (!isCategoriesOpen) {
      setHoveredParentId(null);
      return;
    }
    if (hoveredParentId != null) return;
    const firstParentId = categoryMenu.normalizeId(categoryMenu.parents[0]?.id);
    if (firstParentId) setHoveredParentId(firstParentId);
  }, [isCategoriesOpen, hoveredParentId, categoryMenu]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-8">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="bg-primary p-1 rounded-lg text-white">
              <span className="material-icons text-2xl">devices</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tech<span className="text-primary">Home</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="flex-grow max-w-3xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="material-icons text-slate-400 group-focus-within:text-primary transition-colors">search</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-24 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all text-sm"
                placeholder="Tìm điện thoại, tablet, phụ kiện..."
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 bg-primary text-white px-4 rounded-md font-semibold text-sm hover:bg-blue-600 transition-colors"
              >
                Tìm kiếm
              </button>
            </div>
          </form>

          <div className="flex items-center gap-6">
            <div className="relative" ref={accountRef}>
              {isAuthenticated && user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setAccountOpen(!accountOpen)}
                    className="flex flex-col items-center gap-0.5 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                  >
                    <img
                      src={displayAvatar}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-600"
                    />
                    <span className="text-[10px] font-bold uppercase max-w-[72px] truncate">{user.name}</span>
                  </button>
                  {accountOpen && (
                    <div className="absolute top-full right-0 mt-1 w-56 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-[100]">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex gap-3 items-center min-w-0">
                        <img
                          src={displayAvatar}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <Link to="/profile" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                        Hồ sơ
                      </Link>
                      <Link to="/orders" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                        Đơn hàng
                      </Link>
                      <Link to="/wishlist" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                        Yêu thích
                      </Link>
                      {String(user?.role ?? '').trim().toUpperCase() === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setAccountOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          Quản trị
                        </Link>
                      )}
                      <button type="button" onClick={() => { setAccountOpen(false); logout(); }} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700">
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" className="flex flex-col items-center gap-0.5 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                  <span className="material-icons">person_outline</span>
                  <span className="text-[10px] font-bold uppercase">Tài khoản</span>
                </Link>
              )}
            </div>
            <Link to="/orders" className="flex flex-col items-center gap-0.5 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
              <span className="material-icons">history</span>
              <span className="text-[10px] font-bold uppercase">Đơn hàng</span>
            </Link>
            <Link to="/wishlist" className="relative flex flex-col items-center gap-0.5 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
              <span className="material-icons">favorite_border</span>
              <span className="text-[10px] font-bold uppercase">Yêu thích</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold min-w-[1rem] h-4 px-1 rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative flex flex-col items-center gap-0.5 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
              <span className="material-icons">shopping_cart</span>
              <span className="text-[10px] font-bold uppercase">Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <nav className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative">
          <div className="container mx-auto px-4 flex items-center h-12 gap-8 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <div 
              ref={categoriesRef}
              className="relative"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-icons text-lg">menu</span>
                Danh mục sản phẩm
                <span className={`material-icons text-sm transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {/* Dropdown: padding-top thay cho margin — tránh khe hở khiến mouseleave đóng menu trước khi vào panel */}
              {isCategoriesOpen && (
                <div className="absolute left-0 top-full z-[100] w-[36rem] pt-2">
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
                    <div className="grid min-h-72 grid-cols-[15rem_1fr]">
                      <div className="border-r border-slate-200 py-2 dark:border-slate-700">
                        {categoryMenu.parents.map((cat) => {
                          const parentId = categoryMenu.normalizeId(cat.id);
                          const isActive = parentId != null && parentId === activeParentId;
                          const hasChildren = parentId != null && (categoryMenu.childrenByParent.get(parentId)?.length ?? 0) > 0;
                          return (
                            <Link
                              key={cat.id}
                              to={resolveStorefrontPathForCategorySlug(cat.slug)}
                              onMouseEnter={() => setHoveredParentId(parentId)}
                              onFocus={() => setHoveredParentId(parentId)}
                              onClick={() => setIsCategoriesOpen(false)}
                              className={`group flex items-center gap-3 px-4 py-3 transition-colors ${
                                isActive
                                  ? 'bg-slate-100 dark:bg-slate-700'
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              <CategoryMenuThumb cat={cat} />
                              <span className="flex-1 text-sm font-medium text-slate-700 transition-colors group-hover:text-primary dark:text-slate-200">
                                {cat.name}
                              </span>
                              {hasChildren && (
                                <span className="material-icons text-base text-slate-400 dark:text-slate-500">chevron_right</span>
                              )}
                            </Link>
                          );
                        })}
                      </div>

                      <div className="p-3">
                        {activeParent ? (
                          <>
                            <div className="mb-2 flex items-center justify-between border-b border-slate-100 px-2 pb-2 dark:border-slate-700">
                              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {activeParent.name}
                              </span>
                              <Link
                                to={resolveStorefrontPathForCategorySlug(activeParent.slug)}
                                onClick={() => setIsCategoriesOpen(false)}
                                className="text-xs font-semibold text-primary hover:underline"
                              >
                                Xem tất cả
                              </Link>
                            </div>

                            {activeChildren.length > 0 ? (
                              <div className="grid grid-cols-1 gap-1">
                                {activeChildren.map((child) => (
                                  <Link
                                    key={child.id}
                                    to={resolveStorefrontPathForCategorySlug(child.slug)}
                                    onClick={() => setIsCategoriesOpen(false)}
                                    className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                                  >
                                    <CategoryMenuThumb cat={child} />
                                    <span className="text-sm text-slate-700 group-hover:text-primary dark:text-slate-200">
                                      {child.name}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <p className="px-2 py-3 text-sm text-slate-500 dark:text-slate-400">
                                Chưa có danh mục con.
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="px-2 py-3 text-sm text-slate-500 dark:text-slate-400">
                            Chưa có dữ liệu danh mục.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
            <Link to="/deals" className="hover:text-primary transition-colors">Khuyến mãi</Link>
            <Link to="/search?sort=newest" className="hover:text-primary transition-colors">Hàng mới</Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
