import MultiTableApp from "./multi-table";
import SingleTableApp from "./single-table";
import RandomDataGenerator from "./datagen";

export const singleTableHandler = async (event: any) => {
  console.log("Event = ", JSON.stringify(event));
  const customerId = event.pathParameters.id;
  return SingleTableApp.fetchCustomerWithOrders(customerId);
};

export const multiTableHandler = async (event: any) => {
  console.log("Event = ", JSON.stringify(event));
  const customerId = event.pathParameters.id;
  return MultiTableApp.fetchCustomerWithOrders(customerId);
};

export const datagenHandler = async () => {
  const numberCustomers = 60;
  return RandomDataGenerator.loadFakeData(numberCustomers);
};
