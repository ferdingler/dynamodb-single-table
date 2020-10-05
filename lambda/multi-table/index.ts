import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Customer, Order } from "../models";

const dynamodb = new DocumentClient();
AWSXRay.setContextMissingStrategy(() => {});
AWSXRay.captureAWSClient((dynamodb as any).service);

const CUSTOMERS_TABLE = process.env.CUSTOMERS_TABLE || "";
const ORDERS_TABLE = process.env.ORDERS_TABLE || "";

async function fetchCustomerWithOrders(customerId: string): Promise<Customer> {
  // Fetch customer entry
  const getResult = await dynamodb
    .get({
      TableName: CUSTOMERS_TABLE,
      Key: {
        customerId: customerId,
      },
    })
    .promise();

  if (!getResult.Item) {
    throw new Error("Customer not found");
  }

  const customer = getResult.Item as Customer;

  // Fetch orders for customer
  const queryResult = await dynamodb
    .query({
      TableName: ORDERS_TABLE,
      KeyConditionExpression: "#customerId = :customerId",
      ExpressionAttributeNames: {
        "#customerId": "customerId",
      },
      ExpressionAttributeValues: {
        ":customerId": customerId,
      },
    })
    .promise();

  customer.orders = queryResult.Items as Array<Order>;
  return customer;
}

async function saveCustomer(customer: Customer) {
  return dynamodb
    .put({
      TableName: CUSTOMERS_TABLE,
      Item: {
        customerId: customer.customerId,
        name: customer.name,
        lastName: customer.lastName,
        isPrime: customer.isPrime,
        address: customer.address,
      },
    })
    .promise();
}

async function saveOrder(order: Order) {
  return dynamodb
    .put({
      TableName: ORDERS_TABLE,
      Item: {
        customerId: order.customerId,
        orderId: order.orderId,
        date: order.date.toISOString(),
        total: order.total,
      },
    })
    .promise();
}

export default {
  fetchCustomerWithOrders,
  saveCustomer,
  saveOrder,
};
