export const STAGES = {
    PROPOSTA: 'proposta',
    VIABILIDADE: 'viabilidade',
    ALVARAS: 'alvaras',
    SIMPLES: 'simples',
    CONCLUSAO: 'conclusao'
  } as const
  
  export const COLUMNS = [
    {
      id: STAGES.PROPOSTA,
      title: 'Proposta / Formulário',
      color: 'bg-sky-500'
    },
    {
      id: STAGES.VIABILIDADE,
      title: 'Viabilidade',
      color: 'bg-yellow-400'
    },
    {
      id: STAGES.ALVARAS,
      title: 'Alvarás',
      color: 'bg-fuchsia-500'
    },
    {
      id: STAGES.SIMPLES,
      title: 'Simples / NF',
      color: 'bg-rose-500'
    },
    {
      id: STAGES.CONCLUSAO,
      title: 'Conclusão',
      color: 'bg-emerald-500'
    }
  ] as const
  
  export type Stage = typeof STAGES[keyof typeof STAGES]