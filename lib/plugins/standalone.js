'use strict';

const path = require('path');
const { log, progress, style } = require('../utils/serverless-utils/log');
const standaloneUtils = require('../utils/standalone');
const { remove } = require('../utils/fs/remove');
const cliCommandsSchema = require('../cli/commands-schema');
const logDeprecation = require('../utils/log-deprecation');

const BINARY_PATH = standaloneUtils.path;
const mainProgress = progress.get('main');
const uninstallCommandDeprecationMessage = [
  'The top-level standalone `sls uninstall` command is deprecated and scheduled for removal in osls v4.0.0.',
  'It only removes the legacy standalone binary directory and does not uninstall npm-installed osls.',
  'Use your package manager to uninstall npm-installed osls. This does not affect `serverless plugin uninstall`.',
].join('\n');

module.exports = class Standalone {
  constructor(serverless, cliOptions) {
    this.serverless = serverless;
    this.cliOptions = cliOptions;

    this.commands = {
      uninstall: {
        ...cliCommandsSchema.get('uninstall'),
      },
    };

    this.hooks = {
      'uninstall:uninstall': async () => this.uninstall(),
    };
  }

  async uninstall() {
    logDeprecation('STANDALONE_UNINSTALL_COMMAND_DEPRECATED', uninstallCommandDeprecationMessage);
    mainProgress.notice('Uninstalling standalone binary', { isMainEvent: true });
    await remove(path.dirname(BINARY_PATH));
    log.notice();
    log.notice.success(
      `Standalone binary uninstalled ${style.aside(
        `(${Math.floor((Date.now() - this.serverless.pluginManager.commandRunStartTime) / 1000)}s)`
      )}`
    );
  }
};
