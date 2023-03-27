import * as vscode from 'vscode';
import TelemetryReporter from '@vscode/extension-telemetry';

// the application insights key (also known as instrumentation key)
const key = 'a15c4e5b-976a-40c3-8b1e-8e2636062784';

// telemetry reporter
export let reporter: TelemetryReporter;

export function activate(context: vscode.ExtensionContext) {
   reporter = new TelemetryReporter(key);
   context.subscriptions.push(reporter);
}
