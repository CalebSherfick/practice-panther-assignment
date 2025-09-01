import type { Matter } from '../types/matter';
import { getStatusDisplayName, getStatusBadgeColors } from '../utils/matterUtils';

interface MatterDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  matter: Matter | null;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function MatterDetailsModal({ 
  isOpen, 
  onClose, 
  matter
}: MatterDetailsModalProps) {
  if (!isOpen || !matter) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Matter Details
          </h3>
          <button
            type="button"
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#003bcb] focus:ring-offset-2"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-2">
          <div className="space-y-4">
            {/* Matter Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matter Name
              </label>
              <p className="text-sm text-gray-900 font-medium">{matter.name}</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <p className="text-sm text-gray-900">{matter.description || 'No description provided'}</p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColors(matter.status)}`}>
                {getStatusDisplayName(matter.status)}
              </span>
            </div>

            {/* Assigned Employee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Employee
              </label>
              <p className="text-sm text-gray-900">
                {matter.assignedEmployee || (
                  <span className="text-gray-400 italic">Unassigned</span>
                )}
              </p>
            </div>

            {/* Created Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created
              </label>
              <p className="text-sm text-gray-900">{formatDate(matter.createdAt)}</p>
            </div>

            {/* Updated Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Updated
              </label>
              <p className="text-sm text-gray-900">{formatDate(matter.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#003bcb] focus:ring-offset-2 sm:text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
