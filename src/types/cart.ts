export interface CartItem {
  /** `${productId}:${presentationId}` */
  id: string;
  productId: string;
  productName: string;
  presentationId: string;
  presentationLabel: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface Customer {
  name: string;
  phone: string;
  email?: string;
}

export interface DeliveryInfo {
  city: string;
  address: string;
  neighborhood: string;
  notes?: string;
}

export interface OrderPayload {
  items: CartItem[];
  subtotal: number;
  customer: Customer;
  delivery: DeliveryInfo;
}
