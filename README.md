# Single-Table DynamoDB Pattern

This is a quick-and-dirty example of an implementation of the Single-Table pattern in comparisson to a Multi-Table approach. This project is an AWS CDK application that deploys 2 separate CloudFormation stacks: `SingleTableApp` and `MultiTableApp`. Each composed of a Lambda function, an HTTP API and their corresponding DynamoDB tables.
