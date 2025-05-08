export interface useListContabilidadesReturn {
    companies: ContabilidadeData[];
    totalPages: number;
    isLoading: boolean;
    isError: Error | null;
    mutate: () => Promise<any>;
    isValidating: boolean;
}

export interface ContabilidadeResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
        empresas: ContabilidadeData[];
    };
}

export type ContabilidadeData = {
    id: string;
    nome: string;
    nome_fantasia: string;
    cnpj: string;
    data_abertura: string; // ou Date, se você quiser converter para objeto Date
    situacao: string;
    tipo: string;
    porte: string;
    natureza_juridica: string;
    cod_atividade_principal: string;
    desc_atividade_principal: string;
    endereco: string;
    cep: string;
    created_at: string; // ou Date, se preferir
    updated_at: string; // ou Date, se preferir
};
