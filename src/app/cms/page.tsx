'use client'

import React, { useState, useEffect } from 'react';
import { Gift, Plus, Pencil, Trash2, AlarmClockCheck, AlarmClockMinus, SunSnow, Check, X, Clock } from "lucide-react"
import { useRouter } from 'next/navigation';

// Types
type Tab = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

type Column = {
  key: string;
  label: string;
};

type StatCardProps = {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
};

type DataTableProps = {
  columns: Column[];
  data: Record<string, any>[];
  onEdit?: (item: Record<string, any>) => void;
  onDelete?: (item: Record<string, any>) => void;
};

// Sanity client configuration
import { client } from '../sanity/client'

// Custom Button component
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }> = ({ children, className, ...props }) => (
  <button
    className={`px-4 py-2 rounded font-bold text-white ${className}`}
    {...props}
  >
    {children}
  </button>
)

// Custom Card component
const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { className?: string }> = ({ children, className, ...props }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`} {...props}>
    {children}
  </div>
)

// Update interfaces to match Sanity schema
interface Elf {
  _id: string;
  name: string;
  role: string;
  availability: string;
}

interface Reindeer {
  _id: string;
  name: string;
  shinyNose: boolean;
  age: number;
  trainingStatus: string;
  currentHealth: string;
}

interface Sleigh {
  _id: string;
  name: string;
  model: string;
  mileage: number;
}

interface Gift {
  _id: string;
  child: { name: string };
  wishListItems: string[];
  approvalStatus: string;
}

// Sub-components
function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
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
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function DataTable({ columns, data, onEdit, onDelete }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="relative px-6 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item[column.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ label, value, change, trend }: StatCardProps) {
  return (
    <div className="bg-white px-4 py-5 shadow rounded-lg overflow-hidden sm:p-6">
      <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
      <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
      {change && (
        <div className="mt-2">
          <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        </div>
      )}
    </div>
  );
}

function StatsGrid({ stats }: { stats: StatCardProps[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

// Main Dashboard Component
export default function SantaHRDashboard() {
  const [activeTab, setActiveTab] = useState<'elves' | 'reindeer' | 'sleighs' | 'gifts'>('elves')
  const [elves, setElves] = useState<Elf[]>([])
  const [reindeer, setReindeer] = useState<Reindeer[]>([])
  const [sleighs, setSleighs] = useState<Sleigh[]>([])
  const [gifts, setGifts] = useState<Gift[]>([])
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const router = useRouter();

  useEffect(() => {
    fetchData()
  }, [activeTab, activeFilter])

  const fetchData = async () => {
    let query = ''
    switch (activeTab) {
      case 'elves':
        query = getElfQuery()
        break
      case 'reindeer':
        query = getReindeerQuery()
        break
      case 'sleighs':
        query = `*[_type == "sleigh"] { _id, name, model, mileage }`
        break
      case 'gifts':
        query = getGiftQuery()
        break
    }

    const data = await client.fetch(query)
    switch (activeTab) {
      case 'elves':
        setElves(data)
        break
      case 'reindeer':
        setReindeer(data)
        break
      case 'sleighs':
        setSleighs(data)
        break
      case 'gifts':
        setGifts(data)
        break
    }
  }

  const getElfQuery = () => {
    switch (activeFilter) {
      case 'fullTime':
        return `*[_type == "elf" && availability == "full-time"] { _id, name, role, availability }`
      case 'partTime':
        return `*[_type == "elf" && availability == "part-time"] { _id, name, role, availability }`
      case 'seasonal':
        return `*[_type == "elf" && availability == "seasonal"] { _id, name, role, availability }`
      default:
        return `*[_type == "elf"] { _id, name, role, availability }`
    }
  }

  const getReindeerQuery = () => {
    switch (activeFilter) {
      case 'trained':
        return `*[_type == "reindeer" && trainingStatus == "trained"] { _id, name, shinyNose, age, trainingStatus, currentHealth }`
      case 'healthy':
        return `*[_type == "reindeer" && currentHealth == "healthy"] { _id, name, shinyNose, age, trainingStatus, currentHealth }`
      case 'healthyAndTrained':
        return `*[_type == "reindeer" && trainingStatus == "trained" && currentHealth == "healthy"] { _id, name, shinyNose, age, trainingStatus, currentHealth }`
      default:
        return `*[_type == "reindeer"] { _id, name, shinyNose, age, trainingStatus, currentHealth }`
    }
  }

  const getGiftQuery = () => {
    switch (activeFilter) {
      case 'pending':
        return `*[_type == "gift" && approvalStatus == "pending"] { _id, child->{ name }, wishListItems, approvalStatus }`
      case 'approved':
        return `*[_type == "gift" && approvalStatus == "approved"] { _id, child->{ name }, wishListItems, approvalStatus }`
      case 'denied':
        return `*[_type == "gift" && approvalStatus == "denied"] { _id, child->{ name }, wishListItems, approvalStatus }`
      default:
        return `*[_type == "gift"] { _id, child->{ name }, wishListItems, approvalStatus }`
    }
  }

  const renderFilterButtons = () => {
    switch (activeTab) {
      case 'elves':
        return (
          <div className="mb-4">
            <Button onClick={() => setActiveFilter('all')} className={`mr-2 ${activeFilter === 'all' ? 'bg-blue-600' : 'bg-blue-400'}`}>All Elves</Button>
            <Button onClick={() => setActiveFilter('fullTime')} className={`mr-2 ${activeFilter === 'fullTime' ? 'bg-blue-600' : 'bg-blue-400'}`}><AlarmClockCheck className="inline-block mr-2" size={16} />Full Time</Button>
            <Button onClick={() => setActiveFilter('partTime')} className={`mr-2 ${activeFilter === 'partTime' ? 'bg-blue-600' : 'bg-blue-400'}`}><AlarmClockMinus className="inline-block mr-2" size={16} />Part Time</Button>
            <Button onClick={() => setActiveFilter('seasonal')} className={`mr-2 ${activeFilter === 'seasonal' ? 'bg-blue-600' : 'bg-blue-400'}`}><SunSnow className="inline-block mr-2" size={16} />Seasonal</Button>
          </div>
        )
      case 'reindeer':
        return (
          <div className="mb-4">
            <Button onClick={() => setActiveFilter('all')} className={`mr-2 ${activeFilter === 'all' ? 'bg-blue-600' : 'bg-blue-400'}`}>All Reindeer</Button>
            <Button onClick={() => setActiveFilter('trained')} className={`mr-2 ${activeFilter === 'trained' ? 'bg-blue-600' : 'bg-blue-400'}`}>Trained</Button>
            <Button onClick={() => setActiveFilter('healthy')} className={`mr-2 ${activeFilter === 'healthy' ? 'bg-blue-600' : 'bg-blue-400'}`}>Healthy</Button>
            <Button onClick={() => setActiveFilter('healthyAndTrained')} className={`mr-2 ${activeFilter === 'healthyAndTrained' ? 'bg-blue-600' : 'bg-blue-400'}`}>Healthy & Trained</Button>
          </div>
        )
      case 'gifts':
        return (
          <div className="mb-4">
            <Button onClick={() => setActiveFilter('all')} className={`mr-2 ${activeFilter === 'all' ? 'bg-blue-600' : 'bg-blue-400'}`}>All Gifts</Button>
            <Button onClick={() => setActiveFilter('pending')} className={`mr-2 ${activeFilter === 'pending' ? 'bg-blue-600' : 'bg-blue-400'}`}><Clock className="inline-block mr-2" size={16} />Pending</Button>
            <Button onClick={() => setActiveFilter('approved')} className={`mr-2 ${activeFilter === 'approved' ? 'bg-blue-600' : 'bg-blue-400'}`}><Check className="inline-block mr-2" size={16} />Approved</Button>
            <Button onClick={() => setActiveFilter('denied')} className={`mr-2 ${activeFilter === 'denied' ? 'bg-blue-600' : 'bg-blue-400'}`}><X className="inline-block mr-2" size={16} />Denied</Button>
          </div>
        )
      default:
        return null
    }
  }

  const tabs: Tab[] = [
    { id: 'elves', label: 'Elves Management' },
    { id: 'reindeer', label: 'Reindeer Fleet' },
    { id: 'sleighs', label: 'Sleigh Inventory' },
    { id: 'gifts', label: 'Gift Production', icon: <Gift size={16} /> },
  ];

  const handleEdit = (item: Record<string, any>) => {
    const editPath = `/cms/edit/${activeTab}/${item._id}`;
    router.push(editPath, { 
      state: { 
        item, 
        type: activeTab,
        columns: getColumnsForActiveTab()
      } 
    });
  };

  const getColumnsForActiveTab = (): Column[] => {
    switch (activeTab) {
      case 'elves':
        return [
          { key: 'name', label: 'Name' },
          { key: 'role', label: 'Role' },
          { key: 'availability', label: 'Availability' },
        ];
      case 'reindeer':
        return [
          { key: 'name', label: 'Name' },
          { key: 'age', label: 'Age' },
          { key: 'trainingStatus', label: 'Training Status' },
          { key: 'currentHealth', label: 'Current Health' },
        ];
      case 'sleighs':
        return [
          { key: 'name', label: 'Name' },
          { key: 'model', label: 'Model' },
          { key: 'mileage', label: 'Mileage' },
        ];
      case 'gifts':
        return [
          { key: 'childName', label: 'Child Name' },
          { key: 'wishList', label: 'Wish List' },
          { key: 'approvalStatus', label: 'Approval Status' },
        ];
      default:
        return [];
    }
  };

  const handleDelete = (item: Record<string, any>) => {
    console.log('Delete item:', item);
    // Implement delete functionality
  };

  const renderTabContent = () => {
    let columns: Column[] = [];
    let data: Record<string, any>[] = [];
    let stats: StatCardProps[] = [];

    switch (activeTab) {
      case 'elves':
        columns = [
          { key: 'name', label: 'Name' },
          { key: 'role', label: 'Role' },
          { key: 'availability', label: 'Availability' },
        ];
        data = elves;
        stats = [
          { label: 'Total Elves', value: elves.length },
          { label: 'Full-time', value: elves.filter(e => e.availability === 'full-time').length },
          { label: 'Part-time', value: elves.filter(e => e.availability === 'part-time').length },
          { label: 'Seasonal', value: elves.filter(e => e.availability === 'seasonal').length },
        ];
        break;
      case 'reindeer':
        columns = [
          { key: 'name', label: 'Name' },
          { key: 'age', label: 'Age' },
          { key: 'trainingStatus', label: 'Training Status' },
          { key: 'currentHealth', label: 'Current Health' },
        ];
        data = reindeer;
        stats = [
          { label: 'Total Reindeer', value: reindeer.length },
          { label: 'Trained', value: reindeer.filter(r => r.trainingStatus === 'trained').length },
          { label: 'Healthy', value: reindeer.filter(r => r.currentHealth === 'healthy').length },
          { label: 'Shiny Noses', value: reindeer.filter(r => r.shinyNose).length },
        ];
        break;
      case 'sleighs':
        columns = [
          { key: 'name', label: 'Name' },
          { key: 'model', label: 'Model' },
          { key: 'mileage', label: 'Mileage' },
        ];
        data = sleighs;
        stats = [
          { label: 'Total Sleighs', value: sleighs.length },
          { label: 'Avg Mileage', value: Math.round(sleighs.reduce((acc, s) => acc + s.mileage, 0) / sleighs.length) },
        ];
        break;
      case 'gifts':
        columns = [
          { key: 'childName', label: 'Child Name' },
          { key: 'wishList', label: 'Wish List' },
          { key: 'approvalStatus', label: 'Approval Status' },
        ];
        data = gifts.map(g => ({ ...g, childName: g.child.name, wishList: g.wishListItems.join(', ') }));
        stats = [
          { label: 'Total Gifts', value: gifts.length },
          { label: 'Approved', value: gifts.filter(g => g.approvalStatus === 'approved').length },
          { label: 'Pending', value: gifts.filter(g => g.approvalStatus === 'pending').length },
          { label: 'Denied', value: gifts.filter(g => g.approvalStatus === 'denied').length },
        ];
        break;
    }

    return (
      <>
        <StatsGrid stats={stats} />
        <div className="mt-8">
          {renderFilterButtons()}
          <Button className="bg-green-500 hover:bg-green-600 mb-4">
            <Plus className="inline-block mr-2" size={16} />
            Add New {activeTab.slice(0, -1)}
          </Button>
          <DataTable
            columns={columns}
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Santa&apos;s Workshop Management</h1>
          
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as typeof activeTab)}
          />

          <div className="mt-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
