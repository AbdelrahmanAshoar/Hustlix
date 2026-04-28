import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DialogDemo() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
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
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Required Skills</label>
              <input
                name="requiredSkills"
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
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none resize-none"
              placeholder="Describe your project..."
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
