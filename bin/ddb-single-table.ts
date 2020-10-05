#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { SingleTableApp } from "../lib/SingleTableApp";
import { MultiTableApp } from "../lib/MultiTableApp";
import { DatagenApp } from "../lib/DatagenApp";

const app = new cdk.App();
const single = new SingleTableApp(app, "SingleTableApp");
const multi = new MultiTableApp(app, "MultiTableApp");
new DatagenApp(app, "DatagenApp", {
  customersTable: multi.customersTable,
  ordersTable: multi.ordersTable,
  singleTable: single.singleTable,
});
