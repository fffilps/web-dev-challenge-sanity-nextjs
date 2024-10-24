'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Gift, User, Calendar, ThumbsUp, ListChecks } from "lucide-react"
import { client } from '../../sanity/client'
import { Button } from "../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"

interface Child {
  _id: string
  name: string
  age: number
  address: string
  status: 'naughty' | 'nice'
  wishList: string[]
}

export default function ChildPage() {
  const { childId } = useParams()
  const [child, setChild] = useState<Child | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChild = async () => {
      const query = `*[_type == "child" && _id == $childId][0]`

      try {
        const result = await client.fetch<Child>(query, { childId })
        setChild(result)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching child:', err)
        setError('Failed to fetch data. Please try again later.')
        setLoading(false)
      }
    }

    fetchChild()
  }, [childId])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading Child Data...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  if (!child) {
    return <div className="flex justify-center items-center h-screen">Child not found</div>
  }

  const stats = [
    { label: 'Age', value: child.age, icon: <Calendar className="h-4 w-4 text-muted-foreground" /> },
    { label: 'Status', value: child.status, icon: <ThumbsUp className="h-4 w-4 text-muted-foreground" /> },
    { label: 'Wish List Items', value: child.wishList.length, icon: <ListChecks className="h-4 w-4 text-muted-foreground" /> },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">
        <User className="inline-block mr-2" />
        {child.name}&apos;s Profile
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Child Information</CardTitle>
          <CardDescription>Details about {child.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <p><strong>Address:</strong> {child.address}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Gift className="inline-block mr-2" />
            Wish List
          </CardTitle>
          <CardDescription>Items {child.name} wants for Christmas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {child.wishList.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
