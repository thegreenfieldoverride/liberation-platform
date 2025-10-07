import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/vanilla/index.ts',
  output: {
    file: 'dist/vanilla/runway-calculator.min.js',
    format: 'iife',
    name: 'GreenfieldRunwayCalculator',
    sourcemap: true
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false
    }),
    terser()
  ]
};