'use client'

import { useState } from 'react'
import Coluna from './colunas'
import { getProcessosByEtapas } from '@/hooks/useSocietario'
import EditCard from './editCard'
import Card from './card'

const calcularDiasPassados = (startDate: string) => {
  const dataInicio = new Date(startDate);
  const dataAtual = new Date();
  const diferencaEmMs = dataAtual.getTime() - dataInicio.getTime();
  return Math.floor(diferencaEmMs / (1000 * 3600 * 24));
}

export default function KanbanColumns() {
  const { processos } = getProcessosByEtapas()
  const [cardEditado, setCardEditado] = useState<any>(null);

  const handleEditarCard = (processo: any) => {
    setCardEditado(processo);
  }

  const handleSalvarEdicao = (processo: any) => {
    setCardEditado(null); // Fechar editor após salvar
  }

  return (
    <div className="flex gap-6 px-6 overflow-x-auto h-full">
      {processos.map((etapa) => (
        <div key={etapa.ordem} className="flex-shrink-0 min-w-[300px] max-w-[1fr]">
          <Coluna title={etapa.nome}>
            <div className="space-y-4">
              {etapa.processos.map((processo: any) => {
                const diasPassados = calcularDiasPassados(processo.created_at);

                return (
                  <div key={processo.id}>
                    {cardEditado && cardEditado.id === processo.id ? (
                      <EditCard
                        processo={processo}  // Passando o processo corretamente
                        onSave={handleSalvarEdicao}
                        onCancel={() => setCardEditado(null)}
                      />
                    ) : (
                      <Card
                        nome={processo.nome}
                        etapa={processo.etapa_atual}
                        tipoProcesso={processo.tipo_processo}
                        diaAtual={diasPassados}
                        diaInicio={processo.created_at}
                        onEdit={() => handleEditarCard(processo)} 
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </Coluna>
        </div>
      ))}
    </div>
  )
}
