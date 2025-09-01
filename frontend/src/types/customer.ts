export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  phoneNumber: string;
  email?: string;
}

export interface UpdateCustomerRequest {
  name: string;
  phoneNumber: string;
  email?: string;
}
