"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { ProjectData } from "../services/types/freelancer";
import Link from "next/link";

export default function projectsClient({ data }: { data: ProjectData[] }) {
  console.log("**************************Received projects data:", data);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedBudgetType, setSelectedBudgetType] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get unique categories from projects for filter
  const categories = [...new Set(data.map(project => {
    if (project.requiredSkills) {
      const skills = project.requiredSkills.split(',');
      if (skills.some(s => s.toLowerCase().includes('web'))) return 'Web Development';
      if (skills.some(s => s.toLowerCase().includes('mobile') || s.toLowerCase().includes('app'))) return 'Mobile Apps';
      if (skills.some(s => s.toLowerCase().includes('ui') || s.toLowerCase().includes('ux') || s.toLowerCase().includes('design'))) return 'UX/UI Design';
      if (skills.some(s => s.toLowerCase().includes('copy') || s.toLowerCase().includes('content'))) return 'Copywriting';
    }
    return 'Other';
  }))];

  // Filter projects based on search and filters
  const filteredProjects = data.filter((project) => {
    // Search by title or skills
    const matchesSearch = searchTerm === "" || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.requiredSkills && project.requiredSkills.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category filter
    const matchesCategory = selectedCategory.length === 0 || 
      (() => {
        if (selectedCategory.includes('Web Development') && project.requiredSkills?.toLowerCase().includes('web')) return true;
        if (selectedCategory.includes('Mobile Apps') && (project.requiredSkills?.toLowerCase().includes('mobile') || project.requiredSkills?.toLowerCase().includes('app'))) return true;
        if (selectedCategory.includes('UX/UI Design') && (project.requiredSkills?.toLowerCase().includes('ui') || project.requiredSkills?.toLowerCase().includes('ux') || project.requiredSkills?.toLowerCase().includes('design'))) return true;
        if (selectedCategory.includes('Copywriting') && (project.requiredSkills?.toLowerCase().includes('copy') || project.requiredSkills?.toLowerCase().includes('content'))) return true;
        return false;
      })();

    return matchesSearch && matchesCategory;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      case "budget_high":
        return b.budget - a.budget;
      case "budget_low":
        return a.budget - b.budget;
      default:
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper function to get time ago
  function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return `${diffSeconds} second${diffSeconds !== 1 ? 's' : ''} ago`;
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }

  // Get experience level based on budget
  const getExperienceLevel = (budget: number) => {
    if (budget < 500) return "Entry Level";
    if (budget < 2000) return "Intermediate";
    return "Expert";
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory([]);
    setSelectedBudgetType([]);
    setSelectedExperience([]);
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Handle category checkbox change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  // Handle budget type change
  const handleBudgetTypeChange = (type: string) => {
    setSelectedBudgetType(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
    setCurrentPage(1);
  };

  // Handle experience level change
  const handleExperienceChange = (level: string) => {
    setSelectedExperience(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
    setCurrentPage(1);
  };

  // Filter projects by budget type
  const budgetFilteredProjects = selectedBudgetType.length > 0
    ? paginatedProjects.filter(project => {
        // Assuming fixed price for now (you can adjust based on your data structure)
        return true;
      })
    : paginatedProjects;

  // Filter by experience level
  const experienceFilteredProjects = selectedExperience.length > 0
    ? budgetFilteredProjects.filter(project => 
        selectedExperience.includes(getExperienceLevel(project.budget))
      )
    : budgetFilteredProjects;

  const finalProjects = experienceFilteredProjects;

  return (
    <div className="bg-muted/10 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-primary/5 py-12 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            Find Work
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Browse hundreds of freelance projects tailored to your skills.
          </p>
          <div className="max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10 h-12 rounded-full border-primary/20 bg-background"
              placeholder="Search projects by skills or title..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
            {/* Search Results Info */}
            {searchTerm && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  Searching for: <strong>"{searchTerm}"</strong>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Found {filteredProjects.length} results
                </p>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                Category
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategory.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                      className="rounded border-muted"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                Budget Type
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    checked={selectedBudgetType.includes("Hourly")}
                    onChange={() => handleBudgetTypeChange("Hourly")}
                    className="rounded border-muted"
                  />
                  Hourly
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    checked={selectedBudgetType.includes("Fixed Price")}
                    onChange={() => handleBudgetTypeChange("Fixed Price")}
                    className="rounded border-muted"
                  />
                  Fixed Price
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                Experience Level
              </h3>
              <div className="space-y-2">
                {["Entry Level", "Intermediate", "Expert"].map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary"
                  >
                    <input
                      type="checkbox"
                      checked={selectedExperience.includes(level)}
                      onChange={() => handleExperienceChange(level)}
                      className="rounded border-muted"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>

          {/* Listing Grid */}
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                Showing {finalProjects.length} of {filteredProjects.length} projects
              </span>
              <select 
                className="border rounded-md text-sm p-2 bg-background cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="budget_high">Budget: High to Low</option>
                <option value="budget_low">Budget: Low to High</option>
              </select>
            </div>

            {/* No Results Message */}
            {finalProjects.length === 0 && (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Search className="h-12 w-12 text-muted-foreground" />
                  <h3 className="text-xl font-semibold">No projects found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear all filters
                  </Button>
                </div>
              </Card>
            )}

            {/* Projects List */}
            {finalProjects.map((item, id) => (
              <Link href={`/projects/${item.id}`} key={item.id || id}>
                <Card className="hover:border-primary/50 transition-all shadow-sm hover:shadow-md cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <CardTitle className="text-xl text-primary font-semibold hover:underline">
                        {item.title}
                      </CardTitle>
                      <div className="text-right whitespace-nowrap bg-green-50 px-3 py-1 rounded-lg">
                        <div className="font-bold text-lg text-primary">
                          ${item.budget?.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Fixed Price
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                      <span>📅 {timeAgo(item.postedDate)}</span>
                      <span>•</span>
                      <span>💼 {getExperienceLevel(item.budget)}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.requiredSkills?.split(",").slice(0, 5).map((skill, i) => (
                        <Badge key={i} variant="secondary" className="hover:bg-primary/10">
                          {skill.trim()}
                        </Badge>
                      ))}
                      {item.requiredSkills?.split(",").length > 5 && (
                        <Badge variant="outline">
                          +{item.requiredSkills.split(",").length - 5} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 text-sm text-muted-foreground border-t bg-muted/20">
                    <span className="font-medium">Proposals:</span> {item.proposalsCount || 0}
                    <span className="mx-2">•</span>
                    <span className="font-medium">Experience level:</span>{" "}
                    {getExperienceLevel(item.budget)}
                  </CardFooter>
                </Card>
              </Link>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-full"
                >
                  Previous
                </Button>
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        onClick={() => setCurrentPage(pageNum)}
                        className="rounded-full w-10 h-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-full"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}