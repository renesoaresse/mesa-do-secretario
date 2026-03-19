import { Route, Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { HomeScreen } from '../features/home/components/HomeScreen';
import { AppEditor } from '../app/AppEditor';

export const ROUTES = {
  HOME: '/',
  ATA: '/ata',
} as const;

export function AppRoutes() {
  return (
    <>
      <Route path={ROUTES.HOME} component={HomeScreen} />
      <Route path={ROUTES.ATA} component={AppEditor} />
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
