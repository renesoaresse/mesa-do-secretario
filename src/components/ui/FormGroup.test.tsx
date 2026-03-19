import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormGroup } from './FormGroup';

describe('FormGroup', () => {
  it('renderiza label e children', () => {
    render(
      <FormGroup label="Campo">
        <input aria-label="conteudo" />
      </FormGroup>,
    );

    expect(screen.getByText('Campo')).toBeInTheDocument();
    expect(screen.getByLabelText('conteudo')).toBeInTheDocument();
  });
});
