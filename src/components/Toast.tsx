import React from 'react';
import { useBeacon } from '../context/BeaconContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useBeacon();

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-100 text-emerald-800',
    error: 'bg-red-50 border-red-100 text-red-800',
    info: 'bg-blue-50 border-blue-100 text-blue-800',
  };

  const iconStyles = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-slideIn">
      <div className={`p-4 rounded-xl border shadow-lg flex items-start gap-3 ${bgStyles[toast.type]}`}>
        {iconStyles[toast.type]}
        <div className="flex-1 text-sm font-medium leading-relaxed">
          {toast.message}
        </div>
      </div>
    </div>
  );
};
