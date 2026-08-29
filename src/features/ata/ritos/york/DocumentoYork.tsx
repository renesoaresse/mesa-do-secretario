import type { Officers, PreviewData } from '../../../../types/ata';
import { comSufixoAdHoc } from '../../../loja-config/data/oficiais';
import {
  FORMAT,
  getPreviewDateParts,
  getSessionTypeMeta,
  hasText,
} from '../../../preview/components/documentPreviewText';
import { CabecalhoLoja } from '../../components/CabecalhoLoja';
import type { DocumentoAtaProps } from '../../types';
import {
  ATOS_PADRAO,
  DECRETOS_PADRAO,
  EXPEDIENTES_PADRAO,
  LEITURA_ATAS_PADRAO,
  PRANCHAS_PADRAO,
  gerarFechoPresenca,
  gerarTextoPalavraBemOrdem,
  gerarTextoQuadro,
  gerarTextoSaudacao,
  gerarTextoTronco,
  gerarTextoVisitantes,
  CARGO_POR_EXTENSO,
  gerarTitulo,
} from './documentoYorkText';

/** As autoridades e o orador convidado só entram na ata da sessão magna. */
function AberturaMagna({ magnaFields }: { magnaFields: PreviewData['magnaFields'] }) {
  return (
    <>
      {hasText(magnaFields.autoridades) ? (
        <p className="no-indent">
          <strong>AUTORIDADES PRESENTES:</strong> {magnaFields.autoridades}
        </p>
      ) : null}

      {hasText(magnaFields.oradorConvidado) ? (
        <p className="no-indent">
          <strong>ORADOR CONVIDADO:</strong> A sessão contou com a presença do ilustre Irmão{' '}
          <strong>{magnaFields.oradorConvidado}</strong>, que proferiu brilhante palestra sobre o
          tema da sessão.
        </p>
      ) : null}
    </>
  );
}

/**
 * Documento do Rito de York: a ata é escrita por extenso, em seções nomeadas,
 * com as pranchas, os atos e os decretos em blocos próprios. A palavra a bem da
 * Ordem é texto corrido, sem as colunas, e o tronco entra pelo total apurado.
 */
export function DocumentoYork({ data }: DocumentoAtaProps) {
  const {
    sessionType,
    sessionConfig,
    magnaFields,
    visitors,
    officers,
    oficiaisAdHoc,
    tronco,
    troncoSuprimido,
    ordemDia,
    pboTexto,
    pboSuprimido,
    lojaConfig,
    lojasConjunta,
    pranchasTexto,
    atosTexto,
    decretosTexto,
    leituraAtasTexto,
    expedientesTexto,
  } = data;

  const { dia, mes, ano, anoVLFormatado } = getPreviewDateParts(sessionConfig.dataISO);
  const isMagna = sessionType === 'magna';
  const isConjunta = sessionConfig.conjunta;
  const sessionTypeMeta = getSessionTypeMeta(sessionType, isConjunta);
  const mesExtenso = mes.toLocaleLowerCase('pt-BR');
  const dataPorExtenso = `${dia} de ${mesExtenso} de ${ano} da Era Vulgar e ${anoVLFormatado} da Verdadeira Luz`;

  const textoQuadro = gerarTextoQuadro(sessionConfig.numPresenca, isConjunta ? lojasConjunta : []);
  const textoVisitantes = gerarTextoVisitantes(visitors);

  const cargo = (oficial: keyof Officers) => CARGO_POR_EXTENSO[oficial];
  // A marca de ad hoc é sufixo do nome: "FULANO DE TAL - ADHOC".
  const nome = (oficial: keyof Officers) =>
    comSufixoAdHoc(officers[oficial], oficiaisAdHoc.includes(oficial));

  return (
    <>
      <CabecalhoLoja lojaConfig={lojaConfig} />

      <div className={`title-center ${sessionTypeMeta.className}`}>
        {gerarTitulo(sessionConfig.grau, sessionConfig.numSessao)}
      </div>

      {isMagna && hasText(magnaFields.tema) ? (
        <p className="center-italic">Tema: "{magnaFields.tema}"</p>
      ) : null}

      <div className="doc-numbered">
        <p>
          À Glória do Grande Arquiteto do Universo, em honra a São João, nosso Padroeiro, e sob os
          auspícios da Mui Respeitável Grande Loja Maçônica do Estado de Sergipe, reuniu-se às{' '}
          <strong>{sessionConfig.horaInicio}h</strong> do dia {dataPorExtenso}, a Augusta e
          Respeitável Loja Maçônica{' '}
          <strong>
            {lojaConfig.nomeLoja} Nº {lojaConfig.numeroLoja}
          </strong>
          , na <strong>{lojaConfig.temploNome}</strong>, situada à {lojaConfig.enderecoTemplo}, no
          Oriente de {lojaConfig.cidadeEstado}. A sessão foi aberta solene e ritualisticamente,
          contando com <strong>{textoQuadro}</strong>
          {textoVisitantes ? (
            <>
              {' '}
              e <strong>{textoVisitantes}</strong>
            </>
          ) : null}
          , {gerarFechoPresenca(visitors.length > 0)}
        </p>

        <p>
          A reunião foi dirigida pelo {cargo('vm')} Irmão <strong>{nome('vm')}</strong>, auxiliado
          pelo {cargo('vig1')} Irmão <strong>{nome('vig1')}</strong>, e pelo {cargo('vig2')} Irmão{' '}
          <strong>{nome('vig2')}</strong>. Tendo como {cargo('tes')} Irmão{' '}
          <strong>{nome('tes')}</strong> e {cargo('sec')} Irmão <strong>{nome('sec')}</strong>.
        </p>

        {isMagna ? <AberturaMagna magnaFields={magnaFields} /> : null}

        <p className="no-indent">
          <strong>PRANCHAS E CORRESPONDÊNCIAS:</strong>{' '}
          {hasText(pranchasTexto) ? pranchasTexto : PRANCHAS_PADRAO}
        </p>

        <p className="no-indent">
          <strong>ATOS:</strong> {hasText(atosTexto) ? atosTexto : ATOS_PADRAO}
        </p>

        <p className="no-indent">
          <strong>DECRETOS:</strong> {hasText(decretosTexto) ? decretosTexto : DECRETOS_PADRAO}
        </p>

        <p className="no-indent">
          <strong>LEITURA DE ATAS ANTERIORES:</strong>{' '}
          {hasText(leituraAtasTexto) ? leituraAtasTexto : LEITURA_ATAS_PADRAO}
        </p>

        <p className="no-indent">
          <strong>SAUDAÇÃO AOS VISITANTES:</strong> {gerarTextoSaudacao(visitors)}
        </p>

        <p className="no-indent">
          <strong>EXPEDIENTES:</strong>{' '}
          {hasText(expedientesTexto) ? expedientesTexto : EXPEDIENTES_PADRAO}
        </p>

        <p className="no-indent">
          <strong>ORDEM DO DIA:</strong> {ordemDia}
        </p>

        <p className="no-indent">
          <strong>PALAVRA A BEM DA ORDEM:</strong>{' '}
          {gerarTextoPalavraBemOrdem(pboTexto, pboSuprimido)}
        </p>

        <p className="no-indent">
          <strong>TRONCO DE BENEFICÊNCIA:</strong> {gerarTextoTronco(tronco, troncoSuprimido)}
        </p>

        {isMagna && hasText(magnaFields.atoEspecial) ? (
          <p className="no-indent">
            <strong>ATO ESPECIAL:</strong> {magnaFields.atoEspecial}
          </p>
        ) : null}

        <p className="no-indent">
          <strong>ENCERRAMENTO:</strong> Nada mais havendo a tratar, o Venerável Mestre deu
          seguimento ao encerramento da sessão no dia {dataPorExtenso} às {sessionConfig.horaEnc}h,
          na forma ritualística. E, para constar, eu, {cargo('sec')} Irmão{' '}
          <strong>{nome('sec')}</strong>, lavrei a presente ata que, depois de lida e aprovada, será
          assinada por quem de direito.
        </p>
      </div>

      <p className="center-small">
        Oriente de {lojaConfig.cidadeEstado}, ao {FORMAT.ordinal(dia)} dia do mês de {mesExtenso} de{' '}
        {ano} da Era Vulgar e {anoVLFormatado} da Verdadeira Luz.
      </p>

      <div className="signatures">
        <div className="sig-line sig-line--half">
          <strong>{nome('vm')}</strong>
          <br />
          {cargo('vm')}
        </div>
        <div className="sig-line sig-line--half">
          <strong>{nome('sec')}</strong>
          <br />
          {cargo('sec')}
        </div>
      </div>
    </>
  );
}
