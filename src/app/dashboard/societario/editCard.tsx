'use client';

import { useState } from 'react';

interface EditCardProps {
  processo: any;  // Adicionando processo como propriedade
  onSave: (processo: any) => void; // Função de salvar
  onCancel: () => void; // Função de cancelar
}

export default function EditCard({ processo, onSave, onCancel }: EditCardProps) {
  const [nome, setNome] = useState(processo.nome);
  const [tipoProcesso, setTipoProcesso] = useState(processo.tipo_processo);

  const handleSave = () => {
    onSave({ ...processo, nome, tipoProcesso }); // Envia o processo com os dados atualizados
    onCancel(); // Fecha o modal
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold">Editar Processo</h3>

      <div className="mt-4">
        <label className="block text-sm">Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm">Tipo de Processo</label>
        <input
          type="text"
          value={tipoProcesso}
          onChange={(e) => setTipoProcesso(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Salvar
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
