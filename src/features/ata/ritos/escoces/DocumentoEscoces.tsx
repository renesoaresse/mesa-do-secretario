import { comSufixoAdHoc } from '../../../loja-config/data/oficiais';
import { CabecalhoLoja } from '../../components/CabecalhoLoja';
import type { DocumentoAtaProps } from '../../types';
import {
  ATOS_DECRETOS_PADRAO,
  BALAUSTRE_PADRAO,
  EXPEDIENTE_PADRAO,
  FORMAT,
  formatPalavraBemOrdemEntries,
  gerarPartesSaudacao,
  gerarSufixoLojasConjunta,
  gerarTextoBolsaPropostas,
  gerarTextoPresenca,
  getPreviewDateParts,
  getSessionTypeMeta,
  hasText,
  pboSuprimidoTexto,
  tratamentosDoGrau,
  tratarCargo,
  troncoSuprimidoTexto,
  type PartesSaudacao,
} from '../../../preview/components/documentPreviewText';

// O nome do Orador vai em negrito no meio da frase; a saudação suprimida não tem nome.
function TextoSaudacao({ saudacao }: { saudacao: PartesSaudacao }) {
  if (!saudacao.orador) return <>{saudacao.prefixo}</>;

  return (
    <>
      {saudacao.prefixo}
      <strong>{saudacao.orador}</strong>
      {saudacao.complemento}
    </>
  );
}

/**
 * Documento do Rito Escocês Antigo e Aceito: é a forma completa da ata e serve
 * de modelo padrão para os demais ritos enquanto cada ritual não diverge.
 */
export function DocumentoEscoces({ data }: DocumentoAtaProps) {
  const {
    sessionType,
    sessionConfig,
    magnaFields,
    visitors,
    officers: oficiaisDaSessao,
    oficiaisAdHoc,
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

  // No REAA a marca de ad hoc vem colada ao nome do Ir∴, no corpo e nas assinaturas.
  const officers = {
    ...oficiaisDaSessao,
    or: comSufixoAdHoc(oficiaisDaSessao.or, oficiaisAdHoc.includes('or')),
    sec: comSufixoAdHoc(oficiaisDaSessao.sec, oficiaisAdHoc.includes('sec')),
  };

  const tratamentos = tratamentosDoGrau(sessionConfig.grau);
  const lojasConj = isConjunta ? lojasConjunta : [];
  const sufixoLojasConjunta = gerarSufixoLojasConjunta(lojasConj);
  const textoPresenca = gerarTextoPresenca(
    sessionConfig.numPresenca,
    visitors,
    lojasConj,
    tratamentos,
  );
  const saudacao = gerarPartesSaudacao(visitors, officers.or, tratamentos);
  const pboEntries = formatPalavraBemOrdemEntries(pbo);
  const [bolsaAbertura, ...bolsaComplementos] = gerarTextoBolsaPropostas(
    bolsaPropostas,
    tratamentos,
  );

  return (
    <>
      <CabecalhoLoja lojaConfig={lojaConfig} />

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
          Os trabalhos foram dirigidos pelo {tratamentos.vm} <strong>{officers.vm}</strong>, 1º{' '}
          {tratamentos.vig} <strong>{officers.vig1}</strong>, e 2º {tratamentos.vig}{' '}
          <strong>{officers.vig2}</strong>. Tendo como{' '}
          {tratarCargo('Or∴', tratamentos.prefixoCargo)} <strong>{officers.or}</strong> e{' '}
          {tratarCargo('Sec∴', tratamentos.prefixoCargo)} <strong>{officers.sec}</strong>.
        </p>

        {isMagna && hasText(magnaFields.autoridades) ? (
          <p className="no-indent">
            <strong>AUTORIDADES PRESENTES:</strong> {magnaFields.autoridades}
          </p>
        ) : null}

        {isMagna && hasText(magnaFields.oradorConvidado) ? (
          <p className="no-indent">
            <strong>ORADOR CONVIDADO:</strong> A sessão contou com a presença do ilustre{' '}
            {tratamentos.irmao} <strong>{magnaFields.oradorConvidado}</strong>, que proferiu
            brilhante palestra sobre o tema da sessão.
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
            troncoSuprimidoTexto(tratamentos)
          ) : (
            <>
              Depois do anúncio feito pelo {tratamentos.vm} e {tratamentos.vigs}, o{' '}
              {tratamentos.irmao} Hosp∴ circulou com a Bolsa. Arrecadou{' '}
              <strong>
                {String(tronco)} ({FORMAT.extenso(tronco)}) medalhas cunhadas
              </strong>
              , debitados a Tes∴ e creditados a Hosp∴.
            </>
          )}
        </p>

        <p className="no-indent">
          <strong>SAUDAÇÃO AOS VISITANTES:</strong> <TextoSaudacao saudacao={saudacao} />
        </p>

        <p className="no-indent">
          <strong>PALAVRA A BEM DA ORDEM:</strong>{' '}
          {pboSuprimido ? pboSuprimidoTexto(tratamentos) : 'A palavra circulou da seguinte forma:'}
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
          forma ritualística, e eu, <strong>{officers.sec}</strong>,{' '}
          {tratarCargo('Sec∴', tratamentos.prefixoCargo)}, lavrei o presente balaústre longe das
          vistas e indiscrições Profanas, que depois de decifrado e aprovado pela Augusta
          Assembleia, será assinado por quem de direito.
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
          {tratamentos.vmExtenso}
        </div>
        <div className="sig-line sig-line--half">
          <strong>{officers.or}</strong>
          <br />
          {tratarCargo('Orador', tratamentos.prefixoCargoExtenso)}
        </div>
        <div className="sig-line sig-line--full">
          <strong>{officers.sec}</strong>
          <br />
          {tratarCargo('Secretário', tratamentos.prefixoCargoExtenso)}
        </div>
      </div>
    </>
  );
}
