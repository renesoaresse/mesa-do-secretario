import { useLocation } from 'wouter';
import { HomeLayout } from '../../../components/layout/HomeLayout';
import { Button } from '../../../components/ui/Button';
import { ROUTES } from '../../../router/index';
import { useLojas, isDefaultLoja } from '../hooks/useLojas';

export function LojasListScreen() {
  const [, navigate] = useLocation();
  const { lojas, removeLoja } = useLojas();

  return (
    <HomeLayout>
      <div className="home-content">
        <div className="home-launcher">
          <h2 className="home-launcher__title">Lojas Cadastradas</h2>

          {lojas.length === 0 ? (
            <p className="help-text">Nenhuma loja cadastrada.</p>
          ) : (
            <table className="lojas-table">
              <thead>
                <tr>
                  <th>Nome da Loja</th>
                  <th>Oriente</th>
                  <th>Potência</th>
                  <th aria-label="Ações" />
                </tr>
              </thead>
              <tbody>
                {lojas.map((loja) => (
                  <tr key={loja.id}>
                    <td>{loja.nome}</td>
                    <td>{loja.oriente}</td>
                    <td>{loja.potencia}</td>
                    <td>
                      {isDefaultLoja(loja.id) ? (
                        <span className="help-text">Padrão</span>
                      ) : (
                        <Button type="button" onClick={() => removeLoja(loja.id)}>
                          Remover
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Button type="button" variant="primary" onClick={() => navigate(ROUTES.LOJA_NOVA)}>
              Cadastrar Loja
            </Button>
            <Button type="button" onClick={() => navigate(ROUTES.CONFIG)}>
              Voltar
            </Button>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
