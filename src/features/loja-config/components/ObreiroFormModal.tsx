import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { FormGroup } from '../../../components/ui/FormGroup';
import { TextInput } from '../../../components/ui/TextInput';
import { Select } from '../../../components/ui/Select';
import { StatusMessage } from '../../../components/ui/StatusMessage';
import { GRAUS_OBREIRO } from '../data/graus';
import type { GrauObreiro, Obreiro } from '../../../types/ata';
import type { ObreiroInput } from '../hooks/useObreiros';

type Props = {
  open: boolean;
  /** Preenchido no modo edição; ausente ao cadastrar. */
  obreiro?: Obreiro;
  onSubmit: (input: ObreiroInput) => void;
  onCancel: () => void;
};

export function ObreiroFormModal({ open, obreiro, onSubmit, onCancel }: Props) {
  return (
    <Modal open={open} title={obreiro ? 'Editar Obreiro' : 'Cadastrar Obreiro'} onClose={onCancel}>
      {/* Só monta com o modal aberto: cada abertura recomeça o formulário do zero. */}
      {open ? (
        <ObreiroForm
          key={obreiro?.id ?? 'novo'}
          obreiro={obreiro}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      ) : null}
    </Modal>
  );
}

type FormProps = Omit<Props, 'open'>;

function ObreiroForm({ obreiro, onSubmit, onCancel }: FormProps) {
  const [nome, setNome] = useState(obreiro?.nome ?? '');
  const [cim, setCim] = useState(obreiro?.cim ?? '');
  const [grau, setGrau] = useState<GrauObreiro>(obreiro?.grau ?? GRAUS_OBREIRO[0]);
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const nomeLimpo = nome.trim();
    if (!nomeLimpo) {
      setErro('Informe o nome do obreiro.');
      return;
    }

    onSubmit({ nome: nomeLimpo.toUpperCase(), cim: cim.trim(), grau });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
      <FormGroup label="Nome">
        <TextInput
          value={nome}
          onChange={(e) => setNome(e.target.value.toUpperCase())}
          placeholder="Ex: JOÃO DA SILVA"
        />
      </FormGroup>

      <FormGroup label="CIM">
        <TextInput value={cim} onChange={(e) => setCim(e.target.value)} placeholder="Ex: 123456" />
      </FormGroup>

      <FormGroup label="Grau">
        <Select value={grau} onChange={(e) => setGrau(e.target.value as GrauObreiro)}>
          {GRAUS_OBREIRO.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </FormGroup>

      <StatusMessage status={erro ? { kind: 'error', text: erro } : null} />

      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="submit" variant="primary">
          Salvar
        </Button>
        <Button type="button" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
