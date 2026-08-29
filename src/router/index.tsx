import type { ComponentType } from 'react';
import { Redirect, Route, Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { HomeScreen } from '../features/home/components/HomeScreen';
import { ConfigScreen } from '../features/config/components/ConfigScreen';
import { LojasListScreen } from '../features/loja-config/components/LojasListScreen';
import { LojaFormScreen } from '../features/loja-config/components/LojaFormScreen';
import { LojaConfigScreen } from '../features/loja-config/components/LojaConfigScreen';
import { ROUTES } from './routes';
import { AtaRedirect } from '../features/ata/components/AtaRedirect';
import { AtaRitoScreen } from '../features/ata/components/AtaRitoScreen';
import { isLojaConfigCompleta } from '../features/loja-config/data/camposObrigatorios';
import { storage } from '../services/storage';
import { DEFAULT_LOJA_CONFIG } from '../hooks/useAtaState';

function lojaConfigPendente(): boolean {
  return !isLojaConfigCompleta(storage.loadLojaConfig(DEFAULT_LOJA_CONFIG));
}

/**
 * Sem os dados da loja, qualquer rota digitada na URL cai na tela principal,
 * onde o modal de boas-vindas continua aberto.
 */
function RotaBloqueada({ component: Component }: { component: ComponentType }) {
  if (lojaConfigPendente()) {
    return <Redirect to={ROUTES.HOME} />;
  }

  return <Component />;
}

export function AppRoutes() {
  return (
    <>
      <Route path={ROUTES.HOME} component={HomeScreen} />
      <Route path={ROUTES.ATA}>
        <RotaBloqueada component={AtaRedirect} />
      </Route>

      {/* Um só endereço para todos os ritos: o cadastro da loja decide qual
          módulo abre, e qualquer outro slug é reencaminhado para ele. */}
      <Route path={ROUTES.ATA_RITO}>
        {(params) => <RotaBloqueada component={() => <AtaRitoScreen slug={params.slug ?? ''} />} />}
      </Route>
      <Route path={ROUTES.CONFIG}>
        <RotaBloqueada component={ConfigScreen} />
      </Route>
      <Route path={ROUTES.LOJAS}>
        <RotaBloqueada component={LojasListScreen} />
      </Route>
      <Route path={ROUTES.LOJA_NOVA}>
        <RotaBloqueada component={LojaFormScreen} />
      </Route>
      {/* Sempre acessível: é justamente onde os dados pendentes são cadastrados. */}
      <Route path={ROUTES.LOJA_CONFIG} component={LojaConfigScreen} />
    </>
  );
}

export function AppRouter() {
  const isElectron = typeof window !== 'undefined' && window.electronAPI !== undefined;
  const hook = isElectron ? useHashLocation : undefined;

  return (
    <Router hook={hook}>
      <AppRoutes />
    </Router>
  );
}
