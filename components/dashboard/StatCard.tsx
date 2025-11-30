import React from 'react';

type LucideOrElement = React.ReactNode | ((props: { className?: string }) => React.ReactElement);

interface StatCardProps {
  title: string;
  value: string;
  // accept either the lucide component (e.g. Users) or an already-instantiated element (<Users />)
  icon: LucideOrElement;
  color: 'blue' | 'green' | 'orange' | 'cyan' |'pink'|'purple'|'red';
}
// 
export function StatCard({ title, value, icon, color }: StatCardProps) {
  const bgClasses: Record<string, string> = {
    blue: 'bg-gradient-to-br from-blue-400 to-blue-600',
    green: 'bg-gradient-to-br from-green-400 to-green-600',
    orange: 'bg-gradient-to-br from-orange-400 to-orange-600',
    cyan: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
    pink: 'bg-gradient-to-br from-pink-400 to-pink-600',
    purple: 'bg-gradient-to-br from-purple-400 to-purple-600',
  };

  const iconColor = 'text-white';

  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement, ({
        className: `${(icon as any).props?.className ?? ''} w-6 h-6 ${iconColor}`.trim(),
      } as any));
    }

    if (typeof icon === 'function') {
      try {
        return (icon as any)({ className: `w-6 h-6 ${iconColor}` });
      } catch (e) {
        return null;
      }
    }

    return icon as React.ReactNode;
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <p className="text-sm text-gray-700 mb-2">{title}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-3xl font-semibold tracking-tight text-gray-800 leading-tight">{value}</p>
        </div>

        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-md shrink-0 ${bgClasses[color]}`}>
          {renderIcon()}
        </div>
      </div>
    </div>
  );
}
