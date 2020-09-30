interface Customer {
  customerId: string;
  name: string;
  lastName: string;
  isPrime: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  }
}