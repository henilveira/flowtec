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