export const API_ENDPOINTS = {
  contabilidades: {
    list: "/contabilidades/list-contabilidades/",
    create: "/contabilidades/create-contabilidade/",
  },
  accounts: {
    login: "/accounts/token/",
    logout: "/accounts/token/logout/",
    updateUser: "/accounts/update-user/",
  },
  societario: {
    listEtapas: "/societario/list-etapas/",
    getProcesso: (id: string) => `/societario/get-processo/?processo_id=${id}`,
    listTipoProcessos: "/societario/list-tipo-processo/",
    listProcessosEtapas: "/societario/list-processos-etapas/",
    createProcesso: "/societario/create-processo/",
    updateProcesso: "/societario/update-processo/",
    deleteProcesso: (id: string) => `/societario/${id}/`,
  },
};
