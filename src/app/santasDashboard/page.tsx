'use client'

import React, { useState, useEffect } from 'react'
import { Baby, Check, X, ArrowUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { client } from '../sanity/client'
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"

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

interface Child {
  _id: string
  name: string
  age: number
  address: string
  status: 'naughty' | 'nice'
  wishList: string[]
}

const tabs: Tab[] = [
  { id: 'all', label: 'All Children', icon: <Baby size={16} /> },
  { id: 'nice', label: 'Nice Children', icon: <Check size={16} /> },
  { id: 'naughty', label: 'Naughty Children', icon: <X size={16} /> },
];

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [activeTab, setActiveTab] = useState<'all' | 'nice' | 'naughty'>('all')
  const router = useRouter()

  useEffect(() => {
    const fetchChildren = async () => {
      const query = `*[_type == "child"] | order(name ${sortOrder}) {
        _id,
        name,
        age,
        address,
        status,
        wishList
      }`

      try {
        const result = await client.fetch<Child[]>(query)
        setChildren(result)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching children:', err)
        setError('Failed to fetch data. Please try again later.')
        setLoading(false)
      }
    }

    fetchChildren()
  }, [sortOrder])

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc')
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading Children Data...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  const filteredChildren = children.filter(child => {
    if (activeTab === 'all') return true;
    return child.status === activeTab;
  });

  const columns: Column[] = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'status', label: 'Status' },
  ];

  const stats: StatCardProps[] = [
    { label: 'Total Children', value: children.length },
    { label: 'Nice Children', value: children.filter(child => child.status === 'nice').length },
    { label: 'Naughty Children', value: children.filter(child => child.status === 'naughty').length },
  ];

  const handleChildClick = (childId: string) => {
    router.push(`/santasDashboard/${childId}`)
  }

  const renderTabContent = () => {
    return (
      <>
        <div className="mb-4 flex justify-end">
          <Button
            onClick={toggleSortOrder}
            className="flex items-center"
          >
            Sort by Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChildren.map((child) => (
              <TableRow key={child._id} onClick={() => handleChildClick(child._id)} className="cursor-pointer hover:bg-gray-100">
                <TableCell>{child.name}</TableCell>
                <TableCell>{child.age}</TableCell>
                <TableCell>{child.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Santa&apos;s Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}>
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <Card>
              <CardHeader>
                <CardTitle>{tab.label}</CardTitle>
                <CardDescription>A list of {tab.label.toLowerCase()} in Santa&apos;s database.</CardDescription>
              </CardHeader>
              <CardContent>
                {renderTabContent()}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
