export interface FormularioDados {
  processo_id: string | null;
  opcoes_nome_empresa: string[];
  nome_fantasia: string;
  endereco: {
    rua: string;
    numero: number;
    bairro: string;
    cep: string;
    municipio: string;
    uf: string;
  };
  inscricao_imob: string;
  telefone: string;
  email: string;
  val_capital_social: number;
  capital_integralizado: boolean; // "True" ou "False"
  data_integralizacao: string; // formato ISO: "YYYY-MM-DD"
  empresa_anexa_resid: boolean; // "True" ou "False"
  endereco_apenas_contato: boolean; // "True" ou "False"
  area_empresa: number;
  info_adicionais: InfoAdicionais;
}

interface InfoAdicionaisTrue {
  resp_tecnica: true;
  nome_responsavel: string;
  nmr_carteira_profissional: string;
  uf: string;
  area_resp: string;
}

interface InfoAdicionaisFalse {
  resp_tecnica: false;
}

type InfoAdicionais = InfoAdicionaisTrue | InfoAdicionaisFalse;

export interface Socios {
  empresa_id: string | null;
  socios: Array<{
    nome: string;
    nacionalidade: string;
    data_nascimento: string;
    estado_civil: string;
    regime_casamento?: string;
    profissao: string;
    cpf: string;
    rg: string;
    orgao_expedidor: string;
    uf: string;
    administrador: boolean;
    tipo_administrador?: string;
    qtd_cotas: number;
    endereco: {
      rua: string;
      numero: number;
      bairro: string;
      cep: string;
      municipio: string;
      complemento: string;
      uf: string;
    };
  }>;
}
export interface GetFormularioResponse {
  formulario?: {
    id?: string;
    processo: string;
    opcoes_nome_empresa: string[];
    nome_fantasia: string;
    inscricao_imob: string;
    telefone: string;
    email: string;
    val_capital_social: number;
    capital_integralizado: boolean;
    data_integralizacao: string;
    empresa_anexa_resid: boolean;
    endereco_apenas_contato: boolean;
    area_empresa: number;
    created_at: string;
    endereco: {
      id?: string;
      rua?: string;
      numero?: string;
      bairro?: string;
      complemento?: string | null;
      cep?: string;
      municipio?: string;
      uf?: string;
    };
    info_adicionais: {
      id?: string;
      resp_tecnica: boolean;
      nome_responsavel?: string;
      nmr_carteira_profissional?: string;
      uf?: string;
      area_resp?: string;
    };
    socios?: Array<{
      id?: string;
      nome: string;
      nacionalidade: string;
      data_nascimento: string;
      estado_civil: string;
      regime_casamento?: string | null;
      profissao: string;
      cpf: string;
      rg: string;
      orgao_expedidor: string;
      uf: string;
      administrador?: boolean;
      tipo_administrador?: string;
      qtd_cotas?: number;
      created_at?: string;
      updated_at?: string;
      endereco?: {
        id?: string;
        rua?: string;
        numero?: number;
        bairro?: string;
        complemento?: string | null;
        cep?: string;
        municipio?: string;
        uf?: string;
      };
    }>;
  };
}
