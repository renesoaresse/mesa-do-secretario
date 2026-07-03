import { useLocation } from 'wouter';
import { HomeLayout } from '../../../components/layout/HomeLayout';
import { ROUTES } from '../../../router/index';

export function ConfigScreen() {
  const [, navigate] = useLocation();

  function handleBack() {
    navigate(ROUTES.HOME);
  }

  return (
    <HomeLayout>
      <div className="home-content">
        <div className="home-launcher">
          <h2 className="home-launcher__title">Configurações</h2>

          <button
            type="button"
            className="home-launcher__btn home-launcher__btn--primary"
            onClick={() => navigate(ROUTES.LOJAS)}
          >
            <span className="home-launcher__btn-icon">🏛️</span>
            <span className="home-launcher__btn-text">
              <span className="home-launcher__btn-label">Listar Lojas</span>
              <span className="home-launcher__btn-hint">Ver lojas cadastradas</span>
            </span>
            <span className="home-launcher__btn-arrow">→</span>
          </button>

          <button
            type="button"
            className="home-launcher__btn"
            onClick={() => navigate(ROUTES.LOJA_NOVA)}
          >
            <span className="home-launcher__btn-icon">➕</span>
            <span className="home-launcher__btn-text">
              <span className="home-launcher__btn-label">Cadastrar Loja</span>
              <span className="home-launcher__btn-hint">Adicionar nova loja</span>
            </span>
            <span className="home-launcher__btn-arrow">→</span>
          </button>

          <button type="button" className="home-launcher__btn" onClick={handleBack}>
            <span className="home-launcher__btn-icon">←</span>
            <span className="home-launcher__btn-text">
              <span className="home-launcher__btn-label">Voltar</span>
              <span className="home-launcher__btn-hint">Retornar ao início</span>
            </span>
          </button>
        </div>
      </div>
    </HomeLayout>
  );
}
