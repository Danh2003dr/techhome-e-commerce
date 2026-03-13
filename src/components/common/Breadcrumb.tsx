import React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-[13px] font-semibold text-slate-400 mb-3">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {item.path && !isLast ? (
              <Link to={item.path} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-primary' : ''}>{item.label}</span>
            )}
            {!isLast && <span className="material-icons text-sm">chevron_right</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;

