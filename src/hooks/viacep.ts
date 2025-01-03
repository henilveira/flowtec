import useSWR from "swr";

// Interface para tipar a resposta da API
export interface CepResponse {
  cep: string | undefined;
  logradouro: string | undefined;
  uf: string | undefined;
  localidade: string | undefined;
  bairro: string | undefined;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useCep = (cep: string) => {
  const { data, error, isLoading } = useSWR<CepResponse>(
    cep.length === 8 ? `https://viacep.com.br/ws/${cep}/json/` : null,
    fetcher,
  );

  return {
    cep: data?.cep,
    rua: data?.logradouro,
    uf: data?.uf,
    municipio: data?.localidade,
    bairro: data?.bairro,
    isLoading,
    isError: error,
  };
};
