'use client';

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useLoginMutation } from "./hooks";

export default function Home() {
  const [tableName, setTableName] = useState("")
  const router = useRouter()
  const mutation = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tableName.trim()) {
      mutation.mutate({ nomorMeja: tableName });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
      <form onSubmit={handleSubmit} className="flex flex-col items-center bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
        <label htmlFor="tableName" className="mb-4 text-2xl font-bold text-green-800 dark:text-green-300">Enter Table Name</label>
        <input
          id="tableName"
          type="text"
          value={tableName}
          onChange={e => setTableName(e.target.value)}
          className="mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-lg dark:bg-gray-800 dark:text-white"
          placeholder="e.g. M05"
          autoFocus
        />
        <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-8 py-2 text-lg">Continue</Button>
      </form>
    </div>
  )
}
