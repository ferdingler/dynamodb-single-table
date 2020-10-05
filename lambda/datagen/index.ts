import * as Chance from "chance";
import * as uuid from "uuid";
import { Customer, Order } from "../models";
import SingleTableApp from "../single-table";
import MultiTableApp from "../multi-table";

const chance = new Chance();

async function loadFakeData(numCustomers: number) {
  for (let i = 0; i < numCustomers; i++) {
    const customer = generateRandomCustomer();
    await SingleTableApp.saveCustomer(customer);
    await MultiTableApp.saveCustomer(customer);

    const numOrders = chance.integer({ min: 5, max: 30 });
    for (let j = 0; j < numOrders; j++) {
      const order = generateRandomOrder(customer.customerId);
      await SingleTableApp.saveOrder(order);
      await MultiTableApp.saveOrder(order);
    }
  }
}

function generateRandomCustomer(): Customer {
  const customerId = uuid.v4();
  return {
    customerId: customerId,
    name: chance.first(),
    lastName: chance.last(),
    isPrime: chance.bool(),
    address: {
      street: chance.address(),
      state: chance.state(),
      city: chance.city(),
      country: chance.country(),
    },
  };
}

function generateRandomOrder(customerId: string): Order {
  return {
    orderId: uuid.v4(),
    customerId: customerId,
    total: chance.natural({ min: 10, max: 1500 }),
    date: new Date(chance.date()),
  };
}

export default {
  loadFakeData,
};
