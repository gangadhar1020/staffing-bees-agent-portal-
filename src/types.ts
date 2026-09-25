export interface CandidateSkill {
  name: string;
  category: 'Primary' | 'Secondary' | 'Soft' | 'Domain';
  years: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  lastUsed: string;
}

export interface CandidateEducation {
  highestQualification: string;
  degree: string;
  specialization: string;
  institution: string;
  graduationYear: string;
  additionalQualifications?: string;
}

export interface CandidateCertification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  verified: boolean;
}

export interface CandidateJobMatch {
  id: string;
  jobTitle: string;
  client: string;
  opportunityId: string;
  matchStatus: string;
  skillMatch: boolean;
  experienceMatch: boolean;
  locationMatch: boolean;
  workModelMatch: boolean;
  compensationMatch: boolean;
  availabilityMatch: boolean;
  workAuthReview: string;
  candidateInterest: 'High' | 'Medium' | 'Interested' | 'Pending';
  submissionStatus: string;
}

export interface CandidateSubmission {
  id: string;
  job: string;
  client: string;
  submittedDate: string;
  submittedBy: string;
  status: 'Submitted' | 'Screening' | 'Interview' | 'Rejected' | 'Offer' | 'Placed' | 'Withdrawn';
  interviewDate?: string;
  feedback?: string;
  offerStatus?: string;
}

export interface CandidateInterview {
  id: string;
  job: string;
  client: string;
  interviewType: 'Technical Screen' | 'Hiring Manager' | 'System Design' | 'Cultural Fit' | 'Final Round';
  date: string;
  time: string;
  interviewer: string;
  status: 'Scheduled' | 'Completed' | 'Rescheduled' | 'Cancelled' | 'No Show';
  feedback?: string;
  result?: 'Recommended' | 'Strong Hire' | 'Pending' | 'Rejected';
}

export interface CandidateOffer {
  id: string;
  job: string;
  client: string;
  offerDate: string;
  offeredSalary: string;
  startDate: string;
  status: 'Extended' | 'Accepted' | 'Under Review' | 'Declined';
  decision: string;
}

export interface CandidatePlacement {
  placementDate: string;
  client: string;
  job: string;
  agent: string;
  placementType: string;
  salary: string;
  startDate: string;
  fee: string;
  commission: string;
  paymentStatus: string;
  placementStatus: string;
}

export interface CandidateDocument {
  id: string;
  type: string;
  fileName: string;
  uploadedDate: string;
  uploadedBy: string;
  verificationStatus: 'Verified' | 'Pending' | 'Uploaded';
  expiryDate?: string;
  notes?: string;
}

export interface CandidateTimelineItem {
  id: string;
  date: string;
  time: string;
  user: string;
  action: string;
  notes: string;
}

export interface CandidateNote {
  id: string;
  category: string;
  author: string;
  date: string;
  content: string;
}

export interface Candidate {
  id: string; // e.g. SB-CAN-10245
  name: string;
  preferredName?: string;
  phone: string;
  altPhone?: string;
  email: string;
  preferredContactMethod?: 'Email' | 'Phone' | 'WhatsApp';
  preferredCommunicationTime?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  avatar?: string;

  created: string;
  lastUpdated?: string;
  stage: string; // Screening, Intake, Qualified, Interview, etc.
  source: string;
  lastActivity: string;
  jobId: string;
  selected?: boolean;

  // Header & Core Information
  currentRole: string;
  targetRole: string;
  level: 'Entry Level' | 'Junior' | 'Mid Level' | 'Senior' | 'Lead';
  status: 'Active' | 'In Review' | 'On Hold' | 'Placed';
  readiness: 'Not Ready' | 'Coaching Required' | 'Interview Ready' | 'Market Ready';
  location: string;
  preferredLocation?: string;
  workPreference?: 'Remote' | 'Hybrid' | 'On-site' | 'Flexible';
  relocationPreference?: 'Open to Relocate' | 'Not Relocating' | 'Within Country';
  preferredShift?: 'Day' | 'Night' | 'Flexible';
  preferredWorkingHours?: string;

  // Critical Agent Ownership (Section 8)
  originalSourceAgent: string; // Retained forever, never overwritten!
  currentAssignedAgent: string; // May be reassigned to other agents

  // Professional
  professionalSummary?: string;
  industry?: string;
  domain?: string;
  totalExperience?: string;
  relevantExperience?: string;
  links?: {
    resume?: string;
    linkedin?: string;
    portfolio?: string;
    github?: string;
  };

  // Employment
  employment?: {
    currentEmployer: string;
    currentTitle: string;
    employmentStatus: 'Employed' | 'Serving Notice' | 'Immediately Available' | 'Unemployed';
    employmentType: 'Full-time' | 'Contract' | 'Part-time';
    joiningDate: string;
    noticePeriod: string;
    lastWorkingDay?: string;
    previousEmployer?: string;
    employmentGaps?: string;
    reasonForLeaving?: string;
  };

  // Compensation
  compensation?: {
    currentSalary: string;
    expectedSalary: string;
    minAcceptableSalary: string;
    currentRate?: string;
    expectedRate?: string;
    payFrequency: string;
    currency: string;
    negotiable: boolean;
    benefits?: string;
    notes?: string;
  };

  // Skills & Education
  skills?: CandidateSkill[];
  education?: CandidateEducation[];
  certifications?: CandidateCertification[];

  // Training & Development (Candidate-specific, distinct from Agent certification)
  training?: {
    trainingRequired: boolean;
    trainingStatus: 'Recommended' | 'In Progress' | 'Completed' | 'Not Required';
    trainingAreas: string[];
    trainingPriority: 'Low' | 'Medium' | 'High';
    trainingReason: string;
    recommendedTraining: string;
    completionPercentage: number;
  };

  // Verification
  verification?: {
    contactVerified: boolean;
    professionalVerified: boolean;
    employmentVerified: boolean;
    experienceVerified: boolean;
    skillsVerified: boolean;
    educationVerified: boolean;
    duplicateCheck: 'Clear' | 'Possible Duplicate';
    suspiciousProfileCheck: 'Passed' | 'Flagged';
    resumeConsistency: 'Consistent' | 'Needs Review';
    overallStatus: 'Not Verified' | 'Partially Verified' | 'Verified' | 'Needs Review';
  };

  // Work Authorization
  workAuthorization?: {
    status: 'Authorized' | 'Visa Required' | 'Needs Specialist Review';
    type: string;
    country: string;
    expiryDate?: string;
    sponsorshipRequired: boolean;
    verificationStatus: string;
    notes?: string;
  };

  // Candidate Readiness & Coaching
  readinessDetails?: {
    resumeReadiness: 'Ready' | 'Needs Improvement';
    communicationReadiness: 'High' | 'Moderate' | 'Needs Coaching';
    technicalReadiness: 'Interview Ready' | 'Needs Assessment';
    behavioralReadiness: 'Strong' | 'Satisfactory';
    coachingStatus: string;
    marketReadyStatus: 'Market Ready' | 'In Preparation';
    coachingTasks: string[];
    completedCoaching: string[];
    pendingCoaching: string[];
    mockInterviewStatus: string;
    lastFeedback: string;
    improvementAreas: string[];
  };

  // Pipeline Opportunities & Records
  jobMatches?: CandidateJobMatch[];
  submissions?: CandidateSubmission[];
  interviews?: CandidateInterview[];
  offers?: CandidateOffer[];
  placement?: CandidatePlacement | null;

  // Documents
  documents?: CandidateDocument[];

  // Consent & Privacy
  consent?: {
    contactConsent: boolean;
    profileSharingConsent: boolean;
    representationConsent: boolean;
    consentDate: string;
    consentSource: string;
    consentStatus: 'Active' | 'Pending';
  };

  // History & Notes
  timeline?: CandidateTimelineItem[];
  notes?: CandidateNote[];
}

export type JobId = 'frontend' | 'backend' | 'devops' | 'uiux' | 'all-jobs';

export interface JobRole {
  id: JobId;
  label: string;
}

export type InboxFolder = 'inbox' | 'assigned' | 'drafts' | 'sent' | 'closed';

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isRecruiter?: boolean;
}

export interface Conversation {
  id: string;
  candidateName: string;
  jobTitle: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  folder: InboxFolder;
  messages: Message[];
}

export type CertificationStatus =
  | 'locked'
  | 'available'
  | 'in_progress'
  | 'assessment_pending'
  | 'completed';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type TaskTiming = 'today' | 'overdue' | 'future';

export interface AssessmentOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface CertificationTask {
  id: string;
  name: string;
  certNumber: number;
  whatMustDo: string;
  completionCriteria: string;
  isAssessment?: boolean;
  status: TaskStatus;
  timing: TaskTiming;
  submission?: string;
  options?: AssessmentOption[];
  feedback?: string;
}

export interface CertificationModule {
  number: number;
  name: string;
  goal: string;
  flow: string;
  status: CertificationStatus;
  practicalScenario: string;
}
