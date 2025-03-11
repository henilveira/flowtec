"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useListContabilidades } from "@/hooks/useListContabilidade";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LoadingAnimation from "@/components/ui/loading";

type AtividadeStatus = "DESABILITADA" | "ATIVA";
type AtividadeTipo = "Projeto" | "Tarefa" | "Evento";

const StatusBadge = ({ status }: { status: AtividadeStatus }) => {
  const color =
    status === "DESABILITADA"
      ? "bg-red-200 text-red-800"
      : "bg-green-200 text-green-800";
  return <Badge className={`${color}`}>{status}</Badge>;
};

const TableContabilidades = () => {
  const [page, setPage] = useState(1);
  const { companies, totalPages, isLoading, isError } =
    useListContabilidades(page);

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  if (isLoading && isError) {
    return <LoadingAnimation />;
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Atividade</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Porte</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de abertura</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(companies) &&
              companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.nome}</TableCell>
                  <TableCell>{company.desc_atividade_principal}</TableCell>
                  <TableCell>{company.tipo}</TableCell>
                  <TableCell>{company.porte}</TableCell>
                  <TableCell>{company.situacao}</TableCell>
                  <TableCell>{company.data_abertura}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>
        <span>
          Página {page || 0} de {totalPages || 0}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          Próxima
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TableContabilidades;
