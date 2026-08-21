import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { FormGroup } from '../../../components/ui/FormGroup';
import { TextInput } from '../../../components/ui/TextInput';
import { Select } from '../../../components/ui/Select';
import { StatusMessage } from '../../../components/ui/StatusMessage';
import { cargosDoRito } from '../data/cargos';
import type { Gestao, Obreiro, Rito } from '../../../types/ata';
import type { GestaoInput } from '../hooks/useGestoes';

type Props = {
  open: boolean;
  /** Rito configurado na aba Geral: define quais cargos existem. */
  rito: Rito | '';
  /** Já chega ordenada por nome. */
  obreiros: Obreiro[];
  /** Preenchida no modo edição; ausente ao cadastrar. */
  gestao?: Gestao;
  onSubmit: (input: GestaoInput) => void;
  onCancel: () => void;
};

export function GestaoFormModal({ open, rito, obreiros, gestao, onSubmit, onCancel }: Props) {
  return (
    <Modal open={open} title={gestao ? 'Editar Gestão' : 'Cadastrar Gestão'} onClose={onCancel}>
      {/* Só monta com o modal aberto: cada abertura recomeça o formulário do zero. */}
      {open ? (
        <GestaoForm
          key={gestao?.id ?? 'nova'}
          rito={rito}
          obreiros={obreiros}
          gestao={gestao}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      ) : null}
    </Modal>
  );
}

type FormProps = Omit<Props, 'open'>;

function GestaoForm({ rito, obreiros, gestao, onSubmit, onCancel }: FormProps) {
  const cargos = cargosDoRito(rito);
  const [ano, setAno] = useState(gestao?.ano ?? '');
  const [vigente, setVigente] = useState(gestao?.vigente ?? false);
  // obreiroId -> cargo escolhido ('' = sem cargo nesta gestão)
  const [cargoPorObreiro, setCargoPorObreiro] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      obreiros.map((obreiro) => [
        obreiro.id,
        gestao?.atribuicoes.find((atribuicao) => atribuicao.obreiroId === obreiro.id)?.cargo ?? '',
      ]),
    ),
  );
  const [erro, setErro] = useState<string | null>(null);

  function escolherCargo(obreiroId: string, cargo: string) {
    setCargoPorObreiro((prev) => ({ ...prev, [obreiroId]: cargo }));
    setErro(null);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const anoLimpo = ano.trim();
    if (!anoLimpo) {
      setErro('Informe o ano da gestão.');
      return;
    }

    if (anoLimpo.length !== 4) {
      setErro('O ano da gestão deve ter 4 dígitos.');
      return;
    }

    const atribuicoes = Object.entries(cargoPorObreiro)
      .filter(([, cargo]) => cargo !== '')
      .map(([obreiroId, cargo]) => ({ obreiroId, cargo }));

    const cargosEscolhidos = atribuicoes.map((atribuicao) => atribuicao.cargo);
    if (new Set(cargosEscolhidos).size !== cargosEscolhidos.length) {
      setErro('Cada cargo pode ser ocupado por apenas um obreiro nesta gestão.');
      return;
    }

    onSubmit({ ano: anoLimpo, vigente, atribuicoes });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
      <FormGroup label="Ano da Gestão">
        <TextInput
          value={ano}
          onChange={(e) => setAno(e.target.value.replace(/\D/g, '').slice(0, 4))}
          inputMode="numeric"
          maxLength={4}
          placeholder="Ex: 2026"
        />
      </FormGroup>

      <FormGroup label="Gestão Vigente">
        <Select
          value={vigente ? 'sim' : 'nao'}
          onChange={(e) => setVigente(e.target.value === 'sim')}
        >
          <option value="nao">Não</option>
          <option value="sim">Sim</option>
        </Select>
      </FormGroup>

      {!rito ? (
        <p className="help-text">
          Escolha o rito da loja na aba Geral para liberar a lista de cargos.
        </p>
      ) : cargos.length === 0 ? (
        <p className="help-text">Os cargos do {rito} ainda não foram cadastrados.</p>
      ) : obreiros.length === 0 ? (
        <p className="help-text">Cadastre os obreiros antes de montar a gestão.</p>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {obreiros.map((obreiro) => {
            // Um cargo já escolhido some das outras listas, mas continua na própria.
            const ocupadosPorOutros = new Set(
              Object.entries(cargoPorObreiro)
                .filter(([id, cargo]) => id !== obreiro.id && cargo !== '')
                .map(([, cargo]) => cargo),
            );

            return (
              <FormGroup key={obreiro.id} label={obreiro.nome}>
                <Select
                  value={cargoPorObreiro[obreiro.id] ?? ''}
                  onChange={(e) => escolherCargo(obreiro.id, e.target.value)}
                >
                  <option value="">Sem cargo</option>
                  {cargos
                    .filter((cargo) => !ocupadosPorOutros.has(cargo.sigla))
                    .map((cargo) => (
                      <option key={cargo.sigla} value={cargo.sigla}>
                        {cargo.sigla} — {cargo.nome}
                      </option>
                    ))}
                </Select>
              </FormGroup>
            );
          })}
        </div>
      )}

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
