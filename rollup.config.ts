import { defineConfig } from 'rollup';
import ts from 'rollup-plugin-ts';
import terser from '@rollup/plugin-terser';

export default defineConfig({
  plugins: [
    ts({
      include: 'src/**/*.ts',
      exclude: ['__tests__'],
      transpiler: 'swc',
    }),
    terser(),
  ],
  input: './src/index.ts',
  output: [{ file: './dist/index.js', format: 'es' }],
});
