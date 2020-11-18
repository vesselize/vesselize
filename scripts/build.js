const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor');
const { getAllTargets } = require('./util');

run();

async function run() {
  await buildAll();
}

async function buildAll() {
  const allTargets = getAllTargets();

  for (const target of allTargets) {
    await build(target);
  }
}

async function build(target) {
  const pkgDir = path.resolve(`packages/${target}`);

  console.log();
  console.log();

  await fs.remove(path.resolve(pkgDir, 'dist'));

  console.log(
    chalk.green(`Clean package ${chalk.cyan(chalk.bold(target))} done`)
  );

  await execa(
    'rollup',
    ['-c', '--environment', `NODE_ENV:production,TARGET:${target}`],
    { stdio: 'inherit' }
  );

  console.log(
    chalk.green(`Build package ${chalk.cyan(chalk.bold(target))} successfully`)
  );

  await extractAPI(target);
}

async function extractAPI(target) {
  const pkgDir = path.resolve(`packages/${target}`);
  const configPath = path.resolve(pkgDir, 'api-extractor.json');
  const extractorConfig = ExtractorConfig.loadFileAndPrepare(configPath);

  const extractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true,
  });

  if (extractorResult.succeeded) {
    console.log(chalk.green(`API Extractor completed successfully`));
    process.exitCode = 0;
  } else {
    console.error(
      `API Extractor completed with ${extractorResult.errorCount} errors` +
        ` and ${extractorResult.warningCount} warnings`
    );
    process.exitCode = 1;
  }

  await fs.remove(`${pkgDir}/dist/packages`);
}
