import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Customer, Order } from "../models";
import { CustomerDynamoDBItem, OrderDynamoDBItem } from "./dynamo-models";
import CustomerFactory from "./customer-factory";
import OrderFactory from "./order-factory";

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

  if (!result.Items || result.Items.length <= 0) {
    throw new Error("Customer not found");
  }

  const customerItem = result.Items.find((item) => item.type === "Customer");
  const orderItems = result.Items.filter((item) => item.type === "Order");

  const customer = CustomerFactory.convertCustomerItem(
    customerItem as CustomerDynamoDBItem
  );

  const orders = orderItems.map((i) =>
    OrderFactory.convertOrderItem(i as OrderDynamoDBItem)
  );

  customer.orders = orders;
  return customer;
}

async function saveCustomer(customer: Customer) {
  const item = CustomerFactory.toCustomerItem(customer);
  return dynamodb
    .put({
      TableName: SINGLE_TABLE,
      Item: item,
    })
    .promise();
}

async function saveOrder(order: Order) {
  const item = OrderFactory.toOrderItem(order);
  return dynamodb
    .put({
      TableName: SINGLE_TABLE,
      Item: item,
    })
    .promise();
}

export default {
  fetchCustomerWithOrders,
  saveCustomer,
  saveOrder,
};
