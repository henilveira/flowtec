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
  info_adicionais: {
    resp_tecnica: boolean;
    nome_responsavel: string;
    nmr_carteira_profissional: string;
    uf: string;
    area_resp: string;
  };
}
