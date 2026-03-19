import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig({ command: 'serve', mode: 'test' }),
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/electron/**',
          'src/main.tsx',
          'src/vite-env.d.ts',
          'src/test/**',
          'src/**/*.test.{ts,tsx}',
          'src/features/**/index.ts',
          'src/features/**/types.ts',
          'src/types/ata.ts',
          'src/app/providers.tsx',
          'src/features/loja-config/components/LojaConfigForm.tsx',
        ],
      },
    },
  }),
);
