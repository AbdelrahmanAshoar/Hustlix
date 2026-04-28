"use client"

import { useState } from "react"
import { useCreateProject } from "@/features/hooks/useCreateProject"
import MilestonesField from "./MilestonesField"

export default function ProjectForm() {
  const { handleCreate, loading, error } = useCreateProject();
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: 0,
    deadline: "",
    requiredSkills: "",
    milestones: [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const setMilestones = (milestones: any) => {
    setForm((prev) => ({
      ...prev,
      milestones,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleCreate(form)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4 py-10">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl bg-white shadow-xl rounded-2xl border p-8 space-y-8"
      >

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create New Project
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to post your project
          </p>
        </div>

        {/* GRID INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Title</label>
            <input
              name="title"
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
              placeholder="Build a SaaS platform"
            />
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Budget ($)</label>
            <input
              name="budget"
              type="number"
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
              placeholder="5000"
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Deadline</label>
            <input
              name="deadline"
              type="date"
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Required Skills</label>
            <input
              name="requiredSkills"
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
              placeholder="React, Node, Next.js"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows={5}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none resize-none"
            placeholder="Describe your project..."
          />
        </div>

        {/* Milestones */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Milestones</label>
          <div className="border rounded-xl p-4 bg-muted/30">
            <MilestonesField
              milestones={form.milestones}
              setMilestones={setMilestones}
            />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Creating Project..." : "Publish Project"}
        </button>
      </form>
    </div>
  )
}