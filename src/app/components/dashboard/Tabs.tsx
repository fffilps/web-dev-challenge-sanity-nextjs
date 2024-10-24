import React from 'react';

type Tab = {
  id: string;
  label: string;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
};

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="border-b border-red-200">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm transition-colors
              ${activeTab === tab.id
                ? 'border-red-700 text-red-700'
                : 'border-transparent text-gray-500 hover:text-red-600 hover:border-red-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}