import React, { useMemo, useState } from 'react';
import type { Loja, LojaConfig } from '../../../types/ata';
import { TextInput } from '../../../components/ui/TextInput';
import { FormGroup } from '../../../components/ui/FormGroup';
import { Button } from '../../../components/ui/Button';
import { StatusMessage } from '../../../components/ui/StatusMessage';
import { Modal } from '../../../components/ui/Modal';

type LojaInput = Omit<Loja, 'id'>;

type Props = {
  lojas: Loja[];
  lojaConfig: LojaConfig;
  excludeIds?: string[];
  placeholder?: string;
  onSelect: (loja: Loja) => void;
  onCreateLoja: (input: LojaInput) => Loja;
};

const MIN_SEARCH = 3;

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Loja configurada em "Configuração da Loja" não deve aparecer no select.
function isConfiguredLoja(loja: Loja, config: LojaConfig): boolean {
  const nome = normalize(config.nomeLoja);
  const numero = normalize(config.numeroLoja);
  const alvo = normalize(loja.nome);

  const nomeMatch = nome.length > 0 && alvo.includes(nome);
  const numeroMatch = numero.length > 0 && new RegExp(`\\b${numero}\\b`).test(alvo);

  return nomeMatch || numeroMatch;
}

export function LojaCombobox({
  lojas,
  lojaConfig,
  excludeIds = [],
  placeholder = 'Buscar loja (mín. 3 letras)...',
  onSelect,
  onCreateLoja,
}: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [novoNome, setNovoNome] = useState('');
  const [novoOriente, setNovoOriente] = useState('');
  const [novaPotencia, setNovaPotencia] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);

  const available = useMemo(
    () =>
      lojas.filter((loja) => !excludeIds.includes(loja.id) && !isConfiguredLoja(loja, lojaConfig)),
    [lojas, excludeIds, lojaConfig],
  );

  const results = useMemo(() => {
    const q = normalize(query);
    if (q.length < MIN_SEARCH) return [];
    return available.filter((loja) => normalize(loja.nome).includes(q));
  }, [available, query]);

  const canSearch = normalize(query).length >= MIN_SEARCH;

  const pick = (loja: Loja) => {
    onSelect(loja);
    setQuery('');
    setOpen(false);
  };

  const openModal = () => {
    setOpen(false);
    setModalError(null);
    setModalOpen(true);
  };

  const resetModal = () => {
    setNovoNome('');
    setNovoOriente('');
    setNovaPotencia('');
    setModalError(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetModal();
  };

  const submitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) {
      setModalError('Informe o nome da loja.');
      return;
    }
    const loja = onCreateLoja({
      nome: novoNome.trim(),
      oriente: novoOriente.trim(),
      potencia: novaPotencia.trim(),
    });
    onSelect(loja);
    setQuery('');
    setModalOpen(false);
    resetModal();
  };

  return (
    <div style={{ position: 'relative' }}>
      <TextInput
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
      />

      {open && (
        <ul className="combo-panel">
          {!canSearch && <li className="combo-hint">Digite ao menos 3 letras para buscar.</li>}

          {canSearch && results.length === 0 && (
            <li className="combo-hint">Nenhuma loja encontrada.</li>
          )}

          {results.map((loja) => (
            <li key={loja.id}>
              <button
                type="button"
                className="combo-option"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(loja)}
              >
                {loja.nome}
              </button>
            </li>
          ))}

          <li>
            <button
              type="button"
              className="combo-option combo-option--other"
              onMouseDown={(e) => e.preventDefault()}
              onClick={openModal}
            >
              ➕ Outros (cadastrar nova loja)
            </button>
          </li>
        </ul>
      )}

      <Modal open={modalOpen} title="Cadastrar Loja" onClose={closeModal}>
        <form onSubmit={submitModal} style={{ display: 'grid', gap: 10 }}>
          <FormGroup label="Nome da Loja">
            <TextInput
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              placeholder="Ex: Loja Maçônica Luzes do Cruzeiro"
            />
          </FormGroup>

          <FormGroup label="Oriente">
            <TextInput
              value={novoOriente}
              onChange={(e) => setNovoOriente(e.target.value)}
              placeholder="Ex: Aracaju/SE"
            />
          </FormGroup>

          <FormGroup label="Potência">
            <TextInput
              value={novaPotencia}
              onChange={(e) => setNovaPotencia(e.target.value)}
              placeholder="Ex: GLMESE"
            />
          </FormGroup>

          <StatusMessage status={modalError ? { kind: 'error', text: modalError } : null} />

          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="submit" variant="primary">
              Salvar e Selecionar
            </Button>
            <Button type="button" onClick={closeModal}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
