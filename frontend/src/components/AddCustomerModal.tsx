import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CreateCustomerRequest, Customer } from '../types/customer';

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  phoneNumber: z.string().min(1, 'Phone number is required').max(20, 'Phone number must be less than 20 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

type CustomerForm = z.infer<typeof customerSchema>;

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCustomerRequest) => Promise<void>;
  editCustomer?: Customer | null;
  onUpdate?: (customerId: string, data: CreateCustomerRequest) => Promise<void>;
}

export default function AddCustomerModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editCustomer = null,
  onUpdate 
}: AddCustomerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = editCustomer !== null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
  });

  // Populate form when editing
  useEffect(() => {
    if (editCustomer) {
      setValue('name', editCustomer.name);
      setValue('phoneNumber', editCustomer.phoneNumber);
      setValue('email', editCustomer.email || '');
    } else {
      reset();
    }
  }, [editCustomer, setValue, reset]);

  const handleFormSubmit = async (data: CustomerForm) => {
    setIsLoading(true);
    setError('');

    try {
      // Clean up data - remove empty strings
      const cleanData: CreateCustomerRequest = {
        name: data.name,
        phoneNumber: data.phoneNumber,
        email: data.email || undefined,
      };

      if (isEditing && editCustomer && onUpdate) {
        await onUpdate(editCustomer.id, cleanData);
      } else {
        await onSubmit(cleanData);
      }
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Name*
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="Customer name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003bcb] focus:border-[#003bcb] bg-white text-gray-900 placeholder-gray-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Phone Number*
            </label>
            <input
              {...register('phoneNumber')}
              type="tel"
              placeholder="(555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003bcb] focus:border-[#003bcb] bg-white text-gray-900 placeholder-gray-500"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="customer@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003bcb] focus:border-[#003bcb] bg-white text-gray-900 placeholder-gray-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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
              onClick={handleClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#19b475] hover:bg-[#158f5f] text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#19b475] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Customer' : 'Create Customer')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
