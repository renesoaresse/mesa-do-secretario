import { useLocation } from 'wouter';
import { ROUTES } from '../../../router/index';

export function LauncherCard() {
  const [, navigate] = useLocation();

  function handleNewAta() {
    navigate(ROUTES.ATA);
  }

  function handleConfig() {
    navigate(ROUTES.CONFIG);
  }

  return (
    <div className="home-launcher">
      <h2 className="home-launcher__title">O que deseja fazer?</h2>

      <button
        type="button"
        className="home-launcher__btn home-launcher__btn--primary"
        onClick={handleNewAta}
      >
        <span className="home-launcher__btn-icon">📝</span>
        <span className="home-launcher__btn-text">
          <span className="home-launcher__btn-label">Nova Ata</span>
          <span className="home-launcher__btn-hint">Iniciar uma nova sessão</span>
        </span>
        <span className="home-launcher__btn-arrow">→</span>
      </button>

      <button type="button" className="home-launcher__btn" onClick={handleConfig}>
        <span className="home-launcher__btn-icon">⚙️</span>
        <span className="home-launcher__btn-text">
          <span className="home-launcher__btn-label">Configurações</span>
          <span className="home-launcher__btn-hint">Ajustar preferências</span>
        </span>
        <span className="home-launcher__btn-arrow">→</span>
      </button>
    </div>
  );
}
