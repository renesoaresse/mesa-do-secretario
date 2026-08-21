import { useState } from 'react';
import { useLocation } from 'wouter';
import { HomeLayout } from '../../../components/layout/HomeLayout';
import { Button } from '../../../components/ui/Button';
import { StatusMessage } from '../../../components/ui/StatusMessage';
import { Tabs } from '../../../components/ui/Tabs';
import type { TabItem } from '../../../components/ui/Tabs';
import { ROUTES } from '../../../router/index';
import { LojaConfigForm } from './LojaConfigForm';
import { ObreiroFormModal } from './ObreiroFormModal';
import { ObreirosList } from './ObreirosList';
import { GestaoFormModal } from './GestaoFormModal';
import { GestoesList } from './GestoesList';
import { useLojaConfig } from '../hooks/useLojaConfig';
import { useObreiros } from '../hooks/useObreiros';
import { useGestoes } from '../hooks/useGestoes';
import type { ObreiroInput } from '../hooks/useObreiros';
import type { GestaoInput } from '../hooks/useGestoes';
import type { Gestao, Obreiro, StatusState } from '../../../types/ata';

export function LojaConfigScreen() {
  const [, navigate] = useLocation();
  const { lojaConfig, updateLojaConfig, saveLojaConfig, isDirty } = useLojaConfig();
  const [status, setStatus] = useState<StatusState>(null);
  const { obreiros, addObreiro, updateObreiro } = useObreiros();
  const { gestoes, addGestao, updateGestao } = useGestoes();
  const [gestaoEmEdicao, setGestaoEmEdicao] = useState<Gestao | null>(null);
  const [gestaoModalAberta, setGestaoModalAberta] = useState(false);
  const [obreiroEmEdicao, setObreiroEmEdicao] = useState<Obreiro | null>(null);
  const [obreiroModalAberto, setObreiroModalAberto] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('geral');

  function handleChange(patch: Parameters<typeof updateLojaConfig>[0]) {
    updateLojaConfig(patch);
    setStatus(null);
  }

  function handleSave() {
    saveLojaConfig();
    setStatus({ kind: 'success', text: 'Dados da loja salvos.' });
  }

  function abrirCadastroGestao() {
    setGestaoEmEdicao(null);
    setGestaoModalAberta(true);
  }

  function abrirEdicaoGestao(gestao: Gestao) {
    setGestaoEmEdicao(gestao);
    setGestaoModalAberta(true);
  }

  function fecharGestaoModal() {
    setGestaoModalAberta(false);
    setGestaoEmEdicao(null);
  }

  function salvarGestao(input: GestaoInput) {
    if (gestaoEmEdicao) {
      updateGestao(gestaoEmEdicao.id, input);
    } else {
      addGestao(input);
    }
    fecharGestaoModal();
  }

  function abrirCadastroObreiro() {
    setObreiroEmEdicao(null);
    setObreiroModalAberto(true);
  }

  function abrirEdicaoObreiro(obreiro: Obreiro) {
    setObreiroEmEdicao(obreiro);
    setObreiroModalAberto(true);
  }

  function fecharObreiroModal() {
    setObreiroModalAberto(false);
    setObreiroEmEdicao(null);
  }

  function salvarObreiro(input: ObreiroInput) {
    if (obreiroEmEdicao) {
      updateObreiro(obreiroEmEdicao.id, input);
    } else {
      addObreiro(input);
    }
    fecharObreiroModal();
  }

  const tabs: TabItem[] = [
    {
      id: 'geral',
      label: 'Geral',
      content: <LojaConfigForm value={lojaConfig} onChange={handleChange} />,
    },
    {
      id: 'gestao',
      label: 'Gestão',
      content: <GestoesList gestoes={gestoes} onEdit={abrirEdicaoGestao} />,
    },
    {
      id: 'obreiros',
      label: 'Obreiros',
      content: <ObreirosList obreiros={obreiros} onEdit={abrirEdicaoObreiro} />,
    },
  ];

  return (
    <HomeLayout>
      <div className="home-content">
        <div className="home-launcher">
          <h2 className="home-launcher__title">Configuração da Loja</h2>

          <Tabs
            items={tabs}
            activeTabId={abaAtiva}
            onTabChange={setAbaAtiva}
            ariaLabel="Seções da configuração da loja"
          />

          {abaAtiva === 'geral' ? <StatusMessage status={status} /> : null}

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {abaAtiva === 'geral' ? (
              <Button type="button" variant="primary" onClick={handleSave} disabled={!isDirty}>
                Salvar
              </Button>
            ) : null}

            {abaAtiva === 'gestao' ? (
              <Button type="button" variant="primary" onClick={abrirCadastroGestao}>
                Cadastrar Gestão
              </Button>
            ) : null}

            {abaAtiva === 'obreiros' ? (
              <Button type="button" variant="primary" onClick={abrirCadastroObreiro}>
                Cadastrar Obreiro
              </Button>
            ) : null}

            <Button type="button" onClick={() => navigate(ROUTES.CONFIG)}>
              Voltar
            </Button>
          </div>
        </div>
      </div>

      <GestaoFormModal
        open={gestaoModalAberta}
        rito={lojaConfig.rito}
        obreiros={obreiros}
        gestao={gestaoEmEdicao ?? undefined}
        onSubmit={salvarGestao}
        onCancel={fecharGestaoModal}
      />

      <ObreiroFormModal
        open={obreiroModalAberto}
        obreiro={obreiroEmEdicao ?? undefined}
        onSubmit={salvarObreiro}
        onCancel={fecharObreiroModal}
      />
    </HomeLayout>
  );
}
