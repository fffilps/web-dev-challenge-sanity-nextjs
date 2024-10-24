'use client'

import React, { useState, useEffect } from 'react';
import { InspectionPanel, Building, ToyBrick, Factory } from "lucide-react"
import { client } from '../sanity/client'
import { Tabs } from '../components/dashboard/Tabs';
import { DataTable } from '../components/dashboard/DataTable';
import { StatsGrid } from '../components/dashboard/Stats';

// Types
type Tab = {
  id: string;
  label: string;
  icon: React.ReactNode;
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

interface Material {
  _id: string;
  name: string;
  quantity: number;
  supplier: { name: string };
  reorderThreshold: number;
}

interface Supplier {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Toy {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  storageLocation: { locationName: string };
  manufactureDate: string;
}

interface Warehouse {
  _id: string;
  locationName: string;
  address: string;
  capacity: number;
}

const tabs: Tab[] = [
  { id: 'materials', label: 'Raw Materials', icon: <InspectionPanel size={16} /> },
  { id: 'suppliers', label: 'Suppliers', icon: <Building size={16} /> },
  { id: 'toys', label: 'Toys Inventory', icon: <ToyBrick size={16} /> },
  { id: 'warehouses', label: 'Warehouses', icon: <Factory size={16} /> },
];

export default function Logistics() {
  const [activeTab, setActiveTab] = useState('materials');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [toys, setToys] = useState<Toy[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedWarehouse]);

  const fetchData = async () => {
    switch (activeTab) {
      case 'materials':
        const materialsData = await client.fetch(`
          *[_type == "material"] {
            _id,
            name,
            quantity,
            supplier-> { name },
            reorderThreshold
          }
        `);
        setMaterials(materialsData);
        break;
      case 'suppliers':
        const suppliersData = await client.fetch(`
          *[_type == "supplier"] {
            _id,
            name,
            email,
            phone,
            address
          }
        `);
        setSuppliers(suppliersData);
        break;
      case 'toys':
        let toysQuery = `
          *[_type == "toy"] {
            _id,
            name,
            description,
            quantity,
            storageLocation-> { locationName },
            manufactureDate
          }
        `;
        if (selectedWarehouse) {
          toysQuery = `
            *[_type == "toy" && storageLocation._ref == $warehouseId] {
              _id,
              name,
              description,
              quantity,
              storageLocation-> { locationName },
              manufactureDate
            }
          `;
        }
        const toysData = await client.fetch(toysQuery, { warehouseId: selectedWarehouse });
        setToys(toysData);
        break;
      case 'warehouses':
        const warehousesData = await client.fetch(`
          *[_type == "warehouse"] {
            _id,
            locationName,
            address,
            capacity
          }
        `);
        setWarehouses(warehousesData);
        break;
    }
  };

  const handleEdit = (item: Record<string, any>) => {
    console.log('Edit item:', item);
    // Implement edit functionality
  };

  const renderTabContent = () => {
    let columns: Column[] = [];
    let data: Record<string, any>[] = [];
    let stats: StatCardProps[] = [];

    switch (activeTab) {
      case 'materials':
        columns = [
          { key: 'name', label: 'Material Name' },
          { key: 'quantity', label: 'Quantity' },
          { key: 'supplier', label: 'Supplier' },
          { key: 'reorderThreshold', label: 'Reorder Threshold' },
        ];
        data = materials.map(m => ({
          ...m,
          supplier: m.supplier.name,
        }));
        stats = [
          { label: 'Total Materials', value: materials.length },
          { label: 'Low Stock Items', value: materials.filter(m => m.quantity <= m.reorderThreshold).length },
          { label: 'Total Quantity', value: materials.reduce((acc, m) => acc + m.quantity, 0) },
        ];
        break;
      case 'suppliers':
        columns = [
          { key: 'name', label: 'Supplier Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'address', label: 'Address' },
        ];
        data = suppliers;
        stats = [
          { label: 'Total Suppliers', value: suppliers.length },
        ];
        break;
      case 'toys':
        columns = [
          { key: 'name', label: 'Toy Name' },
          { key: 'description', label: 'Description' },
          { key: 'quantity', label: 'Quantity' },
          { key: 'storageLocation', label: 'Storage Location' },
          { key: 'manufactureDate', label: 'Manufacture Date' },
        ];
        data = toys.map(t => ({
          ...t,
          storageLocation: t.storageLocation.locationName,
          manufactureDate: new Date(t.manufactureDate).toLocaleDateString(),
        }));
        stats = [
          { label: 'Total Toys', value: toys.length },
          { label: 'Total Quantity', value: toys.reduce((acc, t) => acc + t.quantity, 0) },
        ];
        break;
      case 'warehouses':
        columns = [
          { key: 'locationName', label: 'Warehouse Name' },
          { key: 'address', label: 'Address' },
          { key: 'capacity', label: 'Capacity' },
        ];
        data = warehouses;
        stats = [
          { label: 'Total Warehouses', value: warehouses.length },
          { label: 'Total Capacity', value: warehouses.reduce((acc, w) => acc + w.capacity, 0) },
        ];
        break;
    }

    return (
      <>
        <StatsGrid stats={stats} />
        {activeTab === 'toys' && (
          <div className="mb-4">
            <select
              value={selectedWarehouse || ''}
              onChange={(e) => setSelectedWarehouse(e.target.value || null)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Warehouses</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse._id} value={warehouse._id}>
                  {warehouse.locationName}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mt-8">
          <DataTable
            columns={columns}
            data={data}
            onEdit={handleEdit}
          />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Logistics Management</h1>
          
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="mt-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}