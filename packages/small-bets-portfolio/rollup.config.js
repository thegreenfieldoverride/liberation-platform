import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const external = [
  'react', 
  'react-dom', 
  'react/jsx-runtime',
  '@thegreenfieldoverride/types',
  '@thegreenfieldoverride/user-context'
];

export default [
  // Main bundle
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true
    },
    external,
    plugins: [
      resolve({
        preferBuiltins: true,
        skip: ['@thegreenfieldoverride/types', '@thegreenfieldoverride/user-context']
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        useTsconfigDeclarationDir: true
      })
    ]
  },
  // Core bundle (no React)
  {
    input: 'src/core/index.ts',
    output: {
      file: 'dist/core/index.js',
      format: 'es',
      sourcemap: true
    },
    external,
    plugins: [
      resolve({
        preferBuiltins: true,
        skip: ['@thegreenfieldoverride/types', '@thegreenfieldoverride/user-context']
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      })
    ]
  },
  // React components bundle
  {
    input: 'src/react/index.ts',
    output: {
      file: 'dist/react/index.js',
      format: 'es',
      sourcemap: true
    },
    external,
    plugins: [
      resolve({
        preferBuiltins: true,
        skip: ['@thegreenfieldoverride/types', '@thegreenfieldoverride/user-context']
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      })
    ]
  }
];