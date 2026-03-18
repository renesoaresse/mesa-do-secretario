import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('renderiza header, children e footer', () => {
    render(
      <Sidebar header={<div>Header</div>} footer={<div>Footer</div>}>
        <div>Conteudo</div>
      </Sidebar>,
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Conteudo')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
