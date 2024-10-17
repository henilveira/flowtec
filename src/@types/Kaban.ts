export type Stage = {
    name: string
    processes: string[]
  }
  
  export type KanbanCard = {
    id: string
    title: string
    description: string
    stage: number
    color: string
    startDate: string
    endDate: string | null
    franchise: string
    process: "abertura de empresa" | "alteração contratual" | "transformação"
    cnpj: string
    socialContract: File | null
    cnpjCard: File | null
    license: File | null
    otherDocuments: File | null
    completedProcesses: string[]
  }
  
  export const stages: Stage[] = [
    {
      name: "PROPOSTA/FORMULÁRIO",
      processes: ["PROPOSTA ENVIADA", "PROPOSTA ACEITA E FORMULÁRIO ENVIADO", "FORMULÁRIO RECEBIDO"]
    },
    {
      name: "VIABILIDADE",
      processes: ["SOLICITAR VIABILIDADE", "VIABILIDADE DEFERIDA", "ENVIAR DOCUMENTOS O CLIENTE CONFERIR E SOLICITAR OS E-CPF'S", "PROTOCOLADO JUCESC", "LIBERADO JUCESC E INICIAR ALVARÁ"]
    },
    {
      name: "ALVARÁS",
      processes: ["BOMBEIROS", "VIGILÂNCIA", "MEIO AMBIENTE", "POLÍCIA", "INSCRIÇÃO ESTADUAL", "ALVARÁ MUNICIPAL"]
    },
    {
      name: "SIMPLES/NF",
      processes: ["SOLICITAR SIMPLES", "INICIAR LIBERAÇÃO NOTAS", "RESULTADO SIMPLES", "NF LIBERADA E CONFIGURADA"]
    },
    {
      name: "CONCLUÍDO",
      processes: ["FINALIZAR PROCESSO"]
    }
  ]
  
  export const gradientColors = [
    "from-yellow-300 to-yellow-100",
    "from-pink-300 to-pink-100",
    "from-gray-300 to-gray-100",
    "from-green-300 to-green-100",
    "from-blue-300 to-blue-100",
  ]