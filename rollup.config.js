import path from 'path';
import ts from 'rollup-plugin-typescript2';

const packagesDir = path.resolve(__dirname, 'packages');
const targetPackage = path.resolve(packagesDir, process.env.TARGET);

const resolve = (p) => path.resolve(targetPackage, p);

export default {
  input: [resolve('src/index.ts')],
  output: [
    {
      file: resolve('dist/index.js'),
      format: 'es',
    },
  ],
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
