import React, { useRef, useState } from 'react';
import type { LojaConfig, StatusState } from '../../../types/ata';

import { FormRow } from '../../../components/ui/FormRow';
import { FormGroup } from '../../../components/ui/FormGroup';
import { TextInput } from '../../../components/ui/TextInput';
import { Button } from '../../../components/ui/Button';
import { StatusMessage } from '../../../components/ui/StatusMessage';

const MAX_LOGO_W = 640;
const MAX_LOGO_H = 640;
const MAX_FILE_MB = 3;

type Props = {
  value: LojaConfig;
  onChange: (patch: Partial<LojaConfig>) => void;
};

export function LojaConfigForm({ value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<StatusState>(null);

  const pickLogo = () => fileRef.current?.click();

  const clearLogo = () => {
    onChange({ logoDataUrl: null });
    setStatus({ kind: 'info', text: 'Logo removida.' });
    if (fileRef.current) fileRef.current.value = '';
  };

  const onPickFile = async (file: File) => {
    setStatus(null);

    const mb = file.size / (1024 * 1024);
    if (mb > MAX_FILE_MB) {
      setStatus({
        kind: 'error',
        text: `Arquivo muito grande (${mb.toFixed(1)}MB). Máximo: ${MAX_FILE_MB}MB.`,
      });
      return;
    }

    const dataUrl = await readAsDataURL(file);

    try {
      const { width, height } = await getImageSize(dataUrl);

      if (width > MAX_LOGO_W || height > MAX_LOGO_H) {
        setStatus({
          kind: 'error',
          text: `Dimensão da logo: ${width}x${height}px. Máx permitido: ${MAX_LOGO_W}x${MAX_LOGO_H}px.`,
        });
        return;
      }

      onChange({ logoDataUrl: dataUrl });
      setStatus({ kind: 'success', text: 'Logo aplicada com sucesso.' });
    } catch {
      setStatus({ kind: 'error', text: 'Não foi possível ler a imagem.' });
    }
  };

  return (
    <div className="sidebar-section">
      <div style={{ display: 'grid', gap: 10 }}>
        <FormGroup label="Logo da Loja">
          <div className="logo-row">
            <div className="logo-box" aria-label="Prévia da logo">
              {value.logoDataUrl ? (
                <img className="logo-img" src={value.logoDataUrl} alt="Logo da Loja" />
              ) : (
                <div className="logo-empty">Sem logo</div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button type="button" onClick={pickLogo}>
                Selecionar Logo
              </Button>

              {value.logoDataUrl ? (
                <Button type="button" onClick={clearLogo}>
                  Remover Logo
                </Button>
              ) : null}

              <div className="help-text">
                PNG/JPG/WEBP • máx {MAX_LOGO_W}×{MAX_LOGO_H}px • máx {MAX_FILE_MB}MB
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPickFile(f);
                e.currentTarget.value = '';
              }}
            />
          </div>

          <StatusMessage status={status} />
        </FormGroup>

        <FormRow>
          <FormGroup label="Nome da Loja">
            <TextInput
              value={value.nomeLoja}
              onChange={(e) => onChange({ nomeLoja: e.target.value })}
              placeholder="Ex: Loja Maçônica Luzes do Cruzeiro"
            />
          </FormGroup>

          <FormGroup label="Número da Loja">
            <TextInput
              value={value.numeroLoja}
              onChange={(e) => onChange({ numeroLoja: e.target.value })}
              placeholder="Ex: 29"
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup label="Data de Fundação">
            <TextInput
              type="date"
              value={value.dataFundacaoISO}
              onChange={(e) => onChange({ dataFundacaoISO: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="Templo onde se reúnem?">
            <TextInput
              value={value.temploNome}
              onChange={(e) => onChange({ temploNome: e.target.value })}
              placeholder="Ex: Templo da Loja 7 de Setembro"
            />
          </FormGroup>
        </FormRow>

        <FormGroup label="Endereço do templo">
          <TextInput
            value={value.enderecoTemplo}
            onChange={(e) => onChange({ enderecoTemplo: e.target.value })}
            placeholder="Rua, nº, bairro"
          />
        </FormGroup>

        <FormGroup label="Cidade e Estado da Loja">
          <TextInput
            value={value.cidadeEstado}
            onChange={(e) => onChange({ cidadeEstado: e.target.value })}
            placeholder="Ex: Simão Dias/SE"
          />
        </FormGroup>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function getImageSize(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = dataUrl;
  });
}
