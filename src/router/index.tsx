import type { ComponentType } from 'react';
import { Redirect, Route, Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { HomeScreen } from '../features/home/components/HomeScreen';
import { ConfigScreen } from '../features/config/components/ConfigScreen';
import { LojasListScreen } from '../features/loja-config/components/LojasListScreen';
import { LojaFormScreen } from '../features/loja-config/components/LojaFormScreen';
import { LojaConfigScreen } from '../features/loja-config/components/LojaConfigScreen';
import { AppEditor } from '../app/AppEditor';
import { isLojaConfigCompleta } from '../features/loja-config/data/camposObrigatorios';
import { storage } from '../services/storage';
import { DEFAULT_LOJA_CONFIG } from '../hooks/useAtaState';

export const ROUTES = {
  HOME: '/',
  ATA: '/ata',
  CONFIG: '/config',
  LOJAS: '/config/lojas',
  LOJA_NOVA: '/config/lojas/nova',
  LOJA_CONFIG: '/config/loja',
} as const;

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
        <RotaBloqueada component={AppEditor} />
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
