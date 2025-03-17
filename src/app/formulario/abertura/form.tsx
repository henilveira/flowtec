"use client";
import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormularioDados } from "@/@types/Formulario";
import { useFormActions } from "@/hooks/useForm";
import InputMask from "react-input-mask";
import { NumericFormat } from "react-number-format";
import FieldWithTooltip from "../tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCep } from "@/hooks/viacep";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useFormContext } from "@/contexts/form-context";

// Separate component that uses useSearchParams
function FormularioAberturaInner() {
  const router = useRouter();
  const { criarAbertura, isLoading, error } = useFormActions();
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id");
  const { formId, setFormId } = useFormContext();

  // Use the ID from context or URL
  useEffect(() => {
    if (urlId && !formId) {
      setFormId(urlId);
    }
  }, [urlId, formId, setFormId]);

  // Estado para controlar o AlertDialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<FormularioDados | null>(null);

  // ABERTURA
  const [nome1, setNome1] = useState("");
  const [nome2, setNome2] = useState("");
  const [nome3, setNome3] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cepEmpresa, setCepEmpresa] = useState("");
  const [enderecoContato, setEnderecoContato] = useState(false);
  const [ruaEmpresa, setRuaEmpresa] = useState("");
  const [numeroEmpresa, setNumeroEmpresa] = useState("");
  const [bairroEmpresa, setBairroEmpresa] = useState("");
  const [municipioEmpresa, setMunicipioEmpresa] = useState("");
  const [UFEmpresa, setUFEmpresa] = useState("");
  const [inscricaoImobiliaria, setInscricaoImobiliaria] = useState("");
  const [telefoneEmpresa, setTelefoneEmpresa] = useState("");
  const [emailEmpresa, setEmailEmpresa] = useState("");
  const [valorCapitalSocial, setValorCapitalSocial] = useState(0);
  const [dataIntegralizacao, setDataIntegralizacao] = useState("");
  const [areaEmpresa, setAreaEmpresa] = useState(0);
  const [capitalIntegralizado, setCapitalIntegralizado] = useState(false);
  const [empresaAnexadaResidencia, setEmpresaAnexadaResidencia] =
    useState(false);

  // INFORMAÇÕES ADICIONAIS
  const [atividadeRespTecnica, setAtividadeRespTecnica] = useState(false);
  const [nomeRespTecnico, setNomeRespTecnico] = useState("");
  const [carteiraProfissional, setCarteiraProfissional] = useState("");
  const [ufProfissional, setUfProfissional] = useState("");
  const [areaResp, setAreaResp] = useState("");

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    setCepEmpresa(cep);
  };

  const shouldFetchCep = cepEmpresa.length === 8;
  const {
    rua,
    municipio,
    uf,
    bairro,
    isLoading: isLoadingCep,
  } = useCep(shouldFetchCep ? cepEmpresa : "");

  useEffect(() => {
    if (rua) setRuaEmpresa(rua);
    if (bairro) setBairroEmpresa(bairro);
    if (municipio) setMunicipioEmpresa(municipio);
    if (uf) setUFEmpresa(uf);
  }, [rua, bairro, municipio, uf]);

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const telefone = e.target.value.replace(/\D/g, "");
    setTelefoneEmpresa(telefone);
  };

  const dadosFormulario: FormularioDados = {
    processo_id: formId || urlId,
    opcoes_nome_empresa: [nome1, nome2, nome3],
    nome_fantasia: nomeFantasia,
    endereco: {
      rua: ruaEmpresa,
      numero: Number(numeroEmpresa),
      bairro: bairroEmpresa,
      cep: cepEmpresa,
      municipio: municipioEmpresa,
      uf: UFEmpresa,
    },
    inscricao_imob: inscricaoImobiliaria,
    telefone: telefoneEmpresa,
    email: emailEmpresa,
    val_capital_social: valorCapitalSocial,
    capital_integralizado: capitalIntegralizado,
    data_integralizacao: dataIntegralizacao,
    empresa_anexa_resid: empresaAnexadaResidencia,
    endereco_apenas_contato: enderecoContato,
    area_empresa: areaEmpresa,
    info_adicionais: atividadeRespTecnica
      ? {
          resp_tecnica: atividadeRespTecnica,
          nome_responsavel: nomeRespTecnico,
          nmr_carteira_profissional: carteiraProfissional,
          uf: ufProfissional,
          area_resp: areaResp,
        }
      : {
          resp_tecnica: false,
        },
  };

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nome1 || !nome2 || !nome3 || !nomeFantasia) {
      toast.error("Erro de validação", {
        description: "Preencha todos os campos obrigatórios",
      });
      return;
    }

    if (
      atividadeRespTecnica &&
      (!nomeRespTecnico ||
        !carteiraProfissional ||
        !ufProfissional ||
        !areaResp)
    ) {
      toast.error("Erro de validação", {
        description: "Preencha todos os campos de responsabilidade técnica",
      });
      return;
    }

    setFormData(dadosFormulario);
    setShowConfirmDialog(true);
  };

  // Função para confirmar e enviar
  const handleConfirmSubmit = async () => {
    if (!formData) return;

    try {
      console.log("Iniciando envio...");
      const response = await criarAbertura(formData);
      console.log("Resposta:", response);

      // Ensure we have the ID saved in context and localStorage
      if (response.id) {
        setFormId(response.id);
      }

      toast.success("Dados enviados com sucesso!", {
        description: "Redirecionando para próxima etapa...",
        duration: 3000,
      });

      // Navigate to the next page, passing the ID in the URL for extra security
      router.push(`/formulario/socios${formId ? `?id=${formId}` : ""}`);

      setShowConfirmDialog(false);
    } catch (err) {
      console.error("Erro ao enviar formulário:", err);
      toast.error("Erro ao enviar dados", {
        description: "Por favor, tente novamente",
      });
    }
  };

  return (
    <form
      className="mt-8 space-y-8 bg-white p-4 rounded-lg max-w-2xl mx-auto"
      onSubmit={handleForm}
    >
      {/* Seção de nomes da empresa */}
      <div className="space-y-4">
        <div className="flex space-x-2">
          <FieldWithTooltip
            label={
              <div className="flex items-center">
                3 Opções de nome para a empresa
                <span className="text-red-600 ml-1">*</span>
              </div>
            }
            tooltip="Sugerimos 3 nomes diferentes para caso algum já esteja registrado"
          >
            <div className="grid grid-cols-3 gap-4">
              <Input
                id="opcao1nome"
                type="text"
                placeholder="Ex: Tech Solutions LTDA"
                value={nome1}
                onChange={(e) => setNome1(e.target.value)}
                disabled={isLoading}
                required
                className={cn(
                  error && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              <Input
                id="opcao2nome"
                type="text"
                placeholder="Ex: Solutions Tech LTDA"
                value={nome2}
                onChange={(e) => setNome2(e.target.value)}
                disabled={isLoading}
                required
                className={cn(
                  error && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              <Input
                id="opcao3nome"
                type="text"
                placeholder="Ex: TS Technology LTDA"
                value={nome3}
                onChange={(e) => setNome3(e.target.value)}
                disabled={isLoading}
                required
                className={cn(
                  error && "border-red-500 focus-visible:ring-red-500"
                )}
              />
            </div>
          </FieldWithTooltip>
        </div>
      </div>

      {/* Informações básicas */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <FieldWithTooltip
            label={
              <div className="flex items-center">
                Nome fantasia
                <span className="text-red-600 ml-1">*</span>
              </div>
            }
            tooltip="Nome comercial pelo qual sua empresa será conhecida"
          >
            <Input
              id="nomefantasia"
              type="text"
              placeholder="Ex: Tech Solutions"
              value={nomeFantasia}
              onChange={(e) => setNomeFantasia(e.target.value)}
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </FieldWithTooltip>
        </div>
        <div>
          <Label htmlFor="cepempresa">CEP</Label>
          <InputMask
            mask="99999-999"
            value={cepEmpresa}
            onChange={handleCepChange}
            disabled={isLoading || isLoadingCep}
            placeholder="12345-678"
          >
            {(inputProps) => (
              <Input
                {...inputProps}
                id="cepempresa"
                className={cn(
                  error && "border-red-500 focus-visible:ring-red-500"
                )}
              />
            )}
          </InputMask>
        </div>
      </div>

      {/* Campos de endereço */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center">
            <Label htmlFor="ruaempresa">Rua</Label>
            <span className="text-red-600 ml-1">*</span>
          </div>
          <Input
            id="ruaempresa"
            type="text"
            placeholder="Ex: Rua das Flores"
            value={rua || ruaEmpresa}
            onChange={(e) => setRuaEmpresa(e.target.value)}
            disabled={isLoading || isLoadingCep}
            required
            className={cn(error && "border-red-500 focus-visible:ring-red-500")}
          />
        </div>
        <div>
          <div className="flex items-center">
            <Label htmlFor="numeroempresa">Número</Label>
            <span className="text-red-600 ml-1">*</span>
          </div>
          <Input
            id="numeroempresa"
            type="text"
            placeholder="Ex: 123"
            value={numeroEmpresa}
            onChange={(e) => setNumeroEmpresa(e.target.value)}
            disabled={isLoading || isLoadingCep}
            required
            className={cn(error && "border-red-500 focus-visible:ring-red-500")}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center">
            <Label htmlFor="bairroempresa">Bairro</Label>
            <span className="text-red-600 ml-1">*</span>
          </div>
          <Input
            id="bairroempresa"
            type="text"
            placeholder="Ex: Centro"
            value={bairro || bairroEmpresa}
            onChange={(e) => setBairroEmpresa(e.target.value)}
            disabled={isLoading || isLoadingCep}
            required
            className={cn(error && "border-red-500 focus-visible:ring-red-500")}
          />
        </div>
        <div>
          <div className="flex items-center">
            <Label htmlFor="municipioempresa">Município</Label>
            <span className="text-red-600 ml-1">*</span>
          </div>
          <Input
            id="municipioempresa"
            type="text"
            placeholder="Ex: São Paulo"
            value={municipio || municipioEmpresa}
            onChange={(e) => setMunicipioEmpresa(e.target.value)}
            disabled={isLoading || isLoadingCep}
            required
            className={cn(error && "border-red-500 focus-visible:ring-red-500")}
          />
        </div>
        <div>
          <div className="flex items-center">
            <Label htmlFor="ufProfissional">UF</Label>
            <span className="text-red-600 ml-1">*</span>
          </div>
          <Select
            value={uf || UFEmpresa}
            onValueChange={(value) => setUFEmpresa(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ex: SC" />
            </SelectTrigger>
            <SelectContent>
              {[
                "AC",
                "AL",
                "AP",
                "AM",
                "BA",
                "CE",
                "DF",
                "ES",
                "GO",
                "MA",
                "MT",
                "MS",
                "MG",
                "PA",
                "PB",
                "PR",
                "PE",
                "PI",
                "RJ",
                "RN",
                "RS",
                "RO",
                "RR",
                "SC",
                "SP",
                "SE",
                "TO",
              ].map((uf) => (
                <SelectItem key={uf} value={uf}>
                  {uf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <FieldWithTooltip
          label="Inscrição imobiliária"
          tooltip="Número de identificação único do imóvel no cadastro municipal, usado para controle e cobrança do IPTU."
        >
          <InputMask
            mask="99-999-999.999-9"
            value={inscricaoImobiliaria}
            onChange={(e) => setInscricaoImobiliaria(e.target.value)}
            disabled={isLoading}
            placeholder="99-999-999.999-9"
            required
          >
            {(inputProps) => (
              <Input
                {...inputProps}
                id="inscricaoimobiliaria"
                className={cn(
                  error && "border-red-500 focus-visible:ring-red-500"
                )}
              />
            )}
          </InputMask>
        </FieldWithTooltip>
      </div>

      {/* Campos financeiros e área */}
      <div className="grid grid-cols-2 gap-6">
        <FieldWithTooltip
          label={
            <div className="flex items-center">
              Valor capital social
              <span className="text-red-600 ml-1">*</span>
            </div>
          }
          tooltip="O capital social é o valor investido pelos sócios na empresa. Representa o patrimônio inicial da empresa."
        >
          <NumericFormat
            customInput={Input}
            value={valorCapitalSocial}
            onValueChange={(values) =>
              setValorCapitalSocial(values.floatValue ?? 0)
            }
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            placeholder="R$ 10.000,00"
            disabled={isLoading}
            required
            className={cn(error && "border-red-500 focus-visible:ring-red-500")}
          />
        </FieldWithTooltip>

        <FieldWithTooltip
          label={
            <div className="flex items-center">
              Área da empresa
              <span className="text-red-600 ml-1">*</span>
            </div>
          }
          tooltip="Área total do estabelecimento em metros quadrados"
        >
          <NumericFormat
            customInput={Input}
            value={areaEmpresa}
            onValueChange={(values) => setAreaEmpresa(values.floatValue ?? 0)}
            thousandSeparator="."
            decimalSeparator=","
            suffix=" m²"
            placeholder="100 m²"
            disabled={isLoading}
            required
            className={cn(error && "border-red-500 focus-visible:ring-red-500")}
          />
        </FieldWithTooltip>
      </div>

      {/* Telefone e Email */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center">
            <Label htmlFor="telefonemepresa">Telefone da empresa</Label>
            <span className="text-red-600 ml-1">*</span>
          </div>{" "}
          <InputMask
            mask="(99) 99999-9999"
            value={telefoneEmpresa}
            onChange={handleTelefoneChange}
            disabled={isLoading}
            placeholder="(47) 99999-9999"
            required
          >
            {(inputProps) => (
              <Input
                {...inputProps}
                id="telefoneEmpresa"
                className={cn(
                  error && "border-red-500 focus-visible:ring-red-500"
                )}
              />
            )}
          </InputMask>
        </div>
        <div>
          <div className="flex items-center">
            <Label htmlFor="email">E-mail da empresa</Label>
            <span className="text-red-600 ml-1">*</span>
          </div>
          <Input
            id="emailEmpresa"
            type="email"
            placeholder="empresa@exemplo.com"
            value={emailEmpresa}
            onChange={(e) => setEmailEmpresa(e.target.value)}
            disabled={isLoading}
            required
            className={cn(error && "border-red-500 focus-visible:ring-red-500")}
          />
        </div>
      </div>

      {/* Capital Integralizado */}
      <div className="grid grid-cols-2 gap-6">
        <FieldWithTooltip
          label={
            <div className="flex items-center">
              Capital será totalmente integralizado?
              <span className="text-red-600 ml-1">*</span>
            </div>
          }
          tooltip="Indica se todo o capital social será investido de imediato na empresa"
        >
          <RadioGroup
            defaultValue={capitalIntegralizado.toString()}
            className="flex space-x-4"
            onValueChange={(value) => setCapitalIntegralizado(value === "true")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <label htmlFor="true">Sim</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <label htmlFor="false">Não</label>
            </div>
          </RadioGroup>
        </FieldWithTooltip>

        <div>
          <div className="flex items-center mb-2">
            <Label htmlFor="dataIntegralizacao">Data de integralização</Label>
            <span className="text-red-600 ml-1">*</span>
          </div>
          <div>
            <Input
              id="dataIntegralizacao"
              type="date"
              value={dataIntegralizacao}
              onChange={(e) => setDataIntegralizacao(e.target.value)}
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
        </div>

        <FieldWithTooltip
          label={
            <div className="flex items-center">
              Empresa será anexada a residência?
              <span className="text-red-600 ml-1">*</span>
            </div>
          }
          tooltip="Sua empresa se localiza na sua residência?"
        >
          <RadioGroup
            defaultValue={empresaAnexadaResidencia.toString()}
            className="flex space-x-4"
            onValueChange={(value) =>
              setEmpresaAnexadaResidencia(value === "true")
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <label htmlFor="true">Sim</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <label htmlFor="false">Não</label>
            </div>
          </RadioGroup>
        </FieldWithTooltip>

        <div>
          <div className="flex items-center">
            <Label htmlFor="enderecocontato">
              Endereço somente para contato?
            </Label>
            <span className="text-red-600 ml-1">*</span>
          </div>
          <RadioGroup
            defaultValue={enderecoContato.toString()}
            className="flex space-x-4"
            onValueChange={(value) => setEnderecoContato(value === "true")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <label htmlFor="true">Sim</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <label htmlFor="false">Não</label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="border-t pt-8 mt-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">Informações adicionais</h2>
          <p className="text-sm text-gray-600">
            Apenas responda se necessário para sua empresa
          </p>
        </div>

        {/* Responsabilidade Técnica */}
        <div className="flex flex-col items-center justify-center">
          <FieldWithTooltip
            label="Necessita de responsabilidade técnica?"
            tooltip="Algumas atividades exigem um responsável técnico habilitado"
          >
            <RadioGroup
              defaultValue={atividadeRespTecnica.toString()}
              className="flex space-x-4 items-center justify-center"
              onValueChange={(value) =>
                setAtividadeRespTecnica(value === "true")
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" />
                <Label>Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" />
                <Label>Não</Label>
              </div>
            </RadioGroup>
          </FieldWithTooltip>
        </div>

        {/* Dados do Responsável Técnico */}
        {atividadeRespTecnica && (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center">
                  <Label htmlFor="respTecnico">Nome do responsável</Label>
                  <span className="text-red-600 ml-1">*</span>
                </div>
                <Input
                  id="respTecnico"
                  type="text"
                  placeholder="Nome completo do responsável"
                  value={nomeRespTecnico}
                  onChange={(e) => setNomeRespTecnico(e.target.value)}
                  disabled={isLoading}
                  required
                  className={cn(
                    error && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </div>

              <div>
                <div className="flex items-center">
                  <Label htmlFor="carteira">Carteira Profissional</Label>
                  <span className="text-red-600 ml-1">*</span>
                </div>
                <Input
                  id="carteira"
                  type="text"
                  placeholder="Nº da carteira profissional"
                  value={carteiraProfissional}
                  onChange={(e) => setCarteiraProfissional(e.target.value)}
                  disabled={isLoading}
                  required
                  className={cn(
                    error && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center">
                  <Label htmlFor="ufProfissional">UF do responsável</Label>
                  <span className="text-red-600 ml-1">*</span>
                </div>
                <Select
                  value={ufProfissional}
                  onValueChange={(value) => setUfProfissional(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="UF do responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "AC",
                      "AL",
                      "AP",
                      "AM",
                      "BA",
                      "CE",
                      "DF",
                      "ES",
                      "GO",
                      "MA",
                      "MT",
                      "MS",
                      "MG",
                      "PA",
                      "PB",
                      "PR",
                      "PE",
                      "PI",
                      "RJ",
                      "RN",
                      "RS",
                      "RO",
                      "RR",
                      "SC",
                      "SP",
                      "SE",
                      "TO",
                    ].map((uf) => (
                      <SelectItem key={uf} value={uf}>
                        {uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center">
                  <Label htmlFor="areaAtuacaoResp">
                    Área de responsabilidade
                  </Label>
                  <span className="text-red-600 ml-1">*</span>
                </div>
                <Input
                  id="areaAtuacaoResp"
                  type="text"
                  placeholder="Área de responsabilidade"
                  value={areaResp}
                  onChange={(e) => setAreaResp(e.target.value)}
                  disabled={isLoading}
                  required
                  className={cn(
                    error && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <Button
        className="w-full"
        type="submit"
        variant="outline"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar e avançar"
        )}
      </Button>

      {/* AlertDialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar envio do formulário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja enviar o formulário? Verifique se todos os
              dados estão corretos, somente seu contador poderá alterar os dados
              posteriormente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}

// Main component with Suspense
const FormularioAbertura = () => {
  return (
    <Suspense fallback={<div>Carregando formulário...</div>}>
      <FormularioAberturaInner />
    </Suspense>
  );
};

export default FormularioAbertura;
