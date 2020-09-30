#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SingleTableApp } from '../lib/SingleTableApp';
import { MultiTableApp } from '../lib/MultiTableApp';

const app = new cdk.App();
new SingleTableApp(app, 'SingleTableApp');
new MultiTableApp(app, 'MultiTableApp');
