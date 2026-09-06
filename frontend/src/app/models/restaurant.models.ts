export interface Branch {
  id: string;
  name: string;
  slug: string;
  phones: string[];
  whatsapp: string;
  address: string;
  landmark: string;
  timing: string;
  isOpen: boolean;
  isHeadquarter?: boolean;
  tablesCount: number;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
}

export interface BranchPriceOverride {
  price: number;
  available: boolean;
  image?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultPrice: number;
  unit: string;
  isVeg: boolean;
  isPopular: boolean;
  rating: number;
  reviewsCount: number;
  image: string;
  branchPricing?: { [branchId: string]: BranchPriceOverride };
  // Resolved per branch when viewing
  currentPrice?: number;
  isAvailable?: boolean;
  hasBranchPrice?: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  unitPrice: number;
}

export interface Reservation {
  id?: string;
  branchId: string;
  branchName?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  timeSlot: string;
  guests: number;
  seatingPreference?: string;
  specialRequests?: string;
  status?: string;
  createdAt?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: string;
}
