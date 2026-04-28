// app/freelancer/add-proposal/[projectId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Send,
  DollarSign,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  Loader2,
  User,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { addProposal } from "@/services/freelancer/addProposal";
import { toast } from "sonner";

export default function FreelancerAddProposalPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);

  const [formData, setFormData] = useState({
    projectId: projectId,
    proposedPrice: "",
    deliveryDays: "",
    coverLetter: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [projectBudget, setProjectBudget] = useState<number | null>(null);
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");

  // Fetch project details
  useEffect(() => {
    if (projectId && !isNaN(projectId)) {
      fetchProjectDetails();
    } else {
      console.error("Invalid project ID:", params.projectId);
      toast.error("Invalid project ID");
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProjectBudget(data.budget);
        setProjectTitle(data.title);
        setProjectDescription(data.description);
      }
    } catch (error) {
      console.error("Failed to fetch project details:", error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.proposedPrice || parseFloat(formData.proposedPrice) <= 0) {
      newErrors.proposedPrice = "Please enter a valid price amount";
    } else if (
      projectBudget &&
      parseFloat(formData.proposedPrice) > projectBudget * 2
    ) {
      newErrors.proposedPrice = `Your price ($${parseFloat(formData.proposedPrice)}) is significantly higher than the project budget ($${projectBudget})`;
    }

    if (!formData.deliveryDays || parseInt(formData.deliveryDays) <= 0) {
      newErrors.deliveryDays = "Please enter a valid number of days";
    } else if (parseInt(formData.deliveryDays) > 365) {
      newErrors.deliveryDays = "Delivery time cannot exceed 365 days";
    }

    if (!formData.coverLetter || formData.coverLetter.trim().length < 50) {
      newErrors.coverLetter = "Cover letter must be at least 50 characters";
    } else if (formData.coverLetter.trim().length > 5000) {
      newErrors.coverLetter = "Cover letter cannot exceed 5000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "coverLetter") {
      setCharCount(value.length);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const proposalData = {
      projectId: formData.projectId,
      proposedPrice: parseFloat(formData.proposedPrice),
      deliveryDays: parseInt(formData.deliveryDays),
      coverLetter: formData.coverLetter.trim(),
    };

    console.log("Submitting proposal data:", proposalData);

    try {
      const result = await addProposal(proposalData);

      if (result.success) {
        toast.success("Proposal submitted successfully!");

        // Redirect back to project details after 2 seconds
        setTimeout(() => {
          router.push(`/projects/${projectId}`);
        }, 2000);
      } else {
        toast.error(result.message || "Failed to submit proposal");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(
        error.message || "Failed to submit proposal. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick price suggestions based on project budget
  const quickPriceSuggestions = projectBudget
    ? [
        {
          label: "Budget",
          value: Math.round(projectBudget * 0.6),
          days: 45,
          icon: "💰",
        },
        {
          label: "Standard",
          value: Math.round(projectBudget * 0.8),
          days: 30,
          icon: "⭐",
        },
        {
          label: "Premium",
          value: Math.round(projectBudget * 1.0),
          days: 21,
          icon: "💎",
        },
        {
          label: "Express",
          value: Math.round(projectBudget * 1.3),
          days: 14,
          icon: "⚡",
        },
      ]
    : [];

  const applySuggestion = (price: number, days: number) => {
    setFormData((prev) => ({
      ...prev,
      proposedPrice: price.toString(),
      deliveryDays: days.toString(),
    }));
  };

  if (!projectId || isNaN(projectId)) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Invalid project ID. Please go back and try again.
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/projects/${projectId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-all hover:translate-x-[-4px]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Project Details
        </Link>

        {/* Project Summary Card */}
        {projectTitle && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {projectTitle}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {projectDescription}
                  </p>
                  {projectBudget && (
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700"
                      >
                        Budget: ${projectBudget.toLocaleString()}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Form Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8 md:px-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                New Proposal
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Submit Your Proposal
            </h1>
            <p className="text-emerald-100">
              Tell the client why you're the perfect fit for this project
            </p>
          </div>

          <CardContent className="p-6 md:p-8">
            {/* Connects Info Alert */}
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span>
                    <span className="font-semibold">14 Connects required</span>{" "}
                    to submit this proposal
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 border-amber-300"
                  >
                    Available: 60 Connects
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Quick Quote Suggestions */}
              {quickPriceSuggestions.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-gray-700 font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Quick Quote Suggestions
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {quickPriceSuggestions.map((suggestion, idx) => (
                      <Button
                        key={idx}
                        type="button"
                        variant="outline"
                        onClick={() =>
                          applySuggestion(suggestion.value, suggestion.days)
                        }
                        className="flex flex-col h-auto py-3 hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                      >
                        <span className="text-xl">{suggestion.icon}</span>
                        <span className="font-bold text-emerald-600">
                          ${suggestion.value.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {suggestion.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          {suggestion.days} days
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price and Delivery Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Proposed Price */}
                <div className="space-y-2">
                  <Label
                    htmlFor="proposedPrice"
                    className="text-gray-700 font-semibold flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Proposed Price ($) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="proposedPrice"
                      name="proposedPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g., 2500"
                      value={formData.proposedPrice}
                      onChange={handleChange}
                      className={`pl-9 transition-all focus:ring-2 focus:ring-emerald-500 ${
                        errors.proposedPrice
                          ? "border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                      required
                    />
                  </div>
                  {errors.proposedPrice && (
                    <p className="text-sm text-red-500">
                      {errors.proposedPrice}
                    </p>
                  )}
                  {projectBudget && (
                    <p className="text-xs text-gray-500">
                      Client's budget: ${projectBudget.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Delivery Days */}
                <div className="space-y-2">
                  <Label
                    htmlFor="deliveryDays"
                    className="text-gray-700 font-semibold flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Delivery Time (Days) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="deliveryDays"
                      name="deliveryDays"
                      type="number"
                      min="1"
                      max="365"
                      placeholder="e.g., 14"
                      value={formData.deliveryDays}
                      onChange={handleChange}
                      className={`pl-9 transition-all focus:ring-2 focus:ring-emerald-500 ${
                        errors.deliveryDays
                          ? "border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                      required
                    />
                  </div>
                  {errors.deliveryDays && (
                    <p className="text-sm text-red-500">
                      {errors.deliveryDays}
                    </p>
                  )}
                  <div className="flex gap-2 mt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, deliveryDays: "7" }))
                      }
                      className="text-xs h-7"
                    >
                      ⚡ 7 days
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, deliveryDays: "14" }))
                      }
                      className="text-xs h-7"
                    >
                      📅 14 days
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, deliveryDays: "30" }))
                      }
                      className="text-xs h-7"
                    >
                      🗓️ 30 days
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, deliveryDays: "60" }))
                      }
                      className="text-xs h-7"
                    >
                      📆 60 days
                    </Button>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="space-y-2">
                <Label
                  htmlFor="coverLetter"
                  className="text-gray-700 font-semibold flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Cover Letter <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows={12}
                  placeholder={`Dear Client,

I am writing to express my strong interest in your project. After carefully reviewing your requirements, I am confident that I can deliver exceptional results.

Why choose me?
• 5+ years of experience in similar projects
• 100+ successful projects completed
• 5-star rating from all clients
• Available to start immediately
• Regular updates and clear communication

My approach to this project:
1. Thorough analysis of your requirements
2. Detailed project plan and timeline
3. Regular progress updates
4. Quality testing before delivery
5. Post-delivery support and maintenance

I have attached my portfolio for your reference. I would love to discuss this opportunity further.

Thank you for your consideration.

Best regards,
[Your Name]`}
                  value={formData.coverLetter}
                  onChange={handleChange}
                  className={`resize-none transition-all focus:ring-2 focus:ring-emerald-500 ${
                    errors.coverLetter
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  required
                />
                {errors.coverLetter && (
                  <p className="text-sm text-red-500">{errors.coverLetter}</p>
                )}
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    💡 Write a compelling cover letter (minimum 50 characters)
                  </p>
                  <span
                    className={`text-xs font-medium ${charCount < 50 ? "text-red-500" : "text-emerald-600"}`}
                  >
                    {charCount} / 50+ characters
                  </span>
                </div>
              </div>

              {/* Tips Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-blue-600" />
                    <h5 className="font-semibold text-sm text-blue-900">
                      Personalize
                    </h5>
                  </div>
                  <p className="text-xs text-blue-700">
                    Mention specific project details from the description
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="h-4 w-4 text-purple-600" />
                    <h5 className="font-semibold text-sm text-purple-900">
                      Show Experience
                    </h5>
                  </div>
                  <p className="text-xs text-purple-700">
                    Highlight relevant past work and successes
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <h5 className="font-semibold text-sm text-green-900">
                      Be Professional
                    </h5>
                  </div>
                  <p className="text-xs text-green-700">
                    Proofread and ensure clear communication
                  </p>
                </div>
              </div>

              {/* Sample Template */}
              <details className="bg-gray-50 rounded-lg p-3 border">
                <summary className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-emerald-600">
                  📝 View Cover Letter Template Example
                </summary>
                <div className="mt-3 p-4 bg-white rounded border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Professional Cover Letter Template:
                  </h4>
                  <pre className="whitespace-pre-wrap text-xs text-gray-600 font-sans">
                    {`Dear Client,

I've carefully reviewed your project requirements and I'm very excited about this opportunity.

My relevant experience includes:
• [Project Type 1] - [Brief description and outcome]
• [Project Type 2] - [Brief description and outcome]
• [Technical Skills] - [Years of experience]

For your project, I propose:
• Timeline: [X] days for completion
• Process: Clear milestones and regular updates
• Quality: Thorough testing and revisions included

I'm confident I can deliver exactly what you're looking for.

Would you like to schedule a quick call to discuss further?

Best regards,
[Your Name]`}
                  </pre>
                </div>
              </details>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex-1 transition-all hover:scale-[1.02]"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting Proposal...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Proposal
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/projects/${projectId}`)}
                  className="flex-1"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>

              {/* Footer Note */}
              <div className="text-center space-y-2">
                <p className="text-xs text-gray-500">
                  By submitting this proposal, you agree to use{" "}
                  <span className="font-semibold">14 Connects</span>
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Response within 24-48 hours
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Visible to client immediately
                  </span>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
