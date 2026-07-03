import { useState } from 'react';
import { useLocation } from 'wouter';
import { HomeLayout } from '../../../components/layout/HomeLayout';
import { FormGroup } from '../../../components/ui/FormGroup';
import { TextInput } from '../../../components/ui/TextInput';
import { Button } from '../../../components/ui/Button';
import { StatusMessage } from '../../../components/ui/StatusMessage';
import { ROUTES } from '../../../router/index';
import { useLojas } from '../hooks/useLojas';
import type { StatusState } from '../../../types/ata';

export function LojaFormScreen() {
  const [, navigate] = useLocation();
  const { addLoja } = useLojas();

  const [nome, setNome] = useState('');
  const [oriente, setOriente] = useState('');
  const [potencia, setPotencia] = useState('');
  const [status, setStatus] = useState<StatusState>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nome.trim()) {
      setStatus({ kind: 'error', text: 'Informe o nome da loja.' });
      return;
    }

    addLoja({ nome: nome.trim(), oriente: oriente.trim(), potencia: potencia.trim() });
    navigate(ROUTES.LOJAS);
  }

  return (
    <HomeLayout>
      <div className="home-content">
        <div className="home-launcher">
          <h2 className="home-launcher__title">Cadastrar Loja</h2>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
            <FormGroup label="Nome da Loja">
              <TextInput
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Loja Maçônica Luzes do Cruzeiro"
              />
            </FormGroup>

            <FormGroup label="Oriente">
              <TextInput
                value={oriente}
                onChange={(e) => setOriente(e.target.value)}
                placeholder="Ex: Aracaju/SE"
              />
            </FormGroup>

            <FormGroup label="Potência">
              <TextInput
                value={potencia}
                onChange={(e) => setPotencia(e.target.value)}
                placeholder="Ex: Grande Oriente de Sergipe"
              />
            </FormGroup>

            <StatusMessage status={status} />

            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="submit" variant="primary">
                Salvar
              </Button>
              <Button type="button" onClick={() => navigate(ROUTES.LOJAS)}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </HomeLayout>
  );
}
