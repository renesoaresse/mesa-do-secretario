import { useLocation } from 'wouter';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { ROUTES } from '../../../router/index';

type Props = {
  open: boolean;
};

export function BoasVindasModal({ open }: Props) {
  const [, navigate] = useLocation();

  return (
    // Sem saída: o secretário segue para a configuração da loja.
    <Modal open={open} title="Bem-vindo, Irmão Secretário" dismissible={false} onClose={() => {}}>
      <div style={{ display: 'grid', gap: 12 }}>
        <p>
          Que sua passagem por esta Secretaria seja de muita luz. Este sistema foi feito para
          acompanhar seus trabalhos e facilitar a lavratura das atas.
        </p>
        <p>
          Antes de começar, cadastre os dados da sua Loja — nome, número, rito, data de fundação e
          templo. Eles são usados no cabeçalho de todas as atas geradas.
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="button" variant="primary" onClick={() => navigate(ROUTES.LOJA_CONFIG)}>
            Configurar dados da Loja
          </Button>
        </div>
      </div>
    </Modal>
  );
}
