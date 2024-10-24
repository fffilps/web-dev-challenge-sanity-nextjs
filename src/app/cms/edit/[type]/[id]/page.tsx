'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Gift, User } from "lucide-react"
import { client } from '../../../../sanity/client';
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../../../../components/ui/table";

type Column = {
  key: string;
  label: string;
};

export default function EditPage() {
  const { type, id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const state = router.state as { item?: Record<string, any>, type?: string, columns?: Column[] };
        if (state && state.item && state.type === type) {
          setData(state.item);
          setColumns(state.columns || []);
          setLoading(false);
        } else {
          const result = await client.fetch(`*[_type == "${type}" && _id == "${id}"][0]`);
          setData(result);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id, router]);

  const handleInputChange = (key: string, value: string) => {
    setData(prevData => prevData ? { ...prevData, [key]: value } : null);
  };

  const handleSubmit = async () => {
    if (!data || !id) return;
    try {
      await client.patch(id).set(data).commit();
      router.push('/cms');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!data) {
    return <div className="flex justify-center items-center h-screen">No data found</div>;
  }

  const renderIcon = () => {
    switch (type) {
      case 'elves':
        return <User className="h-6 w-6" />;
      case 'reindeer':
      case 'sleighs':
      case 'gifts':
        return <Gift className="h-6 w-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-b from-red-100 to-green-100 min-h-screen">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Edit {type && type.slice(0, -1)}</CardTitle>
          {renderIcon()}
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {columns.map(({ key, label }) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{label}</TableCell>
                  <TableCell>
                    <input
                      type="text"
                      value={data[key] as string}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
