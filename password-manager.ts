
// Custom types for the password manager application

export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  notes?: string;
  category?: string;
  favorite?: boolean;
  lastUpdated?: string;
}

export interface SecurityQuestion {
  question: string;
  answer: string;
}

export interface UserVault {
  userId: string;
  entries: PasswordEntry[];
}

export interface ResetPinRequest {
  question1: string;
  answer1: string;
  question2: string;
  answer2: string;
  newPin: string;
}
