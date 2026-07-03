import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomeLayout } from './HomeLayout';

describe('HomeLayout', () => {
  it('renderiza children recebidos', () => {
    render(
      <HomeLayout>
        <div>Test Content</div>
      </HomeLayout>,
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
