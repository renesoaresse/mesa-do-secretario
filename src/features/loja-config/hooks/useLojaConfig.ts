import { useCallback, useState } from 'react';
import { storage } from '../../../services/storage';
import { DEFAULT_LOJA_CONFIG } from '../../../hooks/useAtaState';
import type { LojaConfig } from '../../../types/ata';

export function useLojaConfig() {
  const [savedLojaConfig, setSavedLojaConfig] = useState<LojaConfig>(() =>
    storage.loadLojaConfig(DEFAULT_LOJA_CONFIG),
  );
  const [lojaConfig, setLojaConfig] = useState<LojaConfig>(savedLojaConfig);

  // Edições ficam só em memória: a persistência acontece no "Salvar".
  const updateLojaConfig = useCallback((patch: Partial<LojaConfig>) => {
    setLojaConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const saveLojaConfig = useCallback(() => {
    storage.saveLojaConfig(lojaConfig);
    setSavedLojaConfig(lojaConfig);
  }, [lojaConfig]);

  const isDirty = lojaConfig !== savedLojaConfig;

  return { lojaConfig, updateLojaConfig, saveLojaConfig, isDirty };
}
