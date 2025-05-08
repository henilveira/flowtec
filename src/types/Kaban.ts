
  
  export type KanbanCard = {
    id: string
    name: string
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
  

  
  export const gradientColors = [
    "from-yellow-300 to-yellow-100",
    "from-pink-300 to-pink-100",
    "from-gray-300 to-gray-100",
    "from-green-300 to-green-100",
    "from-blue-300 to-blue-100",
  ]