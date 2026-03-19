import { useMemo } from 'react';
import type { PreviewData } from '../../../types/ata';
import {
  FORMAT,
  formatDateBR,
  formatPalavraBemOrdemEntries,
  gerarTextoPresenca,
  gerarTextoSaudacao,
  getPreviewDateParts,
  getSessionTypeMeta,
  hasText,
} from './documentPreviewText';

type Props = {
  zoom: number;
  data: PreviewData;
};

export function DocumentPreview({ zoom, data }: Props) {
  const content = useMemo(() => buildPreviewContent(data), [data]);

  return (
    <div className="preview-sheet-wrap">
      <section
        id="documentPreview"
        className="preview-sheet abnt-page"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        aria-label="Pré-visualização do documento"
      >
        {content}
      </section>
    </div>
  );
}

function buildPreviewContent(data: PreviewData) {
  const {
    sessionType,
    sessionConfig,
    magnaFields,
    visitors,
    officers,
    tronco,
    ordemDia,
    pbo,
    lojaConfig,
    balaustreTexto,
    atosDecretosTexto,
    expedientesTexto,
    bolsaPropostasTexto,
  } = data;

  const { dia, mes, ano, anoVLFormatado } = getPreviewDateParts(sessionConfig.dataISO);
  const isMagna = sessionType === 'magna';
  const sessionTypeMeta = getSessionTypeMeta(sessionType);

  const textoPresenca = gerarTextoPresenca(sessionConfig.numPresenca, visitors);
  const textoSaudacao = gerarTextoSaudacao(visitors, officers.or);
  const pboEntries = formatPalavraBemOrdemEntries(pbo);

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

      <div className={`title-center ${sessionTypeMeta.className}`}>
        SESSÃO {sessionTypeMeta.title} DE {sessionConfig.grau.toUpperCase()} DE MAÇOM Nº{' '}
        {String(sessionConfig.numSessao)}
        <br />
        REALIZADA NO DIA {FORMAT.pad(dia)} DE {mes.toUpperCase()} DE {ano}
      </div>

      {isMagna && hasText(magnaFields.tema) ? (
        <p className="center-italic">Tema: "{magnaFields.tema}"</p>
      ) : null}

      <p>
        À Glória do G∴ D∴ G∴ A∴ D∴ U∴ e de São João, nosso Padroeiro, ao {FORMAT.ordinal(dia)} dia
        do mês de {mes} do ano de {ano}, às {sessionConfig.horaInicio}h, reuniu-se no{' '}
        {lojaConfig.temploNome} na {lojaConfig.enderecoTemplo}, Oriente de {lojaConfig.cidadeEstado}
        , a {lojaConfig.nomeLoja} nº {lojaConfig.numeroLoja}, no grau de{' '}
        <strong>{sessionConfig.grau} de Maçom</strong>, {textoPresenca}
      </p>

      <p>
        Os trabalhos foram dirigidos pelo V∴ M∴ <strong>{officers.vm}</strong>, 1º Vig∴{' '}
        <strong>{officers.vig1}</strong>, e 2º Vig∴ <strong>{officers.vig2}</strong>. Tendo como Or∴{' '}
        <strong>{officers.or}</strong> e Sec∴ <strong>{officers.sec}</strong>.
      </p>

      {isMagna && hasText(magnaFields.autoridades) ? (
        <p className="no-indent">
          <strong>AUTORIDADES PRESENTES:</strong> {magnaFields.autoridades}
        </p>
      ) : null}

      {isMagna && hasText(magnaFields.oradorConvidado) ? (
        <p className="no-indent">
          <strong>ORADOR CONVIDADO:</strong> A sessão contou com a presença do ilustre Ir∴{' '}
          <strong>{magnaFields.oradorConvidado}</strong>, que proferiu brilhante palestra sobre o
          tema da sessão.
        </p>
      ) : null}

      <p className="no-indent">
        <strong>BALAÚSTRE:</strong> {balaustreTexto}
      </p>

      <p className="no-indent">
        <strong>ATOS E DECRETOS:</strong> {atosDecretosTexto}
      </p>
      <p className="no-indent">
        <strong>EXPEDIENTES:</strong> {expedientesTexto}
      </p>

      <p className="no-indent">
        <strong>BOLSA DE PROPOSTAS E INFORMAÇÕES:</strong> {bolsaPropostasTexto}
      </p>

      <p className="no-indent">
        <strong>ORDEM DO DIA:</strong> {ordemDia}
      </p>

      {isMagna && hasText(magnaFields.atoEspecial) ? (
        <p className="no-indent">
          <strong>ATO ESPECIAL:</strong> {magnaFields.atoEspecial}
        </p>
      ) : null}

      <p className="no-indent">
        <strong>BOLSA DE BENEFICÊNCIA:</strong> Depois do anúncio feito pelo V∴ M∴ e VVig∴, o Ir∴
        Hosp∴ circulou com a Bolsa. Arrecadou{' '}
        <strong>
          {String(tronco)} ({FORMAT.extenso(tronco)}) medalhas cunhadas
        </strong>
        , debitados a Tes∴ e creditados a Hosp∴.
      </p>

      <p className="no-indent">
        <strong>SAUDAÇÃO AOS VISITANTES:</strong> {textoSaudacao}
      </p>

      <p className="no-indent">
        <strong>PALAVRA A BEM DA ORDEM:</strong> A palavra circulou da seguinte forma:
      </p>

      {pboEntries.length === 0 ? (
        <p className="pbo-empty">
          A palavra circulou nas colunas e no oriente. Reinou a paz e a harmonia.
        </p>
      ) : (
        pboEntries.map((entry) => (
          <div key={entry.key} className="pbo-block">
            <strong>{entry.label}:</strong> {entry.value}
          </div>
        ))
      )}

      <p className="no-indent">
        <strong>ENCERRAMENTO:</strong> O encerramento ocorreu às {sessionConfig.horaEnc}h, na sua
        forma ritualística, e eu, <strong>{officers.sec}</strong>, Sec∴, lavrei o presente balaústre
        longe das vistas e indiscrições Profanas, que depois de decifrado e aprovado pela Augusta
        Assembleia, será assinado por quem de direito.
      </p>

      <p className="center-small">
        Or∴ de {lojaConfig.cidadeEstado}, ao {FORMAT.ordinal(dia)} dia do mês de {mes} do ano de{' '}
        {ano} da E∴ V∴ e {anoVLFormatado} da V∴ L∴
      </p>

      <div className="signatures">
        <div className="sig-line sig-line--half">
          <strong>{officers.vm}</strong>
          <br />
          Venerável Mestre
        </div>
        <div className="sig-line sig-line--half">
          <strong>{officers.or}</strong>
          <br />
          Orador
        </div>
        <div className="sig-line sig-line--full">
          <strong>{officers.sec}</strong>
          <br />
          Secretário
        </div>
      </div>
    </>
  );
}
