import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';

export class MultiTableApp extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const customersTable = new dynamodb.Table(this, "Customers", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "customerId",
        type: dynamodb.AttributeType.STRING,
      },
    });

    const ordersTable = new dynamodb.Table(this, "Orders", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "customerId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "orderId",
        type: dynamodb.AttributeType.STRING,
      },
    });

    const appLambda = new lambda.Function(this, "SingleAppLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("./lambda"),
      handler: "index.multiTableHandler",
      memorySize: 512,
      tracing: lambda.Tracing.ACTIVE,
      environment: {
        CUSTOMERS_TABLE: customersTable.tableName,
        ORDERS_TABLE: ordersTable.tableName,
      }
    });

    appLambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
        resources: [
          // Grant permissions to table itself
          customersTable.tableArn,
          ordersTable.tableArn,
          // Grant permissions to GSI indexes
          customersTable.tableArn.concat("/index/*"),
          ordersTable.tableArn.concat("/index/*"),
        ],
        actions: [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:DeleteItem",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:ConditionCheckItem",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:UpdateItem",
        ],
    }));

    
  }
}
