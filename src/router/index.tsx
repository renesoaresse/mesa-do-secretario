import { Route, Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { HomeScreen } from '../features/home/components/HomeScreen';
import { ConfigScreen } from '../features/config/components/ConfigScreen';
import { LojasListScreen } from '../features/loja-config/components/LojasListScreen';
import { LojaFormScreen } from '../features/loja-config/components/LojaFormScreen';
import { AppEditor } from '../app/AppEditor';

export const ROUTES = {
  HOME: '/',
  ATA: '/ata',
  CONFIG: '/config',
  LOJAS: '/config/lojas',
  LOJA_NOVA: '/config/lojas/nova',
} as const;

export function AppRoutes() {
  return (
    <>
      <Route path={ROUTES.HOME} component={HomeScreen} />
      <Route path={ROUTES.ATA} component={AppEditor} />
      <Route path={ROUTES.CONFIG} component={ConfigScreen} />
      <Route path={ROUTES.LOJAS} component={LojasListScreen} />
      <Route path={ROUTES.LOJA_NOVA} component={LojaFormScreen} />
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
