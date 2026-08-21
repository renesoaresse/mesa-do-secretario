import { useLocation } from 'wouter';
import { AppLayout } from '../components/layout/AppLayout';
import { Sidebar } from '../components/layout/Sidebar';
import { MainPreview } from '../components/layout/MainPreview';
import { SidebarHeader } from '../components/layout/SidebarHeader';
import { SessionIndicator } from '../features/session/components/SessionIndicator';
import { AutoSaveToast } from '../components/ui/AutoSaveToast';
import { SidebarContent } from '../components/layout/SidebarContent';
import { useAtaState } from '../hooks/useAtaState';
import { useLojas } from '../features/loja-config';
import { useQuadroDaGestao } from '../features/loja-config/hooks/useQuadroDaGestao';
import { ROUTES } from '../router/index';

export function AppEditor() {
  const state = useAtaState();
  const { lojas, addLoja } = useLojas();
  const { obreiros, titulares } = useQuadroDaGestao(state.lojaConfig.rito);
  const [, navigate] = useLocation();
  const isDesktop = typeof window !== 'undefined' && window.electronAPI !== undefined;
  const runtimeMode = isDesktop ? 'desktop-secure' : 'web';

  return (
    <div data-runtime={runtimeMode}>
      <AppLayout
        sidebar={
          <Sidebar
            header={
              <SidebarHeader
                title="Gerador de Ata"
                badgeText={<SessionIndicator sessionType={state.sessionType} />}
                counterText={`Contador: ${state.sessionConfig.numSessao} - v${__APP_VERSION__}`}
              />
            }
            footer={<AutoSaveToast visible={state.autoSaveVisible} />}
          >
            <SidebarContent
              onBack={isDesktop ? () => navigate(ROUTES.HOME) : undefined}
              sessionType={state.sessionType}
              onSessionTypeChange={(t) => {
                state.setSessionType(t);
                state.markChanged();
              }}
              sessionConfig={state.sessionConfig}
              onSessionConfigChange={state.updateSessionConfig}
              lojas={lojas}
              obreiros={obreiros}
              titulares={titulares}
              lojasConjunta={state.lojasConjunta}
              onAddLojaConjunta={state.addLojaConjunta}
              onRemoveLojaConjunta={state.removeLojaConjunta}
              onSetObreirosConjunta={state.setObreirosConjunta}
              onCreateLoja={addLoja}
              magnaFields={state.magnaFields}
              onMagnaFieldsChange={state.updateMagnaFields}
              visitors={state.visitors}
              onAddVisitor={state.addVisitor}
              onRemoveVisitor={state.removeVisitor}
              officers={state.officers}
              onOfficersChange={state.updateOfficers}
              tronco={state.tronco}
              onTroncoChange={state.setTronco}
              troncoSuprimido={state.troncoSuprimido}
              onTroncoSuprimidoChange={state.setTroncoSuprimido}
              ordemDia={state.ordemDia}
              onOrdemDiaChange={state.setOrdemDia}
              pbo={state.pbo}
              onPboChange={state.updatePbo}
              pboSuprimido={state.pboSuprimido}
              onPboSuprimidoChange={state.setPboSuprimido}
              onPrint={state.handlePrint}
              onSave={state.handleSave}
              lastSavedAt={state.lastSavedAt}
              lojaConfig={state.lojaConfig}
              balaustreTexto={state.balaustreTexto}
              onBalaustreTextoChange={state.setBalaustreTexto}
              atosDecretosTexto={state.atosDecretosTexto}
              onAtosDecretosTextoChange={state.setAtosDecretosTexto}
              expedientesTexto={state.expedientesTexto}
              onExpedientesTextoChange={state.setExpedientesTexto}
              bolsaPropostas={state.bolsaPropostas}
              onBolsaPropostasChange={state.updateBolsaPropostas}
              onAddBolsaProposta={state.addBolsaProposta}
              onRemoveBolsaProposta={state.removeBolsaProposta}
            />
          </Sidebar>
        }
        main={
          <MainPreview
            sessionType={state.sessionType}
            zoom={state.zoom}
            onZoomChange={state.setZoom}
            dataDocument={state.previewData}
          />
        }
      />
    </div>
  );
}
