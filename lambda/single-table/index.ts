import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Customer, Order } from "../models";

const dynamodb = new DocumentClient();
const SINGLE_TABLE = process.env.SINGLE_TABLE || "";

async function fetchCustomerWithOrders(customerId: string): Promise<Customer> {
  const result = await dynamodb
    .query({
      TableName: SINGLE_TABLE,
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeNames: {
        "#pk": "pk",
      },
      ExpressionAttributeValues: {
        ":pk": "Customer#".concat(customerId),
      },
    })
    .promise();

  if (!result.Items) {
    throw new Error("Customer not found");
  }

  const customerItem = result.Items.find((item) => item.type === "Customer");
  const orderItems = result.Items.filter((item) => item.type === "Order");

  const customer = convertCustomerItem(customerItem as CustomerDynamoDBItem);
  const orders = orderItems.map((i) =>
    convertOrderItem(i as OrderDynamoDBItem)
  );

  customer.orders = orders;
  return customer;
}

interface DynamoDBItem {
  pk: string;
  sk: string;
  type: string;
}

interface CustomerDynamoDBItem extends DynamoDBItem {
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

interface OrderDynamoDBItem extends DynamoDBItem {
  orderId: string;
  customerId: string;
  date: Date;
  total: number;
}

function convertCustomerItem(item: CustomerDynamoDBItem): Customer {
  return {
    customerId: item.pk.substring("Customer#".length),
    name: item.name,
    lastName: item.lastName,
    isPrime: item.isPrime,
    address: item.address,
    orders: [],
  };
}

function convertOrderItem(item: OrderDynamoDBItem): Order {
  return {
    orderId: item.sk.substring("Order#".length),
    customerId: item.pk.substring("Customer#".length),
    date: new Date(item.date),
    total: item.total,
  };
}

export default {
  fetchCustomerWithOrders,
};
