import { AppLayout } from '../components/layout/AppLayout';
import { Sidebar } from '../components/layout/Sidebar';
import { MainPreview } from '../components/layout/MainPreview';
import { SidebarHeader } from '../components/layout/SidebarHeader';
import { SessionIndicator } from '../features/session/components/SessionIndicator';
import { AutoSaveToast } from '../components/ui/AutoSaveToast';
import { SidebarContent } from '../components/layout/SidebarContent';
import { useAtaState } from '../hooks/useAtaState';

export function AppEditor() {
  const state = useAtaState();
  const runtimeMode =
    typeof window !== 'undefined' && window.electronAPI ? 'desktop-secure' : 'web';

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
              sessionType={state.sessionType}
              onSessionTypeChange={(t) => {
                state.setSessionType(t);
                state.markChanged();
              }}
              sessionConfig={state.sessionConfig}
              onSessionConfigChange={state.updateSessionConfig}
              magnaFields={state.magnaFields}
              onMagnaFieldsChange={state.updateMagnaFields}
              visitors={state.visitors}
              onAddVisitor={state.addVisitor}
              onRemoveVisitor={state.removeVisitor}
              officers={state.officers}
              onOfficersChange={state.updateOfficers}
              tronco={state.tronco}
              onTroncoChange={state.setTronco}
              ordemDia={state.ordemDia}
              onOrdemDiaChange={state.setOrdemDia}
              pbo={state.pbo}
              onPboChange={state.updatePbo}
              onPrint={state.handlePrint}
              onSave={state.handleSave}
              lastSavedAt={state.lastSavedAt}
              lojaConfig={state.lojaConfig}
              onLojaConfigChange={state.updateLojaConfig}
              balaustreTexto={state.balaustreTexto}
              onBalaustreTextoChange={state.setBalaustreTexto}
              atosDecretosTexto={state.atosDecretosTexto}
              onAtosDecretosTextoChange={state.setAtosDecretosTexto}
              expedientesTexto={state.expedientesTexto}
              onExpedientesTextoChange={state.setExpedientesTexto}
              bolsaPropostasTexto={state.bolsaPropostasTexto}
              onBolsaPropostasTextoChange={state.setBolsaPropostasTexto}
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
