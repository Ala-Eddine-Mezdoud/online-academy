'use client';

import React from 'react';

type Role = 'Student' | 'Teacher' | 'Admin';

interface RoleTabsProps {
  selectedRole: Role;
  onRoleChange: (role: Role) => void;
}

export default function RoleTabs({ selectedRole, onRoleChange }: RoleTabsProps) {
  const roles: Role[] = ['Student', 'Teacher', 'Admin'];

  return (
    <div className="flex gap-2 mb-6" role="tablist">
      {roles.map((role) => (
        <button
          key={role}
          type="button"
          role="tab"
          aria-selected={selectedRole === role}
          onClick={() => onRoleChange(role)}
          className={`
            flex-1 py-2 px-4 rounded-lg text-sm font-medium
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[#19B7FF]/50 focus:ring-offset-2
            ${
              selectedRole === role
                ? 'bg-[#0C86D8] text-white'
                : 'bg-white text-[#30363A] border border-[rgba(16,24,40,0.06)] hover:bg-[#F7F9FB]'
            }
          `}
        >
          {role}
        </button>
      ))}
    </div>
  );
}

