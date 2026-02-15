export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  strengths: string[];
  weakSubjects: string[];
  skills: string[];
  interests: string[];
  availability: TimeBlock[];
}

export interface TimeBlock {
  day: string;
  startHour: number;
  endHour: number;
}

export interface MatchScore {
  studentId: string;
  score: number;
  breakdown: {
    skillComplement: number;
    scheduleOverlap: number;
    sharedInterests: number;
    graphProximity: number;
  };
}

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  requiredSkills: string[];
  maxMembers: number;
}
