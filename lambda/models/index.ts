export interface Customer {
  customerId: string;
  name: string;
  lastName: string;
  isPrime: boolean;
  orders?: Array<Order>;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
}

export interface Order {
  orderId: string;
  customerId: string;
  date: Date;
  total: number;
}
