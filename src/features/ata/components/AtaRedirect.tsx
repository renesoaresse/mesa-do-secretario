import { Redirect } from 'wouter';
import { storage } from '../../../services/storage';
import { DEFAULT_LOJA_CONFIG } from '../../../hooks/useAtaState';
import { ROUTES } from '../../../router/routes';
import { rotaDoModuloAta } from '../rotas';
import { moduloAtaDoRito } from '../registry';

/**
 * /ata não tem tela própria: o rito cadastrado na loja é quem decide qual
 * módulo de ata abrir. Sem rito reconhecido, o caminho é o cadastro da loja.
 */
export function AtaRedirect() {
  const { rito } = storage.loadLojaConfig(DEFAULT_LOJA_CONFIG);
  const modulo = moduloAtaDoRito(rito);

  if (!modulo) {
    return <Redirect to={ROUTES.LOJA_CONFIG} replace />;
  }

  return <Redirect to={rotaDoModuloAta(modulo)} replace />;
}
