'use strict';

import { commands } from 'vscode';

// Load package components
import { build } from './iscc';
import { createTask} from './task';

const activate = (context) => {
  context.subscriptions.push(
    commands.registerTextEditorCommand('extension.innosetup.compile', async () => {
      return await build();
    })
  );
  context.subscriptions.push(
    commands.registerTextEditorCommand('extension.innosetup.create-build-task', async () => {
      return await createTask();
    })
  );
};

export { activate };
