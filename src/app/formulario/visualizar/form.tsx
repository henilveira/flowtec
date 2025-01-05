"use client";
import { useEffect, useState } from "react";
import { useFormById } from "@/hooks/useForm";
import InputMask from "react-input-mask";

import { toast } from "sonner"; // ou sua biblioteca de toast preferida
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import FieldWithTooltip from "../tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NumericFormat } from "react-number-format";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const FormularioAbertura = () => {
  const router = useRouter();

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

  const searchParams = useSearchParams();
  const id = searchParams.get("id"); //
  const { formulario, isError: error } = useFormById(id); // Hook retornando dados diretamente

  const [isEditing, setIsEditing] = useState(true);

  const handleEditing = () => {
    if (isEditing) {
      setIsEditing(false);
      toast.success("Agora você pode editar os dados!");
    } else {
      setIsEditing(true);
      toast.error("Você desativou a edição.");
    }
  };

  useEffect(() => {
    if (formulario) {
      // Essenciais
      setNome1(formulario?.opcoes_nome_empresa?.[0]);
      setNome2(formulario?.opcoes_nome_empresa?.[1]);
      setNome3(formulario?.opcoes_nome_empresa?.[2]);
      setNomeFantasia(formulario?.nome_fantasia);
      setEnderecoContato(formulario?.endereco_apenas_contato);
      setInscricaoImobiliaria(formulario?.inscricao_imob);
      setTelefoneEmpresa(formulario?.telefone);
      setAreaEmpresa(formulario?.area_empresa);
      setEmailEmpresa(formulario.email);
      setDataIntegralizacao(formulario.data_integralizacao);
      setValorCapitalSocial(formulario.val_capital_social);
      setCapitalIntegralizado(formulario.capital_integralizado);
      setEmpresaAnexadaResidencia(formulario.empresa_anexa_resid);

      // Endereco
      setCepEmpresa(formulario?.endereco?.cep || "");
      setNumeroEmpresa(formulario?.endereco?.numero || "");
      setBairroEmpresa(formulario?.endereco?.bairro || "");
      setRuaEmpresa(formulario?.endereco?.rua || "");
      setMunicipioEmpresa(formulario?.endereco?.municipio || "");
      setUFEmpresa(formulario?.endereco?.uf || "");

      // Infos adicionais
      setAtividadeRespTecnica(formulario.info_adicionais?.resp_tecnica);
      setAreaResp(formulario.info_adicionais?.area_resp || "");
      setNomeRespTecnico(formulario.info_adicionais?.nome_responsavel || "");
      setCarteiraProfissional(
        formulario.info_adicionais?.nome_responsavel || "",
      );
      setAtividadeRespTecnica(
        formulario.info_adicionais?.resp_tecnica || false,
      );
    }
    setUfProfissional(formulario?.info_adicionais?.uf || "");

    if (error) {
      toast.error("Erro ao carregar dados", {
        description: "Possivelmente não preenchido ainda",
      });
    }
  }, [formulario, error]);

  return (
    <form className="mt-8 space-y-8 bg-white p-4 rounded-lg max-w-2xl mx-auto">
      {/* Seção de nomes da empresa */}
      <div className="space-y-4">
        <FieldWithTooltip
          label="3 Opções de nome para a empresa"
          tooltip="Sugerimos 3 nomes diferentes para caso algum já esteja registrado"
        >
          <div className="grid grid-cols-3 gap-4">
            <Input
              id="opcao1nome"
              type="text"
              placeholder="Ex: Tech Solutions LTDA"
              value={nome1}
              onChange={(e) => setNome1(e.target.value)}
              readOnly={isEditing}
            />
            <Input
              id="opcao2nome"
              type="text"
              placeholder="Ex: Solutions Tech LTDA"
              value={nome2}
              onChange={(e) => setNome2(e.target.value)}
              readOnly={isEditing}
            />
            <Input
              id="opcao3nome"
              type="text"
              placeholder="Ex: TS Technology LTDA"
              value={nome3}
              onChange={(e) => setNome3(e.target.value)}
              readOnly={isEditing}
            />
          </div>
        </FieldWithTooltip>
      </div>

      {/* Informações básicas */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <FieldWithTooltip
            label="Nome fantasia"
            tooltip="Nome comercial pelo qual sua empresa será conhecida"
          >
            <Input
              id="nomefantasia"
              type="text"
              placeholder="Ex: Tech Solutions"
              value={nomeFantasia}
              onChange={(e) => setNomeFantasia(e.target.value)}
              readOnly={isEditing}
            />
          </FieldWithTooltip>
        </div>
        <div>
          <Label htmlFor="cepempresa">CEP</Label>
          <InputMask
            mask="99999-999"
            value={cepEmpresa}
            placeholder="12345-678"
            onChange={(e) => setCepEmpresa(e.target.value)}
          >
            {(inputProps) => <Input {...inputProps} id="cepempresa" />}
          </InputMask>
        </div>
      </div>

      {/* Campos de endereço */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="ruaempresa">Rua</Label>
          <Input
            id="ruaempresa"
            type="text"
            placeholder="Ex: Rua das Flores"
            value={ruaEmpresa}
            onChange={(e) => setRuaEmpresa(e.target.value)}
            readOnly={isEditing}
          />
        </div>
        <div>
          <Label htmlFor="numeroempresa">Número</Label>
          <Input
            id="numeroempresa"
            type="text"
            placeholder="Ex: 123"
            value={numeroEmpresa}
            onChange={(e) => setNumeroEmpresa(e.target.value)}
            readOnly={isEditing}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="bairroempresa">Bairro</Label>
          <Input
            id="bairroempresa"
            type="text"
            placeholder="Ex: Centro"
            value={bairroEmpresa}
            onChange={(e) => setBairroEmpresa(e.target.value)}
            readOnly={isEditing}
          />
        </div>
        <div>
          <Label htmlFor="municipioempresa">Município</Label>
          <Input
            id="municipioempresa"
            type="text"
            placeholder="Ex: São Paulo"
            value={municipioEmpresa}
            onChange={(e) => setMunicipioEmpresa(e.target.value)}
            readOnly={isEditing}
          />
        </div>
        <div>
          <Label htmlFor="ufProfissional">UF</Label>
          <Select
            value={UFEmpresa}
            onValueChange={(value) => setUFEmpresa(value)}
            disabled={isEditing}
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
          label="Inscrição imboiliária"
          tooltip="Número de identificação único do imóvel no cadastro municipal, usado para controle e cobrança do IPTU."
        >
          <InputMask
            mask="99-999-999.999-9"
            value={inscricaoImobiliaria}
            onChange={(e) => setInscricaoImobiliaria(e.target.value)}
            placeholder="99-999-999.999-9"
          >
            {(inputProps) => (
              <Input {...inputProps} id="inscricaoimobiliaria" />
            )}
          </InputMask>
        </FieldWithTooltip>
      </div>

      {/* Campos financeiros e área */}
      <div className="grid grid-cols-2 gap-6">
        <FieldWithTooltip
          label="Valor capital social"
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
            readOnly={isEditing}
          />
        </FieldWithTooltip>

        <FieldWithTooltip
          label="Área da empresa"
          tooltip="Área total do estabelecimento em metros quadrados"
        >
          <NumericFormat
            customInput={Input}
            value={areaEmpresa}
            thousandSeparator="."
            decimalSeparator=","
            suffix=" m²"
            placeholder="100 m²"
            readOnly={isEditing}
          />
        </FieldWithTooltip>
      </div>

      {/* Telefone e Email */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="telefoneEmpresa">Telefone da empresa</Label>
          <InputMask
            mask="(99) 99999-9999"
            value={telefoneEmpresa}
            placeholder="(47) 99999-9999"
          >
            {(inputProps) => <Input {...inputProps} id="telefoneEmpresa" />}
          </InputMask>
        </div>
        <div>
          <Label htmlFor="email">E-mail da empresa</Label>
          <Input
            id="emailEmpresa"
            type="e-mail"
            placeholder="empresa@exemplo.com"
            value={emailEmpresa}
            onChange={(e) => setEmailEmpresa(e.target.value)}
            readOnly={isEditing}
          />
        </div>
      </div>

      {/* Capital Integralizado */}
      <div className="grid grid-cols-2 gap-6">
        <FieldWithTooltip
          label="Capital será totalmente integralizado?"
          tooltip="Indica se todo o capital social será investido de imediato na empresa"
        >
          <RadioGroup
            value={capitalIntegralizado.toString()}
            className="flex space-x-4"
            disabled={isEditing}
            onValueChange={(value) => {
              setCapitalIntegralizado(value === "true");
            }}
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

        <div className="">
          <div className="mb-2">
            <Label htmlFor="dataIntegralizacao">Data de integralização</Label>
          </div>
          <div>
            <Input
              id="dataIntegralizacao"
              type="date"
              value={dataIntegralizacao}
              readOnly={isEditing}
            />
          </div>
        </div>

        <FieldWithTooltip
          label="Empresa será anexada a residência?"
          tooltip="Sua empresa se localiza na sua residência?"
        >
          <RadioGroup
            value={empresaAnexadaResidencia.toString()}
            className="flex space-x-4"
            disabled={isEditing}
            onValueChange={(value) => {
              setEmpresaAnexadaResidencia(value === "true");
            }}
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
          <Label htmlFor="enderecocontato">
            Endereço somente para contato?
          </Label>
          <RadioGroup
            value={enderecoContato.toString()}
            className="flex space-x-4"
            disabled={isEditing} // Ensure isEditing is false when you want to edit
            onValueChange={(value) => {
              setEnderecoContato(value === "true");
            }}
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
              value={atividadeRespTecnica.toString()}
              className="flex space-x-4 items-center justify-center"
              disabled={isEditing}
              onValueChange={(value) => {
                setAtividadeRespTecnica(value === "true");
              }}
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
              {/* Nome do Responsável */}
              <div>
                <Label htmlFor="respTecnico">Nome do responsável</Label>
                <Input
                  id="respTecnico"
                  type="text"
                  placeholder="Nome completo do responsável"
                  value={nomeRespTecnico}
                  onChange={(e) => setNomeRespTecnico(e.target.value)}
                  readOnly={isEditing}
                />
              </div>

              {/* Carteira Profissional */}
              <div>
                <Label htmlFor="carteira">Carteira Profissional</Label>
                <Input
                  id="carteira"
                  type="text"
                  placeholder="Nº da carteira profissional"
                  value={carteiraProfissional}
                  onChange={(e) => setCarteiraProfissional(e.target.value)}
                  readOnly={isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* UF do Responsável */}
              <div>
                <Label htmlFor="ufProfissional">UF do responsável</Label>
                <Select
                  disabled={isEditing}
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

              {/* Área de Responsabilidade */}
              <div>
                <Label htmlFor="areaAtuacaoResp">
                  Área de responsabilidade
                </Label>
                <Input
                  id="areaAtuacaoResp"
                  type="text"
                  placeholder="Área de responsabilidade"
                  value={areaResp}
                  onChange={(e) => setAreaResp(e.target.value)}
                  readOnly={isEditing}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex-1 items-end text-right space-x-3">
        <Button type="button" variant="outline" onClick={handleEditing}>
          <div className="space-x-2 flex items-center gap-2">
            Editar <Pencil className="h-3 w-3" />
          </div>
        </Button>
        <Button type="button" variant="flowtec" onClick={handleEditing}>
          Salvar alterações
        </Button>
      </div>
    </form>
  );
};

export default FormularioAbertura;
