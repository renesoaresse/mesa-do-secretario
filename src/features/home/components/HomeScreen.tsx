import { HomeLayout } from '../../../components/layout/HomeLayout';
import { WelcomeSection } from './WelcomeSection';
import { LauncherCard } from './LauncherCard';

declare const __APP_VERSION__: string;

export function HomeScreen() {
  return (
    <HomeLayout>
      <div className="home-content">
        <WelcomeSection version={__APP_VERSION__} />
        <LauncherCard />
      </div>
    </HomeLayout>
  );
}
