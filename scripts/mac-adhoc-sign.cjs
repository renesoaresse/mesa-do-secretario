/**
 * Hook afterPack do electron-builder.
 *
 * O projeto nao possui certificado Developer ID, entao o electron-builder pula
 * a assinatura (`mac.identity: null`) e o .app fica apenas com a assinatura
 * ad-hoc residual do linker do Electron. Essa assinatura declara recursos que
 * nao estao selados, e o Gatekeeper trata isso como assinatura quebrada,
 * exibindo "o app esta danificado e nao pode ser aberto" em vez de oferecer o
 * caminho normal de "Abrir mesmo assim".
 *
 * Este hook refaz a assinatura ad-hoc corretamente sobre o bundle ja empacotado,
 * antes da geracao do DMG. O app continua sem notarizacao, mas passa a ser
 * abrivel via Ajustes do Sistema > Privacidade e Seguranca.
 */
const { execFileSync } = require('node:child_process')
const path = require('node:path')

exports.default = async function macAdhocSign(context) {
  if (context.electronPlatformName !== 'darwin') return

  const appPath = path.join(
    context.appOutDir,
    `${context.packager.appInfo.productFilename}.app`
  )

  console.log(`  • assinando ad-hoc  app=${appPath}`)
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', appPath], {
    stdio: 'inherit',
  })
  execFileSync('codesign', ['--verify', '--deep', '--strict', appPath], {
    stdio: 'inherit',
  })
}
