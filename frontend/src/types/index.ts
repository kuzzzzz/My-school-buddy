export interface AuthResponse {
  token: string;
}

export interface Profile {
  name: string;
  department: string;
  strengths: string[];
  weakSubjects: string[];
  skills: string[];
  interests: string[];
  availability: { day: string; startHour: number; endHour: number }[];
}

export interface Match {
  studentId: string;
  score: number;
  breakdown: {
    skillComplement: number;
    scheduleOverlap: number;
    sharedInterests: number;
    graphProximity: number;
  };
}
