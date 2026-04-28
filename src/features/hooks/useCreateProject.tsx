"use client"

import { addProjectServices } from "@/services/client/addProjectServices"

import { useState } from "react"
import { useRouter } from "next/navigation";
export function useCreateProject() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const router=useRouter();

  const handleCreate = async (data: any) => {
    try {
      setLoading(true)
      setError(null)

      await addProjectServices(data)
      router.push("/dashboard/client")
      

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { handleCreate, loading, error }
}