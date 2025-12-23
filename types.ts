
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  category: string;
  image: string;
  features: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  timestamp: number;
  qrCodeValue: string;
  status: 'pending' | 'collected';
}

export enum View {
  HOME = 'home',
  CATALOG = 'catalog',
  CART = 'cart',
  ORDER_HISTORY = 'order_history',
  MACHINE_SIMULATOR = 'machine_simulator'
}
