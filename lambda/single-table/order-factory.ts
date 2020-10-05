import { Order } from "../models";
import { OrderDynamoDBItem } from "./dynamo-models";

function convertOrderItem(item: OrderDynamoDBItem): Order {
  return {
    orderId: item.sk.substring("Order#".length),
    customerId: item.pk.substring("Customer#".length),
    date: new Date(item.date),
    total: item.total,
  };
}

function toOrderItem(order: Order): OrderDynamoDBItem {
  return {
    pk: `Customer#${order.customerId}`,
    sk: `Order#${order.orderId}`,
    type: "Order",
    total: order.total,
    date: order.date.toISOString(),
  };
}

export default {
  convertOrderItem,
  toOrderItem,
};
