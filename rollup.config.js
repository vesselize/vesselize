import path from 'path';
import ts from 'rollup-plugin-typescript2';

const packagesDir = path.resolve(__dirname, 'packages');
const targetPackage = path.resolve(packagesDir, process.env.TARGET);

const resolve = (p) => path.resolve(targetPackage, p);

const pkg = require(resolve('package.json'));

const external = [...Reflect.ownKeys(pkg.dependencies)];

export default {
  input: [resolve('src/index.ts')],
  output: [
    {
      file: resolve('dist/index.js'),
      format: 'es',
    },
  ],
  external,
  plugins: [
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationMap: true,
        },
      },
    }),
  ],
};
