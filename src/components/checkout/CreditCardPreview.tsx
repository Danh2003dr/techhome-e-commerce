import React from 'react';

interface CreditCardPreviewProps {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
}

const CreditCardPreview: React.FC<CreditCardPreviewProps> = ({
  cardNumber,
  cardHolder,
  expiryDate,
}) => {
  const formatCardNumber = (num: string) => {
    const cleaned = num.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').padEnd(19, '•');
  };

  const displayNumber = cardNumber ? formatCardNumber(cardNumber) : '•••• •••• •••• ••••';
  const displayHolder = cardHolder || 'CHỦ THẺ';
  const displayExpiry = expiryDate || 'MM/YY';

  return (
    <div className="relative w-full max-w-md mx-auto mb-8">
      <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-start mb-8">
          <div className="text-2xl font-bold">TechHome</div>
          <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center">
            <span className="text-xs font-bold">VISA</span>
          </div>
        </div>
        <div className="mb-6">
          <div className="text-2xl font-mono tracking-wider mb-2">{displayNumber}</div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs text-white/70 mb-1">CHỦ THẺ</div>
            <div className="text-lg font-semibold uppercase">{displayHolder}</div>
          </div>
          <div>
            <div className="text-xs text-white/70 mb-1">HẾT HẠN</div>
            <div className="text-lg font-semibold">{displayExpiry}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardPreview;

