import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";

interface Props extends cdk.StackProps {
  customersTable: dynamodb.Table;
  ordersTable: dynamodb.Table;
  singleTable: dynamodb.Table;
}

export class DatagenApp extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    const appLambda = new lambda.Function(this, "DatagenLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("./lambda"),
      handler: "index.datagenHandler",
      memorySize: 512,
      timeout: cdk.Duration.seconds(100),
      tracing: lambda.Tracing.ACTIVE,
      environment: {
        SINGLE_TABLE: props.singleTable.tableName,
        CUSTOMERS_TABLE: props.customersTable.tableName,
        ORDERS_TABLE: props.ordersTable.tableName,
      },
    });

    appLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: [
          // Grant permissions to table itself
          props.singleTable.tableArn,
          props.customersTable.tableArn,
          props.ordersTable.tableArn,
          // Grant permissions to GSI indexes
          props.singleTable.tableArn.concat("/index/*"),
          props.customersTable.tableArn.concat("/index/*"),
          props.ordersTable.tableArn.concat("/index/*"),
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
      })
    );
  }
}
