import MultiTableApp from "./multi-table";
import SingleTableApp from "./single-table";

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
