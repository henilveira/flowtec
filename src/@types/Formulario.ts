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
  empresa_form_id: string;
  socios: {
    nome: string;
    nacionalidade: string;
    data_nascimento: string; // Formato: "YYYY-MM-DD"
    estado_civil: string;
    regime_casamento?: string; // Obrigatório se estado_civil === "casado"
    profissao: string;
    cpf: string; // Máx. 11 dígitos, com ou sem pontuação
    rg: string; // Máx. 14 dígitos, com ou sem pontuação
    orgao_expedidor: string; // Máx. 8 letras
    uf: string;
    administrador: boolean;
    tipo_administrador?: string; // Obrigatório se administrador === true
    qtd_cotas: number;
    endereco: {
      rua: string;
      numero: number;
      bairro: string;
      cep: string; // Máx. 9 dígitos, com ou sem hífen
      municipio: string;
      complemento: string;
      uf: string;
    };
  };
}
