export interface Damage {
  type: string;
  part: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  estimatedCost: number;
}

export interface Inspection {
  id: string;
  date: string;
  imageUrl: string;
  summary: string;
  damages: Damage[];
  overallState: string;
  originalityStatus: 'Original' | 'Altered' | 'Unknown';
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}
