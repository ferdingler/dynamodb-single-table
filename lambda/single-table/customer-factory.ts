import { Customer } from "../models";
import { CustomerDynamoDBItem } from "./dynamo-models";

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

function toCustomerItem(customer: Customer): CustomerDynamoDBItem {
  return {
    pk: `Customer#${customer.customerId}`,
    sk: `Customer#${customer.customerId}`,
    type: "Customer",
    name: customer.name,
    lastName: customer.lastName,
    address: customer.address,
    isPrime: customer.isPrime,
  };
}

export default {
  convertCustomerItem,
  toCustomerItem,
};
