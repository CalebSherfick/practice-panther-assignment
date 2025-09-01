import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Customer, CreateCustomerRequest } from '../types/customer';
import { customerService } from '../services/customerService';
import AddCustomerModal from './AddCustomerModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function CustomersPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleAddCustomer = async (customerData: CreateCustomerRequest) => {
    const newCustomer = await customerService.createCustomer(customerData);
    setCustomers(prev => [...prev, newCustomer]);
  };

  const handleUpdateCustomer = async (customerId: string, customerData: CreateCustomerRequest) => {
    const updatedCustomer = await customerService.updateCustomer(customerId, customerData);
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId ? updatedCustomer : customer
    ));
  };

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    
    try {
      setIsDeleting(true);
      await customerService.deleteCustomer(customerToDelete.id);
      setCustomers(prev => prev.filter(customer => customer.id !== customerToDelete.id));
      setDeleteConfirmOpen(false);
      setCustomerToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setCustomerToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header with Add Button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
              <p className="text-gray-600">Manage your firm's clients</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#19b475] hover:bg-[#158f5f] text-white font-bold text-sm uppercase py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#19b475] transition-colors"
            >
              Add Customer
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={loadCustomers}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          ) : (
            /* Customers Table */
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {customers.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-gray-400 text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No customers yet</h3>
                  <p className="text-gray-600 mb-4">Get started by adding your first customer.</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#19b475] hover:bg-[#158f5f] text-white font-bold py-2 px-4 rounded-full transition-colors"
                  >
                    Add Your First Customer
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
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
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
                      {customers.map((customer) => (
                        <tr 
                          key={customer.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => navigate(`/customers/${customer.id}`)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{customer.phoneNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {customer.email || (
                                <span className="text-gray-400 italic">No email</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(customer.createdAt)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditClick(customer)}
                                className="bg-transparent border-none outline-none hover:opacity-75 transition-opacity cursor-pointer"
                                aria-label="Edit customer"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="#003bcb" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(customer)}
                                className="bg-transparent border-none outline-none hover:opacity-75 transition-opacity cursor-pointer"
                                aria-label="Delete customer"
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
          )}
        </div>
      </main>

      {/* Add/Edit Customer Modal */}
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddCustomer}
        editCustomer={editingCustomer}
        onUpdate={handleUpdateCustomer}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        customerName={customerToDelete?.name || ''}
        isLoading={isDeleting}
      />
    </div>
  );
}
