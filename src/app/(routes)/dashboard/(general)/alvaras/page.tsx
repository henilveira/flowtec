'use client';

import type React from 'react';

import { useState, useCallback, useMemo } from 'react';
import {
  Button,
  Input,
  Card,
  CardContent,
  Badge,
  CardHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  CalendarIcon,
  Building,
  FolderOpen,
  Upload,
  Edit,
  ArrowLeft,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Alvara {
  id: number;
  empresa: string;
  tipoAlvara: string;
  dataExpiracao: string;
  diasRestantes: number;
  fileName?: string;
}

interface Company {
  id: number;
  name: string;
  alvaras: Alvara[];
}

interface UploadDialogData {
  file: File;
  companyId: number;
}

interface UploadFormData {
  tipoAlvara: string;
  dataExpiracao: string;
}

interface CreateCompanyForm {
  name: string;
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
      label: 'Vencido',
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

const INITIAL_UPLOAD_FORM: UploadFormData = {
  tipoAlvara: '',
  dataExpiracao: getTodayString(),
};

const INITIAL_ALVARAS: Alvara[] = [
  {
    id: 1,
    empresa: 'Tech Solutions Ltda',
    tipoAlvara: 'Funcionamento',
    dataExpiracao: '2025-08-15',
    diasRestantes: 35,
    fileName: 'alvara_funcionamento_tech.pdf',
  },
  {
    id: 2,
    empresa: 'Restaurante Sabor & Arte',
    tipoAlvara: 'Sanitário',
    dataExpiracao: '2025-09-20',
    diasRestantes: 71,
    fileName: 'alvara_sanitario_restaurante.pdf',
  },
  {
    id: 3,
    empresa: 'Construtora Moderna S/A',
    tipoAlvara: 'Construção',
    dataExpiracao: '2025-07-25',
    diasRestantes: 14,
    fileName: 'alvara_construcao_moderna.pdf',
  },
];

export default function AlvarasDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alvaras, setAlvaras] = useState<Alvara[]>(INITIAL_ALVARAS);
  const [companies, setCompanies] = useState<Company[]>([
    { id: 1, name: 'Tech Solutions Ltda', alvaras: [] },
    { id: 2, name: 'Restaurante Sabor & Arte', alvaras: [] },
    { id: 3, name: 'Construtora Moderna S/A', alvaras: [] },
    { id: 4, name: 'Farmácia Central', alvaras: [] },
    { id: 5, name: 'Auto Mecânica Silva', alvaras: [] },
  ]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadDialog, setUploadDialog] = useState<{
    isOpen: boolean;
    data: UploadDialogData | null;
  }>({ isOpen: false, data: null });
  const [uploadForm, setUploadForm] =
    useState<UploadFormData>(INITIAL_UPLOAD_FORM);
  const [createCompanyDialog, setCreateCompanyDialog] = useState(false);
  const [createCompanyForm, setCreateCompanyForm] = useState<CreateCompanyForm>(
    { name: '' },
  );
  const [editingDate, setEditingDate] = useState<{
    id: number;
    date: Date;
  } | null>(null);

  const filteredAlvaras = useMemo(() => {
    return alvaras
      .filter(
        (alvara) =>
          alvara.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alvara.tipoAlvara.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => a.diasRestantes - b.diasRestantes);
  }, [alvaras, searchTerm]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [companies, searchTerm]);

  const stats = useMemo(() => {
    const expired = alvaras.filter((a) => a.diasRestantes <= 0).length;
    const critical = alvaras.filter(
      (a) => a.diasRestantes > 0 && a.diasRestantes <= 15,
    ).length;
    const urgent = alvaras.filter(
      (a) => a.diasRestantes > 15 && a.diasRestantes <= 30,
    ).length;
    const warning = alvaras.filter(
      (a) => a.diasRestantes > 30 && a.diasRestantes <= 60,
    ).length;
    const good = alvaras.filter((a) => a.diasRestantes > 60).length;

    return { expired, critical, urgent, warning, good };
  }, [alvaras]);

  const handleFileUpload = useCallback((file: File, companyId: number) => {
    if (file.type === 'application/pdf') {
      setUploadDialog({
        isOpen: true,
        data: { file, companyId },
      });
      setUploadForm({
        tipoAlvara: '',
        dataExpiracao: getTodayString(),
      });
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, companyId: number) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files[0], companyId);
      }
    },
    [handleFileUpload],
  );

  const handleSaveAlvara = useCallback(() => {
    if (
      !uploadDialog.data ||
      !uploadForm.tipoAlvara ||
      !uploadForm.dataExpiracao
    )
      return;

    const { file, companyId } = uploadDialog.data;
    const diasRestantes = calculateDaysLeft(uploadForm.dataExpiracao);
    const company = companies.find((c) => c.id === companyId);

    const newAlvara: Alvara = {
      id: Date.now(),
      empresa: company?.name || '',
      tipoAlvara: uploadForm.tipoAlvara,
      dataExpiracao: uploadForm.dataExpiracao,
      diasRestantes,
      fileName: file.name,
    };

    setAlvaras((prev) => [...prev, newAlvara]);
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === companyId
          ? { ...company, alvaras: [...company.alvaras, newAlvara] }
          : company,
      ),
    );

    if (selectedCompany && selectedCompany.id === companyId) {
      setSelectedCompany((prev) =>
        prev ? { ...prev, alvaras: [...prev.alvaras, newAlvara] } : null,
      );
    }

    setUploadDialog({ isOpen: false, data: null });
    setUploadForm(INITIAL_UPLOAD_FORM);
  }, [uploadDialog.data, uploadForm, companies, selectedCompany]);

  const handleCreateCompany = useCallback(() => {
    if (!createCompanyForm.name.trim()) return;

    const newCompany: Company = {
      id: Date.now(),
      name: createCompanyForm.name.trim(),
      alvaras: [],
    };

    setCompanies((prev) => [...prev, newCompany]);
    setCreateCompanyDialog(false);
    setCreateCompanyForm({ name: '' });
  }, [createCompanyForm.name]);

  const handleEditDate = useCallback(
    (id: number, newDate: Date) => {
      const newDateString = format(newDate, 'yyyy-MM-dd');
      const diasRestantes = calculateDaysLeft(newDateString);

      setAlvaras((prev) =>
        prev.map((alvara) =>
          alvara.id === id
            ? { ...alvara, dataExpiracao: newDateString, diasRestantes }
            : alvara,
        ),
      );

      setCompanies((prev) =>
        prev.map((company) => ({
          ...company,
          alvaras: company.alvaras.map((alvara) =>
            alvara.id === id
              ? { ...alvara, dataExpiracao: newDateString, diasRestantes }
              : alvara,
          ),
        })),
      );

      if (selectedCompany) {
        setSelectedCompany((prev) =>
          prev
            ? {
                ...prev,
                alvaras: prev.alvaras.map((alvara) =>
                  alvara.id === id
                    ? { ...alvara, dataExpiracao: newDateString, diasRestantes }
                    : alvara,
                ),
              }
            : null,
        );
      }

      setEditingDate(null);
    },
    [selectedCompany],
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

  const AlvaraCard = ({ alvara }: { alvara: Alvara }) => {
    const statusInfo = getStatusInfo(alvara.diasRestantes);
    const StatusIcon = statusInfo.icon;

    return (
      <Card
        className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2 hover:shadow-lg transition-all duration-200`}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                {alvara.empresa}
              </h3>
              <Badge className={statusInfo.badgeColor}>
                {alvara.tipoAlvara}
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
                  {format(new Date(alvara.dataExpiracao), 'dd/MM/yyyy')}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setEditingDate({
                    id: alvara.id,
                    date: new Date(alvara.dataExpiracao),
                  })
                }
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-center py-4">
              <div
                className={`text-4xl font-bold ${statusInfo.textColor} mb-1`}
              >
                {Math.abs(alvara.diasRestantes)}
              </div>
              <div className="text-sm text-gray-500">
                {alvara.diasRestantes <= 0
                  ? alvara.diasRestantes === -1
                    ? 'dia vencido'
                    : 'dias vencidos'
                  : alvara.diasRestantes === 1
                    ? 'dia restante'
                    : 'dias restantes'}
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${statusInfo.color}`}
                style={{
                  width: `${Math.max(10, Math.min(100, (Math.max(0, alvara.diasRestantes) / 90) * 100))}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CompanyCard = ({ company }: { company: Company }) => {
    company.alvaras.length > 0;
    const criticalCount = company.alvaras.filter(
      (a) => a.diasRestantes <= 15,
    ).length;

    return (
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {company.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {company.alvaras.length}{' '}
                  {company.alvaras.length === 1 ? 'alvará' : 'alvarás'}
                </p>
              </div>
            </div>
            {criticalCount > 0 && (
              <Badge className="bg-red-100 text-red-800">
                {criticalCount} crítico{criticalCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => setSelectedCompany(company)}
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Gerenciar Alvarás
          </Button>
        </CardContent>
      </Card>
    );
  };

  const CompanyDetail = ({ company }: { company: Company }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setSelectedCompany(null)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-gray-600">Gerenciar alvarás da empresa</p>
          </div>
        </div>
      </div>

      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="p-8">
          <div
            className="text-center"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, company.id)}
          >
            <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Adicionar Novo Alvará
            </h3>
            <p className="text-gray-500 mb-4">
              Arraste um arquivo PDF aqui ou clique para selecionar
            </p>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              id={`file-upload-${company.id}`}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, company.id);
              }}
            />
            <label htmlFor={`file-upload-${company.id}`}>
              <Button
                variant="outline"
                className="cursor-pointer bg-transparent"
                asChild
              >
                <span>Selecionar Arquivo PDF</span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {company.alvaras.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Alvarás Cadastrados ({company.alvaras.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {company.alvaras.map((alvara) => (
              <AlvaraCard key={alvara.id} alvara={alvara} />
            ))}
          </div>
        </div>
      ) : (
        <Card className="bg-gray-50">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum alvará cadastrado
            </h3>
            <p className="text-gray-500">
              Adicione o primeiro alvará desta empresa usando o formulário
              acima.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderDialogs = () => (
    <>
      <Dialog
        open={uploadDialog.isOpen}
        onOpenChange={(open) => setUploadDialog({ isOpen: open, data: null })}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Alvará</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipo-alvara">Tipo de Alvará</Label>
              <Select
                value={uploadForm.tipoAlvara}
                onValueChange={(value) =>
                  setUploadForm((prev) => ({ ...prev, tipoAlvara: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Funcionamento">Funcionamento</SelectItem>
                  <SelectItem value="Sanitário">Sanitário</SelectItem>
                  <SelectItem value="Ambiental">Ambiental</SelectItem>
                  <SelectItem value="Construção">Construção</SelectItem>
                  <SelectItem value="Bombeiros">Bombeiros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-expiracao">Data de Expiração</Label>
              <DatePickerComponent
                date={uploadForm.dataExpiracao}
                onDateChange={(date) =>
                  setUploadForm((prev) => ({ ...prev, dataExpiracao: date }))
                }
                placeholder="Selecione a data de expiração"
              />
            </div>
            {uploadDialog.data && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {uploadDialog.data.file.name}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUploadDialog({ isOpen: false, data: null })}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveAlvara}
              disabled={!uploadForm.tipoAlvara || !uploadForm.dataExpiracao}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Salvar Alvará
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createCompanyDialog} onOpenChange={setCreateCompanyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Empresa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nome da Empresa</Label>
              <Input
                id="company-name"
                placeholder="Digite o nome da empresa"
                value={createCompanyForm.name}
                onChange={(value: string) =>
                  setCreateCompanyForm({ name: value })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateCompany();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateCompanyDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCompany}
              disabled={!createCompanyForm.name.trim()}
            >
              Criar Empresa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingDate}
        onOpenChange={(open) => !open && setEditingDate(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Data de Expiração</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nova Data de Expiração</Label>
              <DatePickerComponent
                date={editingDate ? format(editingDate.date, 'yyyy-MM-dd') : ''}
                onDateChange={(date) => {
                  if (editingDate) {
                    setEditingDate({ ...editingDate, date: new Date(date) });
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDate(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (editingDate) {
                  handleEditDate(editingDate.id, editingDate.date);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {selectedCompany ? (
          <CompanyDetail company={selectedCompany} />
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Alvarás</h1>
                  <p className="text-gray-600 text-lg mt-2">
                    Gerencie e monitore todos os alvarás das suas empresas
                  </p>
                </div>
                <Button
                  className=""
                  onClick={() => setCreateCompanyDialog(true)}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Nova Empresa
                </Button>
              </div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="alvaras">Alvarás</TabsTrigger>
                  <TabsTrigger value="empresas">Empresas</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <StatsCard
                      title="Vencidos"
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

                  <Card>
                    <CardHeader>
                      <h2 className="text-2xl font-semibold">
                        Alvarás que Precisam de Atenção
                      </h2>
                    </CardHeader>
                    <CardContent>
                      {filteredAlvaras.slice(0, 6).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredAlvaras.slice(0, 6).map((alvara) => (
                            <AlvaraCard key={alvara.id} alvara={alvara} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                          <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            Todos os alvarás estão em dia!
                          </h3>
                          <p className="text-gray-500">
                            Não há alvarás que precisam de atenção imediata.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="alvaras" className="space-y-6">
                  <div className="flex gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Buscar por empresa ou tipo de alvará..."
                        className="pl-10 py-3"
                        value={searchTerm}
                        onChange={(value) => setSearchTerm(value)}
                      />
                    </div>
                    <Button variant="outline" className="px-6 bg-transparent">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtros
                    </Button>
                  </div>

                  {filteredAlvaras.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredAlvaras.map((alvara) => (
                        <AlvaraCard key={alvara.id} alvara={alvara} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                          Nenhum alvará encontrado
                        </h3>
                        <p className="text-gray-500">
                          Tente ajustar os termos de busca ou adicione novos
                          alvarás.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="empresas" className="space-y-6">
                  <div className="flex gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Buscar empresa..."
                        className="pl-10 py-3"
                        value={searchTerm}
                        onChange={(value: string) => setSearchTerm(value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies.map((company) => (
                      <CompanyCard key={company.id} company={company} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>

      {renderDialogs()}
    </div>
  );
}

// export default function Page() {
//   return (
//     <h1>Hello world</h1>
//   )
// }
