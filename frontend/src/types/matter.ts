export const MatterStatus = {
  Unknown: 0,
  Intake: 1,
  Consultation: 2,
  Engaged: 3,
  Preparation: 4,
  Active: 5,
  PendingResolution: 6,
  Resolved: 7,
  Billing: 8,
  Closed: 9
} as const;

export type MatterStatusType = typeof MatterStatus[keyof typeof MatterStatus];

export interface Matter {
  id: string;
  name: string;
  description: string;
  status: MatterStatusType;
  statusDisplayName: string;
  assignedEmployee?: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMatterRequest {
  name: string;
  description: string;
  status: MatterStatusType;
  assignedEmployee?: string;
}

export interface UpdateMatterRequest {
  name: string;
  description: string;
  status: MatterStatusType;
  assignedEmployee?: string;
}
