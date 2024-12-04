'use client';

import Card from './card';
import Coluna from './colunas';

const calcularDiasPassados = (startDate: string) => {
  const dataInicio = new Date(startDate);
  const dataAtual = new Date();
  const diferencaEmMs = dataAtual.getTime() - dataInicio.getTime();
  return Math.floor(diferencaEmMs / (1000 * 3600 * 24));
};

interface Processo {
  id: string;
  nome: string;
  created_at: string;
  etapa_atual: string;
  tipo_processo: string;
}

interface Etapa {
  ordem: number;
  nome: string;
  processos: Processo[];
}

interface KanbanColumnsProps {
  processosCard: Etapa[];
  handleCardEdit: (processo: Processo) => void;
  selectedProcessoId?: string;
}

export default function KanbanColumns({ 
  processosCard, 
  handleCardEdit, 
  selectedProcessoId 
}: KanbanColumnsProps) {
  return (
    <div className="flex gap-6 px-6 overflow-x-auto h-full">
      {processosCard.map((etapa) => (
        <div key={etapa.ordem} className="flex-shrink-0 min-w-[300px] max-w-[1fr]">
          <Coluna 
            title={etapa.nome} 
            count={etapa.processos.length} // Passa a contagem separadamente
          >
            <div className="space-y-4">
              {etapa.processos.map((processo) => (
                <Card
                  key={processo.id}
                  nome={processo.nome}
                  etapa={processo.etapa_atual}
                  tipoProcesso={processo.tipo_processo}
                  diaAtual={calcularDiasPassados(processo.created_at)}
                  diaInicio={processo.created_at}
                  onClick={() => handleCardEdit(processo)}
                  disabled={selectedProcessoId === processo.id}
                />
              ))}
            </div>
          </Coluna>
        </div>
      ))}
    </div>
  );
}
