import { build } from 'esbuild'

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/tiny-feature-flags.umd.js',
  bundle: true,
  format: 'iife',
  globalName: 'TinyFlags',
  target: ['es2017'],
  platform: 'browser',
  sourcemap: false,
  minify: true
})
