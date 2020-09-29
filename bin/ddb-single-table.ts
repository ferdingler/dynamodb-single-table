#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DdbSingleTableStack } from '../lib/ddb-single-table-stack';

const app = new cdk.App();
new DdbSingleTableStack(app, 'DdbSingleTableStack');
