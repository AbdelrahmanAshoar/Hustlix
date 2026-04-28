// app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Briefcase,
  Star,
  DollarSign,
  Clock,
  MessageCircle,
  Calendar,
  CheckCircle,
  LayoutDashboard,
  Users,
  TrendingUp,
  Award,
  ExternalLink,
  GitBranch,
  Code,
  Smartphone,
  Palette,
  Database,
  Cloud,
} from "lucide-react";
import Link from "next/link";

interface ProfileData {
  id: number;
  fullName: string;
  email: string;
  role: "Client" | "Freelancer" | "Admin";
  profilePictureUrl: string | null;
  bio?: string;
  location?: string;
  skills?: string[];
  hourlyRate?: number;
  experience?: number;
  languages?: { name: string; proficiency: string }[];
  portfolio?: PortfolioItem[];
  stats?: {
    rating?: number;
    totalJobs?: number;
    totalEarnings?: number;
    responseTime?: string;
    completedProjects?: number;
    activeProjects?: number;
    spentAmount?: number;
    hireRate?: number;
  };
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  company?: string;
  position?: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  technologies?: string[];
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on role
      const mockProfile: ProfileData = {
        id: user?.id || 1,
        fullName: user?.fullName || "Jane Doe",
        email: user?.email || "jane@example.com",
        role: user?.role as "Client" | "Freelancer" | "Admin" || "Freelancer",
        profilePictureUrl: user?.profilePictureUrl || null,
        bio: user?.role === "Freelancer" 
          ? "Hi! I'm a passionate UI/UX designer and frontend developer with over 6 years of experience building beautiful, responsive, and user-friendly digital products. My expertise lies in bridging the gap between design and development, ensuring that the final product not only looks great but also functions seamlessly."
          : "We are a tech company looking for talented freelancers to help us build amazing products. We believe in quality work and building long-term relationships with our collaborators.",
        location: "San Francisco, CA",
        skills: user?.role === "Freelancer" 
          ? ["Figma", "React", "Next.js", "Tailwind", "Framer Motion", "TypeScript", "Node.js"]
          : ["Project Management", "UI/UX Design", "Product Strategy", "Agile Methodologies"],
        hourlyRate: user?.role === "Freelancer" ? 60 : undefined,
        experience: user?.role === "Freelancer" ? 6 : undefined,
        languages: user?.role === "Freelancer"
          ? [
              { name: "English", proficiency: "Fluent (C2)" },
              { name: "Spanish", proficiency: "Conversational" }
            ]
          : undefined,
        portfolio: user?.role === "Freelancer" ? [
          {
            id: "1",
            title: "E-Commerce Platform",
            description: "Full-stack e-commerce solution with React and Node.js",
            imageUrl: "https://picsum.photos/seed/1/600/400",
            technologies: ["React", "Node.js", "MongoDB", "Stripe"]
          },
          {
            id: "2",
            title: "Mobile Banking App",
            description: "UI/UX design for a modern banking application",
            imageUrl: "https://picsum.photos/seed/2/600/400",
            technologies: ["Figma", "React Native"]
          }
        ] : undefined,
        stats: user?.role === "Freelancer" 
          ? {
              rating: 4.9,
              totalJobs: 45,
              totalEarnings: 45000,
              responseTime: "< 24 hrs",
              completedProjects: 42,
              activeProjects: 3
            }
          : {
              completedProjects: 28,
              activeProjects: 12,
              spentAmount: 35000,
              hireRate: 85
            },
        socialLinks: {
          linkedin: "https://linkedin.com/in/janedoe",
          github: "https://github.com/janedoe",
          twitter: "https://twitter.com/janedoe"
        },
        company: user?.role === "Client" ? "TechCorp Inc." : undefined,
        position: user?.role === "Client" ? "Product Manager" : undefined
      };
      
      setProfile(mockProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    if (!profile?.fullName) return "U";
    return profile.fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const isFreelancer = profile.role === "Freelancer";
  const isClient = profile.role === "Client";

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12 bg-card p-8 border rounded-xl shadow-sm">
        <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-primary/10">
          <AvatarImage src={profile.profilePictureUrl || "https://i.pravatar.cc/150?img=11"} />
          <AvatarFallback className="text-3xl">{getInitials()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{profile.fullName}</h1>
              <p className="text-xl text-muted-foreground mt-1">
                {isFreelancer ? "UX/UI Designer & Web Developer" : isClient ? "Hiring Manager" : profile.position}
              </p>
              {profile.company && (
                <p className="text-sm text-muted-foreground mt-1">{profile.company}</p>
              )}
            </div>
            <div className="flex gap-3">
              {isFreelancer ? (
                <>
                  <Button size="lg" className="rounded-full px-8 shadow-sm">Hire Me</Button>
                  <Button size="lg" variant="outline" className="rounded-full">Message</Button>
                </>
              ) : (
                <>
                  <Button size="lg" className="rounded-full px-8 shadow-sm">Post a Project</Button>
                  <Button size="lg" variant="outline" className="rounded-full">Search Talent</Button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 text-sm">
            {isFreelancer && profile.stats?.rating && (
              <div className="flex items-center text-amber-500 font-bold">
                ★ {profile.stats.rating} <span className="text-muted-foreground font-normal ml-1">({profile.stats.totalJobs} Jobs)</span>
              </div>
            )}
            
            {profile.location && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </div>
            )}
            
            {isFreelancer && profile.hourlyRate && (
              <div className="font-semibold text-primary">${profile.hourlyRate}/hr</div>
            )}
            
            {isClient && profile.stats?.hireRate && (
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                {profile.stats.hireRate}% Hire Rate
              </div>
            )}
          </div>
          
          {profile.skills && profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {profile.skills.slice(0, 6).map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1 font-medium">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio Section */}
              <section className="bg-card p-8 border rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold mb-4">About Me</h2>
                <div className="prose text-muted-foreground">
                  <p>{profile.bio}</p>
                </div>
              </section>

              {/* Skills & Expertise - Freelancer Only */}
              {isFreelancer && profile.skills && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">Skills & Expertise</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {profile.skills.map((skill) => (
                      <div key={skill} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                        {skill === "Figma" && <Palette className="h-4 w-4 text-primary" />}
                        {skill === "React" && <Code className="h-4 w-4 text-primary" />}
                        {skill === "Next.js" && <Code className="h-4 w-4 text-primary" />}
                        {skill === "Tailwind" && <Smartphone className="h-4 w-4 text-primary" />}
                        {skill === "TypeScript" && <Database className="h-4 w-4 text-primary" />}
                        {skill === "Node.js" && <Cloud className="h-4 w-4 text-primary" />}
                        <span className="text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Experience - Freelancer Only */}
              {isFreelancer && profile.experience && (
                <section className="bg-muted/30 p-6 rounded-xl">
                  <h3 className="font-semibold mb-3">Work Experience</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Senior Frontend Developer</p>
                        <p className="text-sm text-muted-foreground">Tech Solutions Inc. • 2020 - Present</p>
                        <p className="text-sm mt-1">Leading frontend development team, building scalable React applications.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">UI/UX Designer</p>
                        <p className="text-sm text-muted-foreground">Creative Agency • 2017 - 2020</p>
                        <p className="text-sm mt-1">Designed user interfaces for 20+ client projects.</p>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isFreelancer ? (
                    <>
                      <div className="flex justify-between border-b pb-4">
                        <span className="text-muted-foreground text-sm">Total Earnings</span>
                        <span className="font-semibold">${profile.stats?.totalEarnings?.toLocaleString()}+</span>
                      </div>
                      <div className="flex justify-between border-b pb-4">
                        <span className="text-muted-foreground text-sm">Jobs Completed</span>
                        <span className="font-semibold">{profile.stats?.totalJobs}</span>
                      </div>
                      <div className="flex justify-between border-b pb-4">
                        <span className="text-muted-foreground text-sm">Active Projects</span>
                        <span className="font-semibold">{profile.stats?.activeProjects}</span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span className="text-muted-foreground text-sm">Response Time</span>
                        <span className="font-semibold">{profile.stats?.responseTime}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between border-b pb-4">
                        <span className="text-muted-foreground text-sm">Projects Posted</span>
                        <span className="font-semibold">{profile.stats?.completedProjects}</span>
                      </div>
                      <div className="flex justify-between border-b pb-4">
                        <span className="text-muted-foreground text-sm">Active Projects</span>
                        <span className="font-semibold">{profile.stats?.activeProjects}</span>
                      </div>
                      <div className="flex justify-between border-b pb-4">
                        <span className="text-muted-foreground text-sm">Total Spent</span>
                        <span className="font-semibold">${profile.stats?.spentAmount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span className="text-muted-foreground text-sm">Hired Freelancers</span>
                        <span className="font-semibold">{Math.floor(profile.stats?.completedProjects || 0 / 2)}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Languages - Freelancer Only */}
              {isFreelancer && profile.languages && (
                <Card>
                  <CardHeader>
                    <CardTitle>Languages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {profile.languages.map((lang) => (
                      <div key={lang.name} className="flex justify-between text-sm">
                        <span>{lang.name}</span>
                        <span className="text-muted-foreground">{lang.proficiency}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Social Links */}
              {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Connect</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {profile.socialLinks.linkedin && (
                      <Link href={profile.socialLinks.linkedin} target="_blank" className="flex items-center justify-between text-sm hover:text-primary">
                        <span>LinkedIn</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                    {profile.socialLinks.github && (
                      <Link href={profile.socialLinks.github} target="_blank" className="flex items-center justify-between text-sm hover:text-primary">
                        <span>GitHub</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                    {profile.socialLinks.twitter && (
                      <Link href={profile.socialLinks.twitter} target="_blank" className="flex items-center justify-between text-sm hover:text-primary">
                        <span>Twitter</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Portfolio Tab - Freelancer Only */}
        <TabsContent value="portfolio" className="space-y-8">
          {isFreelancer && profile.portfolio ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.portfolio.map((item) => (
                  <div key={item.id} className="group relative overflow-hidden rounded-xl border bg-card">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      {item.technologies && (
                        <div className="flex flex-wrap gap-1">
                          {item.technologies.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No portfolio items yet</p>
            </div>
          )}
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-8">
          <div className="space-y-4">
            {isFreelancer ? (
              // Reviews for Freelancer
              <>
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://i.pravatar.cc/100?img=${i + 20}`} />
                            <AvatarFallback>CL</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm">Client Name</p>
                            <div className="flex items-center text-amber-500 text-sm">
                              ★★★★★
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">2 weeks ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Exceptional quality and communication! Jane delivered the project exactly as requested and ahead of schedule. Her design skills are top-notch. Highly recommend!
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              // Reviews for Client
              <>
                {[1, 2].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://i.pravatar.cc/100?img=${i + 30}`} />
                            <AvatarFallback>FR</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm">Freelancer Name</p>
                            <div className="flex items-center text-amber-500 text-sm">
                              ★★★★★
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">1 month ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Great client to work with! Clear communication, fair payment, and interesting project. Would definitely work with them again.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}