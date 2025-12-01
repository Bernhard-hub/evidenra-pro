import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'build', 'release', '.backup-archive'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/__tests__',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@services': path.resolve(__dirname, './src/services'),
      '@components': path.resolve(__dirname, './src/components'),
      '@renderer': path.resolve(__dirname, './src/renderer'),
    },
  },
});
