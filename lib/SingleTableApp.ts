import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as apigateway from "@aws-cdk/aws-apigatewayv2";

export class SingleTableApp extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const singleTable = new dynamodb.Table(this, "SingleTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "pk",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: dynamodb.AttributeType.STRING,
      },
    });

    const appLambda = new lambda.Function(this, "SingleAppLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("./lambda"),
      handler: "index.singleTableHandler",
      memorySize: 512,
      tracing: lambda.Tracing.ACTIVE,
      environment: {
        SINGLE_TABLE: singleTable.tableName,
      },
    });

    appLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: [
          // Grant permissions to table itself
          singleTable.tableArn,
          // Grant permissions to GSI indexes
          singleTable.tableArn.concat("/index/*"),
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

    const api = new apigateway.HttpApi(this, "SingleTableApi");
    const lambdaIntegration = new apigateway.LambdaProxyIntegration({
      handler: appLambda,
    });

    api.addRoutes({
      path: "/customer/{id}",
      integration: lambdaIntegration,
      methods: [apigateway.HttpMethod.GET],
    });
  }
}
