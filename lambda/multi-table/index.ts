import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Customer, Order } from "../models";

const dynamodb = new DocumentClient();
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

  customer.orders = queryResult.Items
    ? (queryResult.Items as Array<Order>)
    : [];

  return customer;
}

export default {
  fetchCustomerWithOrders,
};
