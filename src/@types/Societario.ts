export interface TipoProcesso {
    id: string;
    descricao: string;
    // Add any other properties specific to tipo_processo
  }

  
  
  export interface SocietarioData {
    nome?: string;
    descricao: string;
    id: string;
    registro_inicial?: string;
    contabilidade_id?: string;
    tipo_processo?: TipoProcesso[]; // Add this line
    // Add other fields as needed
  }
  
  export interface CreateSocietarioParams {
    nome?: string;
    registro_inicial?: string;
    contabilidade_id?: string;
    tipo_processo_id?: string;
  }
  
  export interface SocietarioListResponse {
    results: SocietarioData[];
    count: number;
  }

  export interface Etapa {
    id: string;
    nome: string;
    ordem: number;
  }
  
  export interface EtapasResponse {
    etapas: Etapa[]; // Reflete a resposta do endpoint `/societario/list-etapas/`
  }
  
  export interface Contabilidade {
    id: string;
    cnpj: string;
    nome: string;
  }
  
  export interface TipoProcesso {
    id: string;
    descricao: string;
  }
  
  export interface Etapa {
    id: string;
    nome: string;
    ordem: number;
  }
  
  export interface Processo {
    id: string;
    nome: string;
    contabilidade: Contabilidade;
    tipo_processo: TipoProcesso;
    etapa_atual: Etapa;
    etapa_inicial: Etapa;
    expire_at: string;
    created_at: string;
  }
  
  export interface ProcessoPorEtapa {
    id: string;
    nome: string;
    ordem: number;
    processos: Processo[];
  }
  
  export interface ProcessosResponse {
    processos_por_etapa: ProcessoPorEtapa[];
  }
  
  export interface Etapa {
    id: string;
    nome: string;
    ordem: number;
}

export interface Tarefa {
    id: string;
    descricao: string;
    obrigatoria: boolean;
}

export interface TarefaDetalhada {
    id: string;
    etapa: Etapa;
    tarefa: Tarefa;
    concluida: boolean;
    sequencia: number;
}

export interface Contabilidade {
    id: string;
    cnpj: string;
    nome: string;
}

export interface TipoProcesso {
    id: string;
    descricao: string;
}

export interface Processo {
    id: string;
    nome: string;
    contabilidade: Contabilidade;
    tipo_processo: TipoProcesso;
    etapa: Etapa;
    tarefas: TarefaDetalhada[];
    created_at: string;
    expire_at: string;
}
