import { MatterStatus } from '../types/matter';
import type { MatterStatusType } from '../types/matter';

export const getStatusBadgeColors = (status: number) => {
  switch (status) {
    case MatterStatus.Intake:
      return 'bg-blue-100 text-blue-800';
    case MatterStatus.Consultation:
      return 'bg-purple-100 text-purple-800';
    case MatterStatus.Engaged:
      return 'bg-indigo-100 text-indigo-800';
    case MatterStatus.Preparation:
      return 'bg-yellow-100 text-yellow-800';
    case MatterStatus.Active:
      return 'bg-orange-100 text-orange-800';
    case MatterStatus.PendingResolution:
      return 'bg-pink-100 text-pink-800';
    case MatterStatus.Resolved:
      return 'bg-teal-100 text-teal-800';
    case MatterStatus.Billing:
      return 'bg-cyan-100 text-cyan-800';
    case MatterStatus.Closed:
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to get status display name
export const getStatusDisplayName = (status: MatterStatusType): string => {
  switch (status) {
    case MatterStatus.Unknown:
      return 'Unknown';
    case MatterStatus.Intake:
      return 'Intake';
    case MatterStatus.Consultation:
      return 'Consultation';
    case MatterStatus.Engaged:
      return 'Engaged';
    case MatterStatus.Preparation:
      return 'Preparation';
    case MatterStatus.Active:
      return 'Active';
    case MatterStatus.PendingResolution:
      return 'Pending Resolution';
    case MatterStatus.Resolved:
      return 'Resolved';
    case MatterStatus.Billing:
      return 'Billing';
    case MatterStatus.Closed:
      return 'Closed';
    default:
      return 'Unknown';
  }
};

// Helper function to get all status options for dropdowns
export const getAllMatterStatuses = () => {
  return Object.values(MatterStatus)
    .filter(value => typeof value === 'number' && value !== MatterStatus.Unknown)
    .map(status => ({
      value: status as MatterStatusType,
      label: getStatusDisplayName(status as MatterStatusType)
    }));
};
