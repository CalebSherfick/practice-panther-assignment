import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Matter, CreateMatterRequest, UpdateMatterRequest, MatterStatusType } from '../types/matter';
import { MatterStatus } from '../types/matter';
import { matterService } from '../services/matterService';
import { getAllMatterStatuses } from '../utils/matterUtils';

const matterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  status: z.number().min(1, 'Status is required'),
  assignedEmployee: z.string().max(255, 'Assigned employee must be less than 255 characters').optional()
});

type MatterFormData = z.infer<typeof matterSchema>;

interface AddMatterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (matter: Matter) => void;
  onUpdate?: (matter: Matter) => void;
  editMatter?: Matter | null;
  customerId: string;
}

export default function AddMatterModal({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  editMatter,
  customerId
}: AddMatterModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEditing = !!editMatter;
  const statusOptions = getAllMatterStatuses();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm<MatterFormData>({
    resolver: zodResolver(matterSchema),
    defaultValues: {
      name: '',
      description: '',
      status: MatterStatus.Intake,
      assignedEmployee: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (editMatter) {
        setValue('name', editMatter.name);
        setValue('description', editMatter.description);
        setValue('status', editMatter.status);
        setValue('assignedEmployee', editMatter.assignedEmployee || '');
      } else {
        reset({
          name: '',
          description: '',
          status: MatterStatus.Intake,
          assignedEmployee: ''
        });
      }
      setError(null);
    }
  }, [isOpen, editMatter, setValue, reset]);

  const onSubmitForm = async (data: MatterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isEditing && editMatter) {
        const updateData: UpdateMatterRequest = {
          name: data.name,
          description: data.description,
          status: data.status as MatterStatusType,
          assignedEmployee: data.assignedEmployee || undefined
        };
        const updatedMatter = await matterService.updateMatter(customerId, editMatter.id, updateData);
        onUpdate?.(updatedMatter);
      } else {
        const createData: CreateMatterRequest = {
          name: data.name,
          description: data.description,
          status: data.status as MatterStatusType,
          assignedEmployee: data.assignedEmployee || undefined
        };
        const newMatter = await matterService.createMatter(customerId, createData);
        onSubmit(newMatter);
      }
    } catch (error) {
      console.error('Error saving matter:', error);
      setError(error instanceof Error ? error.message : 'Failed to save matter');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Matter' : 'Add New Matter'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Matter Name*
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="Enter matter name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003bcb] focus:border-[#003bcb] bg-white text-gray-900 placeholder-gray-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Description*
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Enter matter description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003bcb] focus:border-[#003bcb] bg-white text-gray-900 placeholder-gray-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Status*
            </label>
            <select
              {...register('status', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003bcb] focus:border-[#003bcb] bg-white text-gray-900"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Assigned Employee
            </label>
            <input
              {...register('assignedEmployee')}
              type="text"
              placeholder="Enter assigned employee name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003bcb] focus:border-[#003bcb] bg-white text-gray-900 placeholder-gray-500"
            />
            {errors.assignedEmployee && (
              <p className="mt-1 text-sm text-red-600">{errors.assignedEmployee.message}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#19b475] hover:bg-[#158f5f] text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#19b475] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading 
                ? 'Saving...' 
                : (isEditing ? 'Update Matter' : 'Add Matter')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
