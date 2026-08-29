import { Redirect } from 'wouter';
import { AppEditor } from '../../../app/AppEditor';
import { storage } from '../../../services/storage';
import { DEFAULT_LOJA_CONFIG } from '../../../hooks/useAtaState';
import { ROUTES } from '../../../router/routes';
import { moduloAtaDoRito } from '../registry';
import { rotaDoModuloAta } from '../rotas';

type Props = {
  /** Trecho de rito vindo da URL: /ata/<slug>. */
  slug: string;
};

/**
 * A ata aberta é sempre a do rito cadastrado na loja. Qualquer outro endereço
 * — o de outro rito ou um slug inexistente — é trocado pelo endereço certo, sem
 * deixar rastro no histórico para o botão voltar não cair no mesmo lugar.
 */
export function AtaRitoScreen({ slug }: Props) {
  const { rito } = storage.loadLojaConfig(DEFAULT_LOJA_CONFIG);
  const modulo = moduloAtaDoRito(rito);

  if (!modulo) {
    return <Redirect to={ROUTES.LOJA_CONFIG} replace />;
  }

  if (slug !== modulo.slug) {
    return <Redirect to={rotaDoModuloAta(modulo)} replace />;
  }

  return <AppEditor modulo={modulo} />;
}
