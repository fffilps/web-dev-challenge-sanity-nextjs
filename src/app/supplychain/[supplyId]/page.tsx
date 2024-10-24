'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { client } from '../../sanity/client'

interface SupplyItem {
  _id: string
  name: string
  quantity: number
  supplier: string
  description?: string
  lastOrderDate?: string
}

export default function SupplyItemPage() {
  const { supplyId } = useParams()
  const [supplyItem, setSupplyItem] = useState<SupplyItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSupplyItem = async () => {
      const query = `*[_type == "supplyItem" && _id == $supplyId][0]`

      try {
        const result = await client.fetch<SupplyItem>(query, { supplyId })
        setSupplyItem(result)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching supply item:', err)
        setError('Failed to fetch data. Please try again later.')
        setLoading(false)
      }
    }

    fetchSupplyItem()
  }, [supplyId])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading Supply Item Data...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  if (!supplyItem) {
    return <div className="flex justify-center items-center h-screen">Supply Item not found</div>
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-b from-red-100 to-green-100 min-h-screen">
      <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">{supplyItem.name} Details</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p><strong>Quantity:</strong> {supplyItem.quantity}</p>
        <p><strong>Supplier:</strong> {supplyItem.supplier}</p>
        {supplyItem.description && <p><strong>Description:</strong> {supplyItem.description}</p>}
        {supplyItem.lastOrderDate && <p><strong>Last Order Date:</strong> {supplyItem.lastOrderDate}</p>}
      </div>
    </div>
  )
}
