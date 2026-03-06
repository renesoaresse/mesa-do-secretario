import React, { useMemo } from "react";
import type { PreviewData, DocumentType, Documento } from "../../types/ata";

type Props = {
  zoom: number;
  data: PreviewData;
};

export function DocumentPreview({ zoom, data }: Props) {
  const html = useMemo(() => generateAtaHtml(data), [data]);

  return (
    <div className="preview-sheet-wrap">
      <section
        id="documentPreview"
        className="preview-sheet abnt-page"
        style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
        aria-label="Pré-visualização do documento"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

/* =========================================================
   HTML generator (baseado no index.html)
========================================================= */

function generateAtaHtml(data: PreviewData): string {
  const {
    sessionType,
    sessionConfig,
    magnaFields,
    documents,
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

  const dateObj = sessionConfig?.dataISO ? new Date(`${sessionConfig.dataISO}T12:00:00`) : new Date();
  const dia = dateObj.getDate();
  const mes = FORMAT.meses[dateObj.getMonth()];
  const ano = dateObj.getFullYear();
  const anoVL = ano + 4000;
  const anoVLFormatado = `6.${String(anoVL - 6000).padStart(3, "0")}`;

  const isMagna = sessionType === "magna";
  const isConjunta = sessionType === "conjunta";

  const sessionTypeClass = isMagna ? "magna" : isConjunta ? "conjunta" : "economica";
  const sessionTypeText = isMagna ? "MAGNA" : isConjunta ? "CONJUNTA" : "ECONÔMICA";

  const textoPresenca = gerarTextoPresenca(sessionConfig.numPresenca, visitors);
  const textoSaudacao = gerarTextoSaudacao(visitors, officers.or);


    const headerHtml = `
    <div class="doc-top">
      ${
        lojaConfig.logoDataUrl
          ? `<div class="doc-top__logo">
               <img class="doc-top__logo-img" src="${lojaConfig.logoDataUrl }" alt="Logo da Loja" />
             </div>`
          : `<div class="doc-top__logo doc-top__logo--empty"></div>`
      }

      <div class="doc-top__box">
        <div class="doc-top__text">
          À&nbsp;&nbsp; G∴&nbsp; D∴&nbsp; G∴&nbsp; A∴&nbsp; D∴&nbsp; U∴<br>
          ${escapeHtml(lojaConfig.nomeLoja.toUpperCase() || "")} Nº ${escapeHtml(lojaConfig.numeroLoja) || ""}<br>
          ${lojaConfig.dataFundacaoISO ? `FUNDADA EM ${escapeHtml(formatDateBR(lojaConfig.dataFundacaoISO).toUpperCase() || "")}<br>` : ""}
          JURISDICIONADA À GRANDE LOJA DO ESTADO DE SERGIPE<br>
          OR∴ DE ${escapeHtml(lojaConfig.cidadeEstado.toUpperCase() || "")}
        </div>
      </div>
    </div>

    <div class="doc-top__rule"></div>
  `;

  let html = `
    ${headerHtml}

    <div class="title-center ${sessionTypeClass}">
      SESSÃO ${sessionTypeText} DE ${escapeHtml(sessionConfig.grau.toUpperCase())} DE MAÇOM Nº ${escapeHtml(
        String(sessionConfig.numSessao) || ""
      )}<br>
      REALIZADA NO DIA ${FORMAT.pad(dia)} DE ${escapeHtml(mes.toUpperCase())} DE ${ano}
    </div>
  `;

  // Tema (Magna)
  if (isMagna && magnaFields.tema?.trim()) {
    html += `
      <p class="center-italic">
        Tema: "${escapeHtml(magnaFields.tema || "")}"
      </p>
    `;
  }

  html += `
    <p>
      À Glória do G∴ D∴ G∴ A∴ D∴ U∴ e de São João, nosso Padroeiro, ao ${escapeHtml(FORMAT.ordinal(dia) || "")}
      dia do mês de ${escapeHtml(mes) || ""} do ano de ${ano}, às ${escapeHtml(sessionConfig.horaInicio)}h,
      reuniu-se no ${lojaConfig.temploNome || ""} na ${lojaConfig.enderecoTemplo || ""},
      Oriente de ${lojaConfig.cidadeEstado || ""}, a ${lojaConfig.nomeLoja || ""} nº ${lojaConfig.numeroLoja || ""},
      no grau de <strong>${escapeHtml(sessionConfig.grau || "")} de Maçom</strong>, ${textoPresenca || ""}
    </p>

    <p>
      Os trabalhos foram dirigidos pelo V∴ M∴ <strong>${escapeHtml(officers.vm || "")}</strong>,
      1º Vig∴ <strong>${escapeHtml(officers.vig1 || "")}</strong>, e
      2º Vig∴ <strong>${escapeHtml(officers.vig2 || "")}</strong>.
      Tendo como Or∴ <strong>${escapeHtml(officers.or || "")}</strong> e
      Sec∴ <strong>${escapeHtml(officers.sec || "")}</strong>.
    </p>
  `;

  // Autoridades (Magna)
  if (isMagna && magnaFields.autoridades?.trim()) {
    html += `
      <p class="no-indent">
        <strong>AUTORIDADES PRESENTES:</strong> ${escapeHtml(magnaFields.autoridades || "")}
      </p>
    `;
  }

  // Orador convidado (Magna)
  if (isMagna && magnaFields.oradorConvidado?.trim()) {
    html += `
      <p class="no-indent">
        <strong>ORADOR CONVIDADO:</strong> A sessão contou com a presença do ilustre Ir∴
        <strong>${escapeHtml(magnaFields.oradorConvidado || "")}</strong>, que proferiu brilhante palestra sobre o tema da sessão.
      </p>
    `;
  }

  html += `
    <p class="no-indent"><strong>BALAÚSTRE:</strong> ${escapeHtml(balaustreTexto || "")}</p>

    <p class="no-indent"><strong>ATOS E DECRETOS:</strong> ${escapeHtml(atosDecretosTexto || "")} </p>
    <p class="no-indent"><strong>EXPEDIENTES:</strong> ${escapeHtml(expedientesTexto || "")}</p>

    <p class="no-indent"><strong>BOLSA DE PROPOSTAS E INFORMAÇÕES:</strong>${escapeHtml(bolsaPropostasTexto || "")}</p>

    <p class="no-indent"><strong>ORDEM DO DIA:</strong> ${escapeHtml(ordemDia)}</p>
  `;

  // Ato especial (Magna)
  if (isMagna && magnaFields.atoEspecial?.trim()) {
    html += `
      <p class="no-indent"><strong>ATO ESPECIAL:</strong> ${escapeHtml(magnaFields.atoEspecial)}</p>
    `;
  }

  html += `
    <p class="no-indent"><strong>BOLSA DE BENEFICÊNCIA:</strong> Depois do anúncio feito pelo V∴ M∴ e VVig∴, o Ir∴ Hosp∴ circulou com a Bolsa.
    Arrecadou <strong>${escapeHtml(String(tronco))} (${escapeHtml(FORMAT.extenso(tronco))}) medalhas cunhadas</strong>, debitados a Tes∴ e creditados a Hosp∴.</p>

    <p class="no-indent"><strong>SAUDAÇÃO AOS VISITANTES:</strong> ${textoSaudacao}</p>

    <p class="no-indent"><strong>PALAVRA A BEM DA ORDEM:</strong> A palavra circulou da seguinte forma:</p>
    ${formatarPalavraBemOrdem(pbo)}

    <p class="no-indent"><strong>ENCERRAMENTO:</strong> O encerramento ocorreu às ${escapeHtml(sessionConfig.horaEnc)}h, na sua forma ritualística, e eu,
    <strong>${escapeHtml(officers.sec)}</strong>, Sec∴, lavrei o presente balaústre longe das vistas e indiscrições Profanas,
    que depois de decifrado e aprovado pela Augusta Assembleia, será assinado por quem de direito.</p>

    <p class="center-small">
      Or∴ de ${lojaConfig.cidadeEstado}, ao ${escapeHtml(FORMAT.ordinal(dia))} dia do mês de ${escapeHtml(mes)}
      do ano de ${ano} da E∴ V∴ e ${escapeHtml(anoVLFormatado)} da V∴ L∴
    </p>

    <div class="signatures">
      <div class="sig-line sig-line--half">
        <strong>${escapeHtml(officers.vm)}</strong><br>Venerável Mestre
      </div>
      <div class="sig-line sig-line--half">
        <strong>${escapeHtml(officers.or)}</strong><br>Orador
      </div>
      <div class="sig-line sig-line--full">
        <strong>${escapeHtml(officers.sec)}</strong><br>Secretário
      </div>
    </div>
  `;

  return html;
}

/* =========================================================
   Blocks / formatting
========================================================= */

function formatarPalavraBemOrdem(palavraData: PreviewData["pbo"]) {
  const partes: string[] = [];

  if (palavraData.sul?.trim()) {
    partes.push(
      `<div class="pbo-block"><strong>Coluna do Sul:</strong> ${escapeHtml(palavraData.sul)}</div>`
    );
  }

  if (palavraData.norte?.trim()) {
    partes.push(
      `<div class="pbo-block"><strong>Coluna do Norte:</strong> ${escapeHtml(palavraData.norte)}</div>`
    );
  }

  if (palavraData.oriente?.trim()) {
    partes.push(
      `<div class="pbo-block"><strong>Oriente:</strong> ${escapeHtml(palavraData.oriente)}</div>`
    );
  }

  if (partes.length === 0) {
    return `<p class="pbo-empty">A palavra circulou nas colunas e no oriente. Reinou a paz e a harmonia.</p>`;
  }

  return partes.join("");
}

function gerarTextoPresenca(presenca: number, visitors: string[]) {
  if (visitors.length === 0) {
    return `contando com a presença de ${escapeHtml(FORMAT.pad(presenca))} (${escapeHtml(
      FORMAT.extenso(presenca)
    )}) IIr∴ do quadro, que assinaram o Livro de Presença.`;
  }

  const pluralVisitantes = visitors.length > 1;

  return `contando com a presença de ${escapeHtml(FORMAT.pad(presenca))} (${escapeHtml(
    FORMAT.extenso(presenca)
  )}) IIr∴ do quadro, e ${escapeHtml(FORMAT.pad(visitors.length))} (${escapeHtml(
    FORMAT.extenso(visitors.length)
  )}) ${pluralVisitantes ? "IIr∴ visitantes" : "Ir∴ visitante"} que assinaram o Livro de Presença.`;
}

function gerarTextoSaudacao(visitors: string[], orador: string) {
  if (visitors.length === 0) return "Foi suprimido por não ter visitantes.";

  const plural = visitors.length > 1;
  const primeiroNomeOrador = (orador || "").trim().split(/\s+/)[0] || "Orador";
  const visitantesTexto = visitors.map(escapeHtml).join(", ");

  return `O Ir∴ Or∴ ${escapeHtml(primeiroNomeOrador)} saudou ${
    plural ? "os nossos IIr∴ visitantes" : "o nosso Ir∴ visitante"
  } ${visitantesTexto}, na forma ritualística.`;
}

function formatarDocumentos(docs: Documento[], tipo: DocumentType) {
  const filtrados = docs.filter((d) => d.type === tipo);

  if (filtrados.length === 0) return "Não Houve.";
  if (filtrados.length === 1) return `${escapeHtml(formatDocText(filtrados[0]))}.`;

  const parts = filtrados.map((d, i) => {
    const txt = escapeHtml(formatDocText(d));
    if (i === filtrados.length - 1) return `e ${txt}`;
    return txt;
  });

  return `${parts.join("; ")}.`;
}

function formatDocText(d: Documento) {
  // mesmo padrão descritivo do index (type + nº + origem + assunto)
  let text = `${d.type}`;
  if (d.number) text += ` nº ${d.number}`;
  if (d.origin) text += `, oriundo de ${d.origin}`;
  if (d.subject) text += `, tratando de: ${d.subject}`;
  return text;
}

/* =========================================================
   Utils
========================================================= */

function escapeHtml(input: string) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const FORMAT = {
  meses: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],

  pad(n: number) {
    const x = Number.isFinite(n) ? n : 0;
    return String(x).padStart(2, "0");
  },

  ordinal(n: number) {
    const ordinais: Record<number, string> = {
      1: "Primeiro",
      2: "Segundo",
      3: "Terceiro",
      4: "Quarto",
      5: "Quinto",
      6: "Sexto",
      7: "Sétimo",
      8: "Oitavo",
      9: "Nono",
      10: "Décimo",
      20: "Vigésimo",
      30: "Trigésimo",
      40: "Quadragésimo",
      50: "Quinquagésimo",
    };

    if (ordinais[n]) return ordinais[n];
    if (n > 10 && n < 20) return `Décimo ${FORMAT.ordinal(n - 10)}`;
    if (n > 20 && n < 30) return `Vigésimo ${FORMAT.ordinal(n - 20)}`;
    if (n > 30 && n < 40) return `Trigésimo ${FORMAT.ordinal(n - 30)}`;
    return `${n}º`;
  },

  extenso(n: number) {
    const num = Math.max(0, Math.floor(Number(n) || 0));
    if (num === 0) return "zero";
    if (num === 100) return "cem";

    const u = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
    const d10 = ["dez", "onze", "doze", "treze", "catorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
    const dz = ["", "dez", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
    const c = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

    let r = "";

    const cen = Math.floor(num / 100);
    const rest = num % 100;
    const dez = Math.floor(rest / 10);
    const uni = rest % 10;

    if (cen > 0) {
      r += c[cen];
      if (rest > 0) r += " e ";
    }

    if (rest >= 10 && rest <= 19) {
      r += d10[rest - 10];
      return r.trim();
    }

    if (dez > 0) {
      r += dz[dez];
      if (uni > 0) r += " e ";
    }
    if (uni > 0) r += u[uni];

    return r.trim() || "zero";
  },
};

function formatDateBR(iso: string) {
  // espera YYYY-MM-DD
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const monthIndex = Number(m) - 1;
  if (monthIndex < 0 || monthIndex > 11) return iso;

  return `${Number(d)} de ${meses[monthIndex]} de ${y}`;
}