import type { LojaConfig } from '../../../types/ata';
import { formatDateBR, hasText } from '../../preview/components/documentPreviewText';

type Props = {
  lojaConfig: LojaConfig;
};

/** Timbre da Loja: é o mesmo em todos os ritos, muda só o que está cadastrado. */
export function CabecalhoLoja({ lojaConfig }: Props) {
  return (
    <>
      <div className="doc-top">
        {lojaConfig.logoDataUrl ? (
          <div className="doc-top__logo">
            <img className="doc-top__logo-img" src={lojaConfig.logoDataUrl} alt="Logo da Loja" />
          </div>
        ) : (
          <div className="doc-top__logo doc-top__logo--empty" />
        )}

        <div className="doc-top__box">
          <div className="doc-top__text">
            À&nbsp;&nbsp; G∴&nbsp; D∴&nbsp; G∴&nbsp; A∴&nbsp; D∴&nbsp; U∴
            <br />
            {lojaConfig.nomeLoja.toUpperCase()} Nº {lojaConfig.numeroLoja}
            <br />
            {hasText(lojaConfig.dataFundacaoISO) ? (
              <>
                FUNDADA EM {formatDateBR(lojaConfig.dataFundacaoISO).toUpperCase()}
                <br />
              </>
            ) : null}
            JURISDICIONADA À GRANDE LOJA DO ESTADO DE SERGIPE
            <br />
            OR∴ DE {lojaConfig.cidadeEstado.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="doc-top__rule" />
    </>
  );
}
