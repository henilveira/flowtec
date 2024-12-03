'use client'

import { ReactNode } from 'react'
import Coluna from './colunas'
import { COLUMNS } from './constantes-cor'
import { getProcessosByEtapas } from '@/hooks/useSocietario'
import Card from './card'

// Função para calcular os dias passados
const calcularDiasPassados = (startDate: string) => {
  const dataInicio = new Date(startDate); // Converte a data de início em um objeto Date
  const dataAtual = new Date(); // Pega a data atual
  
  // Calcula a diferença em milissegundos
  const diferencaEmMs = dataAtual.getTime() - dataInicio.getTime();
  
  // Converte a diferença de milissegundos para dias
  const diasPassados = Math.floor(diferencaEmMs / (1000 * 3600 * 24));

  return diasPassados;
}

export default function KanbanColumns({ cards }: any) {
  const { processos } = getProcessosByEtapas()

  return (
    <div className="flex gap-6 px-6 overflow-x-auto h-full">
      {processos.map((etapa) => (
        <div key={etapa.ordem} className="flex-shrink-0 min-w-[300px] max-w-[1fr]">
          <Coluna title={etapa.nome}>
            <div className="space-y-4">
              {etapa.processos.map((processo) => {
                const diasPassados = calcularDiasPassados(processo.created_at); // Calcula os dias passados

                return (
                  <Card
                    key={processo.id}
                    nome={processo.nome} // Nome do processo
                    etapa={processo.etapa_atual} // Estágio do processo
                    tipoProcesso={processo.tipo_processo} // Tipo do processo
                    diaAtual={diasPassados} // Número de dias passados
                    diaInicio={processo.created_at} // Data de início do processo
                  />
                );
              })}
            </div>
          </Coluna>
        </div>
      ))}
    </div>
  )
}
