import MultiTableApp from "./multi-table";
import SingleTableApp from "./single-table";

export const singleTableHandler = async (event: any) => {
  console.log("Event = ", JSON.stringify(event));
  return SingleTableApp.fetchCustomerWithOrders("123");
};

export const multiTableHandler = async (event: any) => {
  console.log("Event = ", JSON.stringify(event));
  return MultiTableApp.fetchCustomerWithOrders("123");
};
