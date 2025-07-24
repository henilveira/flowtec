'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Button,
  Input,
  Card,
  CardContent,
  Badge,
  CardHeader,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
} from '@shadcn/index';
import {
  Search,
  Filter,
  Plus,
  ArrowLeft,
  CalendarIcon,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Building,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Certificado {
  id: number;
  nome: string;
  dataExpiracao: string;
  diasRestantes: number;
  status: 'ativo' | 'expirado' | 'proximo_vencimento';
  arquivo: string;
  empresa: string;
  nomeCliente: string;
  telefoneContato: string;
}

interface Empresa {
  id: number;
  nome: string;
  certificados: Certificado[];
  totalCertificados: number;
}

interface CreateCertificadoForm {
  nomeCliente: string;
  telefoneContato: string;
  dataExpiracao: string;
}

const getStatusInfo = (daysLeft: number) => {
  if (daysLeft <= 0)
    return {
      status: 'expired',
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      badgeColor: 'bg-red-100 text-red-800',
      icon: XCircle,
      label: 'Expirado',
    };
  if (daysLeft <= 15)
    return {
      status: 'critical',
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      badgeColor: 'bg-red-100 text-red-800',
      icon: AlertTriangle,
      label: 'Crítico',
    };
  if (daysLeft <= 30)
    return {
      status: 'urgent',
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      badgeColor: 'bg-orange-100 text-orange-800',
      icon: AlertTriangle,
      label: 'Urgente',
    };
  if (daysLeft <= 60)
    return {
      status: 'warning',
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      badgeColor: 'bg-yellow-100 text-yellow-800',
      icon: Clock,
      label: 'Atenção',
    };
  return {
    status: 'good',
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    badgeColor: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    label: 'Em dia',
  };
};

const calculateDaysLeft = (expirationDate: string): number => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = expDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

const INITIAL_FORM: CreateCertificadoForm = {
  nomeCliente: '',
  telefoneContato: '',
  dataExpiracao: getTodayString(),
};

const empresasData: Empresa[] = [
  {
    id: 1,
    nome: 'Tech Solutions Ltda',
    totalCertificados: 3,
    certificados: [
      {
        id: 1,
        nome: 'Certificado Digital - João Silva',
        dataExpiracao: '2025-08-15',
        diasRestantes: calculateDaysLeft('2025-08-15'),
        status: 'ativo',
        arquivo: 'certificado-joao-silva.p12',
        empresa: 'Tech Solutions Ltda',
        nomeCliente: 'João Silva',
        telefoneContato: '(11) 99999-9999',
      },
      {
        id: 2,
        nome: 'Certificado Digital - Maria Santos',
        dataExpiracao: '2025-12-20',
        diasRestantes: calculateDaysLeft('2025-12-20'),
        status: 'ativo',
        arquivo: 'certificado-maria-santos.p12',
        empresa: 'Tech Solutions Ltda',
        nomeCliente: 'Maria Santos',
        telefoneContato: '(11) 88888-8888',
      },
      {
        id: 3,
        nome: 'Certificado Digital - Pedro Costa',
        dataExpiracao: '2025-07-10',
        diasRestantes: calculateDaysLeft('2025-07-10'),
        status: 'expirado',
        arquivo: 'certificado-pedro-costa.p12',
        empresa: 'Tech Solutions Ltda',
        nomeCliente: 'Pedro Costa',
        telefoneContato: '(11) 77777-7777',
      },
    ],
  },
  {
    id: 2,
    nome: 'Restaurante Sabor & Arte',
    totalCertificados: 2,
    certificados: [
      {
        id: 4,
        nome: 'Certificado Digital - Ana Oliveira',
        dataExpiracao: '2025-09-30',
        diasRestantes: calculateDaysLeft('2025-09-30'),
        status: 'ativo',
        arquivo: 'certificado-ana-oliveira.p12',
        empresa: 'Restaurante Sabor & Arte',
        nomeCliente: 'Ana Oliveira',
        telefoneContato: '(11) 66666-6666',
      },
      {
        id: 5,
        nome: 'Certificado Digital - Carlos Lima',
        dataExpiracao: '2025-06-25',
        diasRestantes: calculateDaysLeft('2025-06-25'),
        status: 'expirado',
        arquivo: 'certificado-carlos-lima.p12',
        empresa: 'Restaurante Sabor & Arte',
        nomeCliente: 'Carlos Lima',
        telefoneContato: '(11) 55555-5555',
      },
    ],
  },
];

export default function CertificadosDashboard() {
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [createCertificadoDialog, setCreateCertificadoDialog] = useState(false);
  const [createCertificadoForm, setCreateCertificadoForm] =
    useState<CreateCertificadoForm>(INITIAL_FORM);

  const allCertificados = useMemo(() => {
    return [
      ...empresasData.flatMap((empresa) => empresa.certificados),
      ...certificados,
    ];
  }, [certificados]);

  const filteredCertificados = useMemo(() => {
    return allCertificados
      .filter(
        (cert) =>
          cert.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => a.diasRestantes - b.diasRestantes);
  }, [allCertificados, searchTerm]);

  const certificadosFiltrados = useMemo(() => {
    return (
      empresaSelecionada?.certificados.filter(
        (cert) =>
          cert.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || []
    );
  }, [empresaSelecionada, searchTerm]);

  const stats = useMemo(() => {
    const expired = allCertificados.filter((c) => c.diasRestantes <= 0).length;
    const critical = allCertificados.filter(
      (c) => c.diasRestantes > 0 && c.diasRestantes <= 15,
    ).length;
    const urgent = allCertificados.filter(
      (c) => c.diasRestantes > 15 && c.diasRestantes <= 30,
    ).length;
    const warning = allCertificados.filter(
      (c) => c.diasRestantes > 30 && c.diasRestantes <= 60,
    ).length;
    const good = allCertificados.filter((c) => c.diasRestantes > 60).length;
    return { expired, critical, urgent, warning, good };
  }, [allCertificados]);

  const handleCreateCertificado = useCallback(() => {
    if (
      !createCertificadoForm.nomeCliente.trim() ||
      !createCertificadoForm.telefoneContato.trim() ||
      !createCertificadoForm.dataExpiracao
    )
      return;

    const diasRestantes = calculateDaysLeft(
      createCertificadoForm.dataExpiracao,
    );
    const newCertificado: Certificado = {
      id: Date.now(),
      nome: `Certificado Digital - ${createCertificadoForm.nomeCliente}`,
      dataExpiracao: createCertificadoForm.dataExpiracao,
      diasRestantes,
      status:
        diasRestantes <= 0
          ? 'expirado'
          : diasRestantes <= 30
            ? 'proximo_vencimento'
            : 'ativo',
      arquivo: `certificado-${createCertificadoForm.nomeCliente.toLowerCase().replace(/\s+/g, '-')}.p12`,
      empresa: 'Certificado Individual',
      nomeCliente: createCertificadoForm.nomeCliente,
      telefoneContato: createCertificadoForm.telefoneContato,
    };

    setCertificados((prev) => [...prev, newCertificado]);
    setCreateCertificadoDialog(false);
    setCreateCertificadoForm(INITIAL_FORM);
  }, [createCertificadoForm]);

  const handleFormChange = useCallback(
    (field: keyof CreateCertificadoForm, value: string) => {
      setCreateCertificadoForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const DatePickerComponent = ({
    date,
    onDateChange,
    placeholder = 'Selecione uma data',
  }: {
    date: string;
    onDateChange: (date: string) => void;
    placeholder?: string;
  }) => {
    const [open, setOpen] = useState(false);
    const selectedDate = date ? new Date(date) : undefined;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal bg-transparent"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate
              ? format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })
              : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                onDateChange(format(date, 'yyyy-MM-dd'));
                setOpen(false);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  };

  const StatsCard = ({
    title,
    count,
    icon: Icon,
    color,
    bgColor,
    textColor,
  }: {
    title: string;
    count: number;
    icon: any;
    color: string;
    bgColor: string;
    textColor: string;
  }) => (
    <Card className={`${bgColor} border-0 shadow-sm`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-3xl font-bold ${textColor}`}>{count}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CertificadoCard = ({ certificado }: { certificado: Certificado }) => {
    const statusInfo = getStatusInfo(certificado.diasRestantes);
    const StatusIcon = statusInfo.icon;

    return (
      <Card
        className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2 hover:shadow-lg transition-all duration-200`}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                {certificado.nomeCliente}
              </h3>
              <Badge className={statusInfo.badgeColor}>
                Certificado Digital
              </Badge>
            </div>
            <StatusIcon className={`w-6 h-6 ${statusInfo.textColor}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>
                  Expira em{' '}
                  {new Date(certificado.dataExpiracao).toLocaleDateString(
                    'pt-BR',
                  )}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center mb-1">
                <Building className="w-4 h-4 mr-2" />
                <span>{certificado.empresa}</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                <span>{certificado.telefoneContato}</span>
              </div>
            </div>
            <div className="text-center py-4">
              <div
                className={`text-4xl font-bold ${statusInfo.textColor} mb-1`}
              >
                {Math.abs(certificado.diasRestantes)}
              </div>
              <div className="text-sm text-gray-500">
                {certificado.diasRestantes <= 0
                  ? certificado.diasRestantes === -1
                    ? 'dia vencido'
                    : 'dias vencidos'
                  : certificado.diasRestantes === 1
                    ? 'dia restante'
                    : 'dias restantes'}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${statusInfo.color}`}
                style={{
                  width: `${Math.max(10, Math.min(100, (Math.max(0, certificado.diasRestantes) / 90) * 100))}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const voltarParaPastas = () => {
    setEmpresaSelecionada(null);
    setSearchTerm('');
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Header fixo */}
      <div className="flex-shrink-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="w-full max-w-full px-4 py-4 space-y-4 overflow-hidden">
          <div className="flex items-center justify-between gap-4 w-full min-w-0">
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                {empresaSelecionada && (
                  <Button variant="ghost" size="sm" onClick={voltarParaPastas}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground truncate">
                  {empresaSelecionada
                    ? empresaSelecionada.nome
                    : 'Certificados Digitais'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                {empresaSelecionada
                  ? `${empresaSelecionada.certificados.length} certificados encontrados`
                  : 'Gerencie todos os certificados digitais das empresas'}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setCreateCertificadoDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Certificado
              </Button>
            </div>
          </div>

          {/* Breadcrumb */}
          {empresaSelecionada && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <button
                onClick={voltarParaPastas}
                className="hover:text-blue-600 truncate"
              >
                Certificados Digitais
              </button>
              <span>/</span>
              <span className="text-foreground truncate">
                {empresaSelecionada.nome}
              </span>
            </div>
          )}

          {/* Linha 2: busca + filtro */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full min-w-0">
            <div className="flex-1 max-w-full sm:max-w-md min-w-0 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por cliente, empresa ou certificado..."
                className="pl-10"
                value={searchTerm}
                onChange={(value: string) => setSearchTerm(value)}
              />
            </div>
            <div className="flex-shrink-0">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Área de conteúdo principal */}
      <div className="flex-1 min-h-0 w-full relative">
        <div className="p-4 space-y-6">
          {!empresaSelecionada ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatsCard
                  title="Expirados"
                  count={stats.expired}
                  icon={XCircle}
                  color="bg-red-500"
                  bgColor="bg-red-50"
                  textColor="text-red-700"
                />
                <StatsCard
                  title="Críticos"
                  count={stats.critical}
                  icon={AlertTriangle}
                  color="bg-red-500"
                  bgColor="bg-red-50"
                  textColor="text-red-700"
                />
                <StatsCard
                  title="Urgentes"
                  count={stats.urgent}
                  icon={AlertTriangle}
                  color="bg-orange-500"
                  bgColor="bg-orange-50"
                  textColor="text-orange-700"
                />
                <StatsCard
                  title="Atenção"
                  count={stats.warning}
                  icon={Clock}
                  color="bg-yellow-500"
                  bgColor="bg-yellow-50"
                  textColor="text-yellow-700"
                />
                <StatsCard
                  title="Em Dia"
                  count={stats.good}
                  icon={CheckCircle}
                  color="bg-green-500"
                  bgColor="bg-green-50"
                  textColor="text-green-700"
                />
              </div>

              {/* Certificados Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCertificados.map((certificado) => (
                  <CertificadoCard
                    key={certificado.id}
                    certificado={certificado}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificadosFiltrados.map((certificado) => (
                <CertificadoCard
                  key={certificado.id}
                  certificado={certificado}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog */}
      <Dialog
        open={createCertificadoDialog}
        onOpenChange={setCreateCertificadoDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Certificado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome-cliente">Nome do Cliente</Label>
              <Input
                id="nome-cliente"
                placeholder="Digite o nome do cliente"
                value={createCertificadoForm.nomeCliente}
                onChange={(value: string) =>
                  handleFormChange('nomeCliente', value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone-contato">Telefone de Contato</Label>
              <Input
                id="telefone-contato"
                placeholder="(11) 99999-9999"
                value={createCertificadoForm.telefoneContato}
                onChange={(value: string) =>
                  handleFormChange('telefoneContato', value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-expiracao">Data de Expiração</Label>
              <DatePickerComponent
                date={createCertificadoForm.dataExpiracao}
                onDateChange={(date: string) =>
                  handleFormChange('dataExpiracao', date)
                }
                placeholder="Selecione a data de expiração"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateCertificadoDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCertificado}
              disabled={
                !createCertificadoForm.nomeCliente.trim() ||
                !createCertificadoForm.telefoneContato.trim() ||
                !createCertificadoForm.dataExpiracao
              }
            >
              Criar Certificado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// export default function Page() {
//   return (
//     <h1>Hello world</h1>
//   )
// }
