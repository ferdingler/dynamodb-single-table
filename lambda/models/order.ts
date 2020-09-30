interface Order {
  orderId: string;
  customerId: string;
  date: Date;
  total: number;
  items: Array<OrderItem>;
}

interface OrderItem {
  orderId: string;
  itemId: string;
  productName: string;
  quantity: number;
  price: number;
}