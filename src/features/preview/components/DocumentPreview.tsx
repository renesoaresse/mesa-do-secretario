import { useMemo, useRef } from 'react';
import type { PreviewData } from '../../../types/ata';
import {
  computePageOffsets,
  useLineNumbers,
  PAGE_CONTENT_HEIGHT,
  type LineRect,
} from '../hooks/useLineNumbers';
import {
  ATOS_DECRETOS_PADRAO,
  BALAUSTRE_PADRAO,
  EXPEDIENTE_PADRAO,
  FORMAT,
  formatDateBR,
  gerarTextoBolsaPropostas,
  formatPalavraBemOrdemEntries,
  gerarSufixoLojasConjunta,
  gerarTextoPresenca,
  gerarTextoSaudacao,
  getPreviewDateParts,
  getSessionTypeMeta,
  hasText,
  PBO_SUPRIMIDO_TEXTO,
  TRONCO_SUPRIMIDO_TEXTO,
} from './documentPreviewText';

type Props = {
  zoom: number;
  data: PreviewData;
};

export function DocumentPreview({ zoom, data }: Props) {
  const content = useMemo(() => buildPreviewContent(data), [data]);
  const bodyRef = useRef<HTMLDivElement>(null);

  const numerarLinhas = data.sessionConfig.numerarLinhas;
  const revision = useMemo(() => [data, zoom], [data, zoom]);
  const lines = useLineNumbers(bodyRef, numerarLinhas, revision);

  // A régua só numera o corpo; a paginação considera todas as linhas para não
  // cortar cabeçalho, fecho ou assinaturas ao meio.
  const numberedLines = useMemo(() => lines.filter((line) => line.numbered), [lines]);

  // Cada página impressa é a fatia [offset, offset + height) do fluxo contínuo.
  const pageSlices = useMemo(() => {
    const offsets = computePageOffsets(lines);

    return offsets.map((offset, index) => ({
      offset,
      height: (offsets[index + 1] ?? offset + PAGE_CONTENT_HEIGHT) - offset,
    }));
  }, [lines]);

  return (
    <div className="preview-sheet-wrap">
      {/* Com numeração, a impressão precisa sair 1:1 com o preview (A4 cheio,
          margens vindo do padding da folha) para os números baterem com as linhas. */}
      {numerarLinhas ? <style>{'@page { size: A4; margin: 0; }'}</style> : null}

      <section
        id="documentPreview"
        className={`preview-sheet abnt-page${numerarLinhas ? ' with-line-numbers' : ''}`}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        aria-label="Pré-visualização do documento"
      >
        <div className="doc-body" ref={bodyRef}>
          {content}
          {numerarLinhas ? <LineNumbers lines={numberedLines} /> : null}
        </div>

        {/* Só na impressão: cada página é uma fatia exata do fluxo do preview,
            cortada entre linhas. Nada reflui, então os números não desalinham. */}
        {numerarLinhas && lines.length > 0 ? (
          <div className="print-pages" aria-hidden="true">
            {pageSlices.map(({ offset, height }) => (
              <div className="print-page" key={offset}>
                <div className="print-page__clip" style={{ height: `${height}px` }}>
                  <div className="print-page__flow" style={{ marginTop: `${-offset}px` }}>
                    {content}
                    <LineNumbers lines={numberedLines} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function LineNumbers({ lines }: { lines: LineRect[] }) {
  if (lines.length === 0) return null;

  return (
    <div className="doc-line-numbers">
      {lines.map((line, index) => (
        <span
          key={`${line.top}-${index}`}
          style={{
            top: `${line.top}px`,
            height: `${line.height}px`,
            lineHeight: `${line.height}px`,
          }}
        >
          {`${index + 1} -`}
        </span>
      ))}
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
    troncoSuprimido,
    ordemDia,
    pbo,
    pboSuprimido,
    lojaConfig,
    lojasConjunta,
    balaustreTexto,
    atosDecretosTexto,
    expedientesTexto,
    bolsaPropostas,
  } = data;

  const { dia, mes, ano, anoVLFormatado } = getPreviewDateParts(sessionConfig.dataISO);
  const isMagna = sessionType === 'magna';
  const isConjunta = sessionConfig.conjunta;
  const sessionTypeMeta = getSessionTypeMeta(sessionType, isConjunta);

  const lojasConj = isConjunta ? lojasConjunta : [];
  const sufixoLojasConjunta = gerarSufixoLojasConjunta(lojasConj);
  const textoPresenca = gerarTextoPresenca(sessionConfig.numPresenca, visitors, lojasConj);
  const textoSaudacao = gerarTextoSaudacao(visitors, officers.or);
  const pboEntries = formatPalavraBemOrdemEntries(pbo);
  const [bolsaAbertura, ...bolsaComplementos] = gerarTextoBolsaPropostas(bolsaPropostas);

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

      {/* Só o corpo da ata é numerado: da abertura até o encerramento.
          Cabeçalho, título, fecho e assinaturas ficam fora da contagem. */}
      <div className="doc-numbered">
        <p>
          À G∴ D∴ G∴ A∴ D∴ U∴ e de São João, nosso Padroeiro, ao {FORMAT.ordinal(dia)} dia do mês de{' '}
          {mes} do ano de {ano}, às {sessionConfig.horaInicio}h, reuniu-se no{' '}
          {lojaConfig.temploNome} na {lojaConfig.enderecoTemplo}, Oriente de{' '}
          {lojaConfig.cidadeEstado}, a {lojaConfig.nomeLoja} nº {lojaConfig.numeroLoja}
          {sufixoLojasConjunta}, no grau de <strong>{sessionConfig.grau} de Maçom</strong>,{' '}
          {textoPresenca}
        </p>

        <p>
          Os trabalhos foram dirigidos pelo V∴ M∴ <strong>{officers.vm}</strong>, 1º Vig∴{' '}
          <strong>{officers.vig1}</strong>, e 2º Vig∴ <strong>{officers.vig2}</strong>. Tendo como
          Or∴ <strong>{officers.or}</strong> e Sec∴ <strong>{officers.sec}</strong>.
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
          <strong>BALAÚSTRE:</strong> {hasText(balaustreTexto) ? balaustreTexto : BALAUSTRE_PADRAO}
        </p>

        <p className="no-indent">
          <strong>ATOS E DECRETOS:</strong>{' '}
          {hasText(atosDecretosTexto) ? atosDecretosTexto : ATOS_DECRETOS_PADRAO}
        </p>
        <p className="no-indent">
          <strong>EXPEDIENTES:</strong>{' '}
          {hasText(expedientesTexto) ? expedientesTexto : EXPEDIENTE_PADRAO}
        </p>

        <p className="no-indent">
          <strong>BOLSA DE PROPOSTAS E INFORMAÇÕES:</strong> {bolsaAbertura}
        </p>

        {/* O acréscimo livre da bolsa é lavrado em parágrafo próprio, sem recuo,
            alinhado com as demais seções do balaústre. */}
        {bolsaComplementos.map((complemento) => (
          <p className="no-indent" key={complemento}>
            {complemento}
          </p>
        ))}

        <p className="no-indent">
          <strong>ORDEM DO DIA:</strong> {ordemDia}
        </p>

        {isMagna && hasText(magnaFields.atoEspecial) ? (
          <p className="no-indent">
            <strong>ATO ESPECIAL:</strong> {magnaFields.atoEspecial}
          </p>
        ) : null}

        <p className="no-indent">
          <strong>BOLSA DE BENEFICÊNCIA:</strong>{' '}
          {troncoSuprimido ? (
            TRONCO_SUPRIMIDO_TEXTO
          ) : (
            <>
              Depois do anúncio feito pelo V∴ M∴ e VVig∴, o Ir∴ Hosp∴ circulou com a Bolsa.
              Arrecadou{' '}
              <strong>
                {String(tronco)} ({FORMAT.extenso(tronco)}) medalhas cunhadas
              </strong>
              , debitados a Tes∴ e creditados a Hosp∴.
            </>
          )}
        </p>

        <p className="no-indent">
          <strong>SAUDAÇÃO AOS VISITANTES:</strong> {textoSaudacao}
        </p>

        <p className="no-indent">
          <strong>PALAVRA A BEM DA ORDEM:</strong>{' '}
          {pboSuprimido ? PBO_SUPRIMIDO_TEXTO : 'A palavra circulou da seguinte forma:'}
        </p>

        {pboSuprimido
          ? null
          : pboEntries.map((entry) => (
              <div key={entry.key} className="pbo-block">
                <strong>{entry.label}:</strong> {entry.value}
              </div>
            ))}

        <p className="no-indent">
          <strong>ENCERRAMENTO:</strong> O encerramento ocorreu às {sessionConfig.horaEnc}h, na sua
          forma ritualística, e eu, <strong>{officers.sec}</strong>, Sec∴, lavrei o presente
          balaústre longe das vistas e indiscrições Profanas, que depois de decifrado e aprovado
          pela Augusta Assembleia, será assinado por quem de direito.
        </p>
      </div>

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
