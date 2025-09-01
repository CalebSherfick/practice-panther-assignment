import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Customer, CreateCustomerRequest } from '../types/customer';
import { customerService } from '../services/customerService';
import type { Matter } from '../types/matter';
import { matterService } from '../services/matterService';
import { getStatusDisplayName, getStatusBadgeColors } from '../utils/matterUtils';
import AddCustomerModal from './AddCustomerModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import AddMatterModal from './AddMatterModal';
import MatterDetailsModal from './MatterDetailsModal';

export default function CustomerDetailsPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Customer state
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(true);
  
  // Matters state
  const [matters, setMatters] = useState<Matter[]>([]);
  const [isLoadingMatters, setIsLoadingMatters] = useState(true);
  
  // Customer modal states
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [deleteCustomerConfirmOpen, setDeleteCustomerConfirmOpen] = useState(false);
  const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);
  
  // Matter modal states
  const [isMatterModalOpen, setIsMatterModalOpen] = useState(false);
  const [editingMatter, setEditingMatter] = useState<Matter | null>(null);
  const [deleteMatterConfirmOpen, setDeleteMatterConfirmOpen] = useState(false);
  const [matterToDelete, setMatterToDelete] = useState<Matter | null>(null);
  const [isDeletingMatter, setIsDeletingMatter] = useState(false);
  
  // Matter details modal state
  const [isMatterDetailsModalOpen, setIsMatterDetailsModalOpen] = useState(false);
  const [selectedMatter, setSelectedMatter] = useState<Matter | null>(null);
  
  const [error, setError] = useState<string | null>(null);

  // Load customer details
  useEffect(() => {
    const loadCustomer = async () => {
      if (!customerId) {
        setError('Customer ID not provided');
        setIsLoadingCustomer(false);
        return;
      }

      try {
        setError(null);
        const customerData = await customerService.getCustomer(customerId);
        setCustomer(customerData);
      } catch (error) {
        console.error('Error loading customer:', error);
        setError('Failed to load customer details');
      } finally {
        setIsLoadingCustomer(false);
      }
    };

    loadCustomer();
  }, [customerId]);

  // Load matters for customer
  useEffect(() => {
    const loadMatters = async () => {
      if (!customerId) return;

      try {
        setError(null);
        const mattersData = await matterService.getMatters(customerId);
        setMatters(mattersData);
      } catch (error) {
        console.error('Error loading matters:', error);
        setError('Failed to load matters');
      } finally {
        setIsLoadingMatters(false);
      }
    };

    if (customerId) {
      loadMatters();
    }
  }, [customerId]);

  // Customer handlers
  const handleEditCustomer = () => {
    setIsCustomerModalOpen(true);
  };

  const handleDeleteCustomer = () => {
    setDeleteCustomerConfirmOpen(true);
  };

  const handleConfirmDeleteCustomer = async () => {
    if (!customer) return;

    setIsDeletingCustomer(true);
    try {
      await customerService.deleteCustomer(customer.id);
      navigate('/customers'); // Navigate back to customers list
    } catch (error) {
      console.error('Error deleting customer:', error);
      setError('Failed to delete customer');
    } finally {
      setIsDeletingCustomer(false);
      setDeleteCustomerConfirmOpen(false);
    }
  };

  const handleUpdateCustomer = async (customerId: string, data: CreateCustomerRequest) => {
    try {
      // Actually update the customer with the new data
      const updatedCustomer = await customerService.updateCustomer(customerId, {
        name: data.name,
        phoneNumber: data.phoneNumber,
        email: data.email
      });
      
      // Update the local state with the updated customer
      setCustomer(updatedCustomer);
      setIsCustomerModalOpen(false);
    } catch (error) {
      console.error('Error updating customer:', error);
      setError('Failed to update customer');
    }
  };

  const handleDummySubmit = async () => {
    // This won't be used since we're editing, but required by the modal since we are reusing it
  };

  // Matter handlers
  const handleAddMatter = () => {
    setEditingMatter(null);
    setIsMatterModalOpen(true);
  };

  const handleEditMatter = (matter: Matter) => {
    setEditingMatter(matter);
    setIsMatterModalOpen(true);
  };

  const handleDeleteMatter = (matter: Matter) => {
    setMatterToDelete(matter);
    setDeleteMatterConfirmOpen(true);
  };

  const handleConfirmDeleteMatter = async () => {
    if (!matterToDelete || !customerId) return;

    setIsDeletingMatter(true);
    try {
      await matterService.deleteMatter(customerId, matterToDelete.id);
      setMatters(matters.filter(m => m.id !== matterToDelete.id));
      setDeleteMatterConfirmOpen(false);
      setMatterToDelete(null);
    } catch (error) {
      console.error('Error deleting matter:', error);
      setError('Failed to delete matter');
    } finally {
      setIsDeletingMatter(false);
    }
  };

  const handleAddMatterSuccess = (newMatter: Matter) => {
    setMatters([...matters, newMatter]);
    setIsMatterModalOpen(false);
  };

  const handleUpdateMatterSuccess = (updatedMatter: Matter) => {
    setMatters(matters.map(m => m.id === updatedMatter.id ? updatedMatter : m));
    setIsMatterModalOpen(false);
    setEditingMatter(null);
  };

  // Matter details modal handlers
  const handleMatterClick = (matter: Matter) => {
    setSelectedMatter(matter);
    setIsMatterDetailsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoadingCustomer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading customer details...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Customer not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0337cc] shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="https://v.fastcdn.co/t/5cdc982a/c9150068/1755513153-60494700-396x57-PracticePanther-Hori.png" 
                alt="Practice Panther"
                className="h-8"
              />
              <h1 className="text-xl font-semibold text-white">
                - {user?.firmName}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">Welcome, {user?.email}</span>
              <button
                onClick={logout}
                className="bg-[#19b475] hover:bg-[#158f5f] text-white font-bold text-sm uppercase py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#19b475] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate('/customers')}
          className="bg-[#19b475] hover:bg-[#159f64] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center mb-4"
          aria-label="Back to customers"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Customers
        </button>
      </div>

      <main className="max-w-7xl mx-auto pb-8 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Customer Information Card */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Customer Information</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleEditCustomer}
                className="bg-transparent border-none outline-none hover:opacity-75 transition-opacity cursor-pointer"
                aria-label="Edit customer"
              >
                <svg className="w-5 h-5" fill="none" stroke="#003bcb" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={handleDeleteCustomer}
                className="bg-transparent border-none outline-none hover:opacity-75 transition-opacity cursor-pointer"
                aria-label="Delete customer"
              >
                <svg className="w-5 h-5" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <div className="px-6 py-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.phoneNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.email || <span className="text-gray-400 italic">No email</span>}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(customer.createdAt)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Matters Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Matters</h2>
            <button
              onClick={handleAddMatter}
              className="bg-[#19b475] hover:bg-[#159f64] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Add Matter
            </button>
          </div>
          <div className="px-6 py-6">
            {isLoadingMatters ? (
              <div className="text-center py-4">
                <div className="text-gray-600">Loading matters...</div>
              </div>
            ) : matters.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No matters found for this customer.</div>
                <button
                  onClick={handleAddMatter}
                  className="mt-4 bg-[#19b475] hover:bg-[#159f64] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Add the first matter
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {matters.map((matter) => (
                      <tr key={matter.id} className="hover:bg-gray-50">
                        <td 
                          className="px-6 py-4 whitespace-nowrap cursor-pointer"
                          onClick={() => handleMatterClick(matter)}
                        >
                          <div className="text-sm font-medium text-gray-900">{matter.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{matter.description}</div>
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap cursor-pointer"
                          onClick={() => handleMatterClick(matter)}
                        >
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColors(matter.status)}`}>
                            {getStatusDisplayName(matter.status)}
                          </span>
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap cursor-pointer"
                          onClick={() => handleMatterClick(matter)}
                        >
                          <div className="text-sm text-gray-900">
                            {matter.assignedEmployee || (
                              <span className="text-gray-400 italic">Unassigned</span>
                            )}
                          </div>
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap cursor-pointer"
                          onClick={() => handleMatterClick(matter)}
                        >
                          <div className="text-sm text-gray-900">{formatDate(matter.createdAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditMatter(matter)}
                              className="bg-transparent border-none outline-none hover:opacity-75 transition-opacity cursor-pointer"
                              aria-label="Edit matter"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="#003bcb" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteMatter(matter)}
                              className="bg-transparent border-none outline-none hover:opacity-75 transition-opacity cursor-pointer"
                              aria-label="Delete matter"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Customer Edit Modal */}
      <AddCustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSubmit={handleDummySubmit}
        editCustomer={customer}
        onUpdate={handleUpdateCustomer}
      />

      {/* Customer Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteCustomerConfirmOpen}
        onClose={() => setDeleteCustomerConfirmOpen(false)}
        onConfirm={handleConfirmDeleteCustomer}
        customerName={customer?.name || ''}
        isLoading={isDeletingCustomer}
      />

      {/* Matter Add/Edit Modal */}
      <AddMatterModal
        isOpen={isMatterModalOpen}
        onClose={() => {
          setIsMatterModalOpen(false);
          setEditingMatter(null);
        }}
        onSubmit={handleAddMatterSuccess}
        onUpdate={handleUpdateMatterSuccess}
        editMatter={editingMatter}
        customerId={customerId!}
      />

      {/* Matter Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteMatterConfirmOpen}
        onClose={() => {
          setDeleteMatterConfirmOpen(false);
          setMatterToDelete(null);
        }}
        onConfirm={handleConfirmDeleteMatter}
        customerName={matterToDelete?.name || ''}
        isLoading={isDeletingMatter}
      />

      {/* Matter Details Modal */}
      <MatterDetailsModal
        isOpen={isMatterDetailsModalOpen}
        onClose={() => {
          setIsMatterDetailsModalOpen(false);
          setSelectedMatter(null);
        }}
        matter={selectedMatter}
      />
    </div>
  );
}
