import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { FormGroup } from '../../../components/ui/FormGroup';
import { PasswordInput } from '../../../components/ui/PasswordInput';
import { Button } from '../../../components/ui/Button';
import { StatusMessage } from '../../../components/ui/StatusMessage';
import { exportEncryptedPdf } from '../../../services/pdfExport';
import type { StatusState } from '../../../types/ata';

type Props = {
  open: boolean;
  fileName: string;
  onClose: () => void;
};

export function PdfPasswordModal({ open, fileName, onClose }: Props) {
  // Senha e confirmação vivem só neste estado local: nunca vão para o storage,
  // para o draft da ata nem para o processo principal do Electron.
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [status, setStatus] = useState<StatusState>(null);
  const [busy, setBusy] = useState(false);

  const senhasConferem = senha.length > 0 && senha === confirmacao;

  const reset = () => {
    setSenha('');
    setConfirmacao('');
    setStatus(null);
    setBusy(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senhasConferem || busy) return;

    setBusy(true);
    setStatus({ kind: 'info', text: 'Gerando PDF protegido...' });

    const result = await exportEncryptedPdf(senha, fileName);

    // Descarta a senha assim que o PDF é gerado, dê no que der.
    setSenha('');
    setConfirmacao('');
    setBusy(false);

    if (result.kind === 'saved') {
      setStatus(null);
      onClose();
      return;
    }

    if (result.kind === 'canceled') {
      setStatus(null);
      onClose();
      return;
    }

    setStatus({
      kind: 'error',
      text:
        result.kind === 'unavailable'
          ? 'A exportação de PDF com senha está disponível apenas no aplicativo desktop.'
          : result.message,
    });
  };

  return (
    <Modal open={open} title="PDF com senha" onClose={close}>
      <form onSubmit={submit} autoComplete="off" style={{ display: 'grid', gap: 10 }}>
        <FormGroup label="Senha">
          <PasswordInput
            value={senha}
            onChange={setSenha}
            placeholder="Digite a senha do PDF"
            toggleLabel="senha"
          />
        </FormGroup>

        <FormGroup label="Confirmação da Senha">
          <PasswordInput
            value={confirmacao}
            onChange={setConfirmacao}
            placeholder="Repita a senha"
            toggleLabel="confirmação da senha"
          />
        </FormGroup>

        {confirmacao.length > 0 && !senhasConferem ? (
          <StatusMessage status={{ kind: 'error', text: 'As senhas não conferem.' }} />
        ) : null}

        <StatusMessage status={status} />

        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="submit" variant="primary" disabled={!senhasConferem || busy}>
            {busy ? 'Gerando...' : 'Gerar'}
          </Button>
          <Button type="button" onClick={close} disabled={busy}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
