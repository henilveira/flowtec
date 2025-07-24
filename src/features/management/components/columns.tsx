import { DataTableColumnHeader } from '@flowtec/components/data-table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { XCircle, CheckCircle, MoreHorizontal, Trash2Icon } from 'lucide-react';
import React from 'react';
import { Accounting } from '../schemas/management.schema';
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from '@flowtec/components/ui/kiboui/status';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@flowtec/components/ui/shadcnui/dropdown-menu';
import { Button } from '@flowtec/components/ui/shadcnui/button';

export function makeManagementColumns(
  openDeleteModal: (
    id: string,
    identifier: string,
    text: string,
    isOpen: boolean,
  ) => void,
): ColumnDef<Accounting>[] {
  return [
    {
      id: 'nome',
      accessorKey: 'nome',
      header: ({ column }: { column: Column<Accounting, unknown> }) => (
        <DataTableColumnHeader column={column} title="Nome" />
      ),
      cell: ({ cell }) => <div>{cell.getValue<Accounting['nome']>()}</div>,
      meta: {
        label: 'Nome',
        placeholder: 'Procurar nome...',
        variant: 'text',
      },
      enableColumnFilter: true,
    },
    {
      id: 'situacao',
      accessorKey: 'situacao',
      header: ({ column }: { column: Column<Accounting, unknown> }) => (
        <DataTableColumnHeader column={column} title="Situação" />
      ),
      cell: ({ cell }) => {
        const status = cell.getValue<Accounting['situacao']>().toLowerCase();
        return (
          <Status status={status} className="capitalize">
            <StatusIndicator />
            <StatusLabel />
          </Status>
        );
      },
      meta: {
        label: 'Situação',
        variant: 'multiSelect',
        options: [
          { label: 'Ativa', value: 'ativa', icon: CheckCircle },
          { label: 'Suspensa', value: 'suspensa', icon: CheckCircle },
          { label: 'Inapta', value: 'inapta', icon: CheckCircle },
          { label: 'Baixada', value: 'baixada', icon: CheckCircle },
          { label: 'Nula', value: 'nula', icon: CheckCircle },
          { label: 'Inativa', value: 'inativa', icon: XCircle },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: 'tipo',
      accessorKey: 'tipo',
      header: ({ column }: { column: Column<Accounting, unknown> }) => (
        <DataTableColumnHeader column={column} title="Tipo" />
      ),
      cell: ({ cell }) => <div>{cell.getValue<Accounting['tipo']>()}</div>,
      meta: {
        label: 'Tipo',
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const { id, nome_fantasia } = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  openDeleteModal(id, nome_fantasia, 'contabilidade', true);
                }}
              >
                <Trash2Icon />
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 32,
    },
  ];
}
