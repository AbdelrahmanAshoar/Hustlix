"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Calendar, DollarSign, FileText, Hash, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MilestonesField({ milestones, setMilestones }: any) {

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      { title: "", description: "", amount: 0, deadline: "" },
    ]);
  };

  const updateMilestone = (index: number, field: string, value: any) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const removeMilestone = (index: number) => {
    const updated = milestones.filter((_: any, i: number) => i !== index);
    setMilestones(updated);
  };

  const totalAmount = milestones.reduce((sum: number, m: any) => sum + (m.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Project Milestones
          </h3>
          <p className="text-sm text-muted-foreground">
            Break down your project into manageable milestones
          </p>
        </div>
        <Button
          type="button"
          onClick={addMilestone}
          className="gap-2 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
          Add Milestone
        </Button>
      </div>

      {/* Milestones List with Animations */}
      <AnimatePresence mode="popLayout">
        {milestones.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2 border-dashed border-muted-foreground/20">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="rounded-full bg-gradient-to-br from-primary/10 to-primary/5 p-4 mb-4">
                  <Plus className="h-8 w-8 text-primary/60" />
                </div>
                <p className="text-muted-foreground font-medium">No milestones yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click the button above to add your first milestone
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {milestones.map((m: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <Card className="overflow-hidden border-muted/20 hover:border-primary/20 transition-all duration-300">
                    {/* Milestone Header */}
                    <div className="bg-gradient-to-r from-primary/5 via-transparent to-transparent px-6 py-4 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-semibold text-white shadow-sm">
                            {i + 1}
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">
                            Milestone {i + 1}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMilestone(i)}
                          className="text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Milestone Content */}
                    <CardContent className="p-6 space-y-5">
                      {/* Title Field */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          Title
                        </Label>
                        <Input
                          placeholder="e.g., Website Design, Backend Development"
                          value={m.title}
                          onChange={(e) => updateMilestone(i, "title", e.target.value)}
                          className="border-muted/40 focus:border-primary/50 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      {/* Description Field */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                          <Hash className="h-4 w-4" />
                          Description
                        </Label>
                        <Textarea
                          placeholder="Describe what needs to be delivered..."
                          value={m.description}
                          onChange={(e) => updateMilestone(i, "description", e.target.value)}
                          rows={3}
                          className="resize-none border-muted/40 focus:border-primary/50 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      {/* Amount and Deadline Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            Amount
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              $
                            </span>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0.00"
                              value={m.amount}
                              onChange={(e) => {
                                const value = e.target.value
                                updateMilestone(i, "amount", value === "" ? "" : parseFloat(value))
                              }}
                              className="pl-7 border-muted/40 focus:border-primary/50 focus:ring-primary/20 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Deadline
                          </Label>
                          <Input
                            type="date"
                            value={m.deadline}
                            onChange={(e) => updateMilestone(i, "deadline", e.target.value)}
                            className="border-muted/40 focus:border-primary/50 focus:ring-primary/20 transition-all"
                          />
                        </div>
                      </div>

                      {/* Completion Status */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Completion status</span>
                          <span>
                            {[
                              m.title ? 1 : 0,
                              m.description ? 1 : 0,
                              m.amount > 0 ? 1 : 0
                            ].reduce((a, b) => a + b, 0)}/3 fields
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${[
                                m.title ? 33 : 0,
                                m.description ? 33 : 0,
                                m.amount > 0 ? 34 : 0
                              ].reduce((a, b) => a + b, 0)}%` 
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Summary Card with Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-r from-primary/5 to-primary/3 border-primary/20">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Total Milestones
                        </p>
                        <p className="text-2xl font-bold">{milestones.length}</p>
                      </div>
                      <div className="h-10 w-px bg-border" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Project Value
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          ${totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {totalAmount > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Average: ${(totalAmount / milestones.length).toFixed(2)} per milestone
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}