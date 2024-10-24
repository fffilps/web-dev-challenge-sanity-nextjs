'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { client } from '../../sanity/client'

interface CMSItem {
  _id: string
  title: string
  type: string
  content: string
  author?: string
  publishDate?: string
}

export default function CMSItemPage() {
  const { itemId } = useParams()
  const [cmsItem, setCMSItem] = useState<CMSItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCMSItem = async () => {
      const query = `*[_id == $itemId][0] {
        _id,
        title,
        _type,
        content,
        author,
        publishDate
      }`

      try {
        const result = await client.fetch<CMSItem>(query, { itemId })
        setCMSItem({
          ...result,
          type: result._type
        })
        setLoading(false)
      } catch (err) {
        console.error('Error fetching CMS item:', err)
        setError('Failed to fetch data. Please try again later.')
        setLoading(false)
      }
    }

    fetchCMSItem()
  }, [itemId])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading CMS Item Data...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  if (!cmsItem) {
    return <div className="flex justify-center items-center h-screen">CMS Item not found</div>
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-b from-red-100 to-green-100 min-h-screen">
      <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">{cmsItem.title}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p><strong>Type:</strong> {cmsItem.type}</p>
        {cmsItem.author && <p><strong>Author:</strong> {cmsItem.author}</p>}
        {cmsItem.publishDate && <p><strong>Publish Date:</strong> {cmsItem.publishDate}</p>}
        <h2 className="text-2xl font-semibold mt-4 mb-2">Content</h2>
        <div className="prose max-w-none">{cmsItem.content}</div>
      </div>
    </div>
  )
}
