interface DynamoDBItem {
  pk: string;
  sk: string;
  type: string;
}

export interface CustomerDynamoDBItem extends DynamoDBItem {
  name: string;
  lastName: string;
  isPrime: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
}

export interface OrderDynamoDBItem extends DynamoDBItem {
  date: string;
  total: number;
}
