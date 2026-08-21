import { HomeLayout } from '../../../components/layout/HomeLayout';
import { WelcomeSection } from './WelcomeSection';
import { LauncherCard } from './LauncherCard';
import { BoasVindasModal } from '../../loja-config/components/BoasVindasModal';
import { isLojaConfigCompleta } from '../../loja-config/data/camposObrigatorios';
import { storage } from '../../../services/storage';
import { DEFAULT_LOJA_CONFIG } from '../../../hooks/useAtaState';

declare const __APP_VERSION__: string;

export function HomeScreen() {
  // Enquanto os dados obrigatórios da loja faltarem, o secretário é recebido
  // com as boas-vindas e o único caminho é a configuração.
  const lojaConfigPendente = !isLojaConfigCompleta(storage.loadLojaConfig(DEFAULT_LOJA_CONFIG));

  return (
    <HomeLayout>
      <div className="home-content">
        <WelcomeSection version={__APP_VERSION__} />
        <LauncherCard />
      </div>

      <BoasVindasModal open={lojaConfigPendente} />
    </HomeLayout>
  );
}
