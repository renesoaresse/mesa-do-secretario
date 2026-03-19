import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormRow } from './FormRow';

describe('FormRow', () => {
  it('renderiza os filhos recebidos', () => {
    render(
      <FormRow>
        <span>Primeiro</span>
        <span>Segundo</span>
      </FormRow>,
    );

    expect(screen.getByText('Primeiro')).toBeInTheDocument();
    expect(screen.getByText('Segundo')).toBeInTheDocument();
  });
});
