
export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface Listing {
  id: string;
  title: string; // Changed from name
  description: string;
  location: string;
  price: string; // Changed from rent
  priceType: 'sale' | 'rental'; // NEW: Distinguish sale vs rental
  agentName?: string; // Optional, will be populated from createdBy
  agentContact?: string; // Optional
  imageUrls: string[];
  tags?: string[];
  createdBy?: any; // To hold user object from backend
  isPromoted?: boolean;
  investment?: {
    roi: number;
    capRate: number;
    score: number;
    badge?: string;
  };
}

export interface MessageMetadata {
  dealClosure?: boolean;
  dealType?: 'purchase' | 'rental' | 'viewing';
  confidence?: number;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  properties?: Listing[];
  senderName?: string; // To specify if the sender is a specific agent
  isSystemMessage?: boolean; // For messages like "Agent has joined"
  groundingMetadata?: any; // For Google Search/Maps grounding results
  metadata?: MessageMetadata; // For deal closure detection
}

// New type for storing conversations
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

// New types for Signup Process
// User-selectable roles (for signup) - Tenant accounts are created by Landlords/Agents
// These values match the backend User model role enum
export enum UserRole {
  Agent = 'Agent',
  Landlord = 'Landlord',
  PropertySeller = 'Property Seller', // Backend expects 'Property Seller'
}

// Role type that matches backend database values
export type UserRoleType = 'tenant' | 'agent' | 'seller' | 'landlord' | 'Agent' | 'Landlord' | 'Property Seller' | 'Property Owner' | 'Tenant';

export interface User {
  id: string;
  _id?: string; // MongoDB ID
  name: string;
  email: string;
  phone?: string;
  role: UserRoleType; // Updated to use UserRoleType
  whatsappNumber?: string;
  notificationPreferences?: {
    email?: boolean;
    whatsapp?: boolean;
    push?: boolean;
  };
  subscription?: {
    plan?: PlanName;
    status?: 'active' | 'inactive' | 'pending';
  };
  tenantManagementActive?: boolean;
}

// For users signing in with Google to search
export interface ChatUser {
  name: string;
  email: string;
  googleId: string;
}

export enum PlanName {
  Basic = 'Basic',
  MyGF1_3 = 'MyGF 1.3',
  MyGF3_2 = 'MyGF 3.2',
}

export interface SubscriptionPlan {
  name: PlanName;
  price: string;
  features: string[];
}

// New type for Tenant Management
export interface Tenant {
  id: string;
  name: string;
  unit: string; // e.g., "Apt 3B, Modern 2-Bedroom"
  email: string;
  phone: string;
  whatsappNumber?: string;
  rentAmount: number;
  rentStatus: 'Paid' | 'Due' | 'Overdue';
  leaseStart?: string;
  leaseEnd?: string;
  deposit?: number;
  paymentDay?: number; // Day of the month rent is due
  userId?: string; // Link to the user account
}

// New type for Maintenance Requests
export interface MaintenanceRequest {
  id: string;
  tenantId: string;
  tenantName: string;
  unit: string;
  description: string;
  category?: 'Plumbing' | 'Electrical' | 'Appliance' | 'General' | 'Other';
  priority?: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'Submitted' | 'In Progress' | 'Resolved';
  submittedDate: string;
  technicianId?: string;
  images?: string[];
  aiAnalysis?: {
    summary: string;
    suggestedAction: string;
    estimatedCost?: string;
  };
}

export interface Technician {
  id: string;
  name: string;
  specialty: 'Plumbing' | 'Electrical' | 'General' | 'HVAC';
  phone: string;
  rating: number;
  availability: 'Available' | 'Busy';
}

export interface FinancialStatement {
  id: string;
  month: string; // "November 2023"
  totalRentCollected: number;
  totalExpenses: number;
  netIncome: number;
  generatedDate: string;
  status: 'Draft' | 'Sent';
}

export interface AutomationRule {
  id: string;
  type: 'RentReminder' | 'MaintenanceUpdate' | 'LeaseRenewal';
  enabled: boolean;
  daysBefore?: number; // For reminders
  messageTemplate: string;
}

// New type for Lead Management
export interface Lead {
  id: string;
  property: Listing | string; // Can be populated or just ID
  client: {
    name: string;
    address: string;
    contact: string;
    email: string;
    whatsappNumber: string;
  };
  dealType: 'purchase' | 'rental' | 'viewing';
  status: 'new' | 'contacted' | 'in-progress' | 'closed' | 'lost';
  conversationHistory: Message[];
  createdBy: string; // User ID
  notes?: string;
  createdAt: string;
  closedAt?: string;
}