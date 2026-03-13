import React from 'react';
import type { SavedAddress } from '@/types';

interface AddressCardProps {
  address: SavedAddress;
  isSelected: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  return (
    <div
      className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <input
            type="radio"
            checked={isSelected}
            onChange={onSelect}
            className="w-5 h-5 text-primary focus:ring-primary cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {address.addressLines[0] || address.street}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                address.tagPrimary
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {address.label}
            </span>
          </div>
          <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
            {address.addressLines.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{address.phone}</p>
        </div>
        {showActions && (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 text-slate-400 hover:text-primary transition-colors"
                title="Edit address"
              >
                <span className="material-icons text-xl">edit</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Delete address"
              >
                <span className="material-icons text-xl">delete</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressCard;

