export interface ProfileAuth {
  userRole?: string;
  email?: string;
  createdAt?: string;
}

export interface PersonalInfo {
  fullName?: string;
  photoUrl?: string;
  address?: string;
}

export interface ProfessionalInfo {
  jobTitle?: string;
  about?: string;
  company?: string;
  cvUrl?: string;
  skills?: string[];
}

export interface PortfolioProject {
  title?: string;
  details?: string;
  fileUrl?: string;
}

export interface PortfolioInfo {
  mainLink?: string;
  projects?: PortfolioProject[];
}

export interface ProfilePageData {
  auth?: ProfileAuth;
  personalInfo?: PersonalInfo;
  professionalInfo?: ProfessionalInfo;
  portfolio?: PortfolioInfo;
  profileProgress?: number;
  averageRating?: number;
  hiringHistory?: unknown;
}
