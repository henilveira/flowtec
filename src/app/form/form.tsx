"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import UFSelect from "./uf";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormularioAbertura = () => {
  const { login, isLoading, error } = useLogin();
  const { toast } = useToast();

  // ABERTURA
  const [nome1, setNome1] = useState("");
  const [nome2, setNome2] = useState("");
  const [nome3, setNome3] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cepEmpresa, setCepEmpresa] = useState("");
  const [inscricaoMobiliaria, setInscricaoMobiliaria] = useState("");
  const [telefoneEmpresa, setTelefoneEmpresa] = useState("");
  const [emailEmpresa, setEmailEmpresa] = useState("");
  const [valorCapitalSocial, setValorCapitalSocial] = useState("");
  const [dataIntegralizacao, setDataIntegralizacao] = useState("");
  const [areaEmpresa, setAreaEmpresa] = useState("");
  const [capitalIntegralizado, setCapitalIntegralizado] = useState(false);
  const [empresaAnexadaResidencia, setEmpresaAnexadaResidencia] =
    useState(false);
  const [enderecoContato, setEnderecoContato] = useState(false);

  // INFORMAÇÕES ADICIONAIS
  const [atividadeRespTecnica, setAtividadeRespTecnica] = useState(false);
  const [nomeRespTecnico, setNomeRespTecnico] = useState("");
  const [carteiraProfissional, setCarteiraProfissional] = useState("");
  const [areaResp, setAreaResp] = useState("");

  //SOCIOS
  //1
  const [nomeCompletoSocio1, setNomeCompletoSocio1] = useState("");
  const [nacionalidadeSocio1, setNacionalidadeSocio1] = useState("");
  const [dataNascimentoSocio1, setDataNascimentoSocio1] = useState("");
  const [estadoCivilSocio1, setEstadoCivilSocio1] = useState("");
  const [profissaoSocio1, setProfissaoSocio1] = useState("");
  const [cpfSocio1, setCpfSocio1] = useState("");
  const [rgSocio1, setRgSocio1] = useState("");
  const [orgaoExpedidorSocio1, setOrgaoExpedidorSocio1] = useState("");
  const [ufEmissorSocio1, setUfEmissorSocio1] = useState("");
  const [cepSocio1, setCepSocio1] = useState("");
  const [isAdministradorSocio1, setIsAdministradorSocio1] = useState(false);
  const [tipoAdministradorSocio1, setTipoAdministradorSocio1] = useState("");
  const [quantidedadesQuotaSocio1, setQuantidedadesQuotaSocio1] = useState("");

  //2
  const [nomeCompletoSocio2, setNomeCompletoSocio2] = useState("");
  const [nacionalidadeSocio2, setNacionalidadeSocio2] = useState("");
  const [dataNascimentoSocio2, setDataNascimentoSocio2] = useState("");
  const [estadoCivilSocio2, setEstadoCivilSocio2] = useState("");
  const [profissaoSocio2, setProfissaoSocio2] = useState("");
  const [cpfSocio2, setCpfSocio2] = useState("");
  const [rgSocio2, setRgSocio2] = useState("");
  const [orgaoExpedidorSocio2, setOrgaoExpedidorSocio2] = useState("");
  const [ufEmissorSocio2, setUfEmissorSocio2] = useState("");
  const [cepSocio2, setCepSocio2] = useState("");
  const [isAdministradorSocio2, setIsAdministradorSocio2] = useState(false);
  const [tipoAdministradorSocio2, setTipoAdministradorSocio2] = useState("");
  const [quantidedadesQuotaSocio2, setQuantidedadesQuotaSocio2] = useState("");

  //3
  const [nomeCompletoSocio3, setNomeCompletoSocio3] = useState("");
  const [nacionalidadeSocio3, setNacionalidadeSocio3] = useState("");
  const [dataNascimentoSocio3, setDataNascimentoSocio3] = useState("");
  const [estadoCivilSocio3, setEstadoCivilSocio3] = useState("");
  const [profissaoSocio3, setProfissaoSocio3] = useState("");
  const [cpfSocio3, setCpfSocio3] = useState("");
  const [rgSocio3, setRgSocio3] = useState("");
  const [orgaoExpedidorSocio3, setOrgaoExpedidorSocio3] = useState("");
  const [ufEmissorSocio3, setUfEmissorSocio3] = useState("");
  const [cepSocio3, setCepSocio3] = useState("");
  const [isAdministradorSocio3, setIsAdministradorSocio3] = useState(false);
  const [tipoAdministradorSocio3, setTipoAdministradorSocio3] = useState("");
  const [quantidedadesQuotaSocio3, setQuantidedadesQuotaSocio3] = useState("");

  const [senha, setSenha] = useState("");
  const orgaosExpedidores = [
    "SSP - Secretaria de Segurança Pública",
    "PM - Polícia Militar",
    "PC - Polícia Civil",
    "CNH - Carteira Nacional de Habilitação",
    "DIC - Diretoria de Identificação Civil",
    "CTPS - Carteira de Trabalho e Previdência Social",
    "FGTS - Fundo de Garantia do Tempo de Serviço",
    "IFP - Instituto Félix Pacheco",
    "IPF - Instituto Pereira Faustino",
    "MTE - Ministério do Trabalho e Emprego",
    "MMA - Ministério do Meio Ambiente",
    "OAB - Ordem dos Advogados do Brasil",
    "TRE - Tribunal Regional Eleitoral",
    "TRT - Tribunal Regional do Trabalho",
    "TRF - Tribunal Regional Federal",
    "DGPC - Delegacia Geral de Polícia Civil",
    "SEAP - Secretaria de Administração Penitenciária",
  ];

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // await login(email, senha);
      toast({
        title: "Login efetuado com sucesso!",
        description: "Redirecionando para o painel...",
        duration: 3000,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="mt-8 space-y-4" onSubmit={handleLogin}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="opcao1nome">3 Opções de nome para a empresa</Label>
          <Input
            id="opcao1nome"
            type="text"
            placeholder="Opção 1"
            value={nome1}
            onChange={(e) => setNome1(e.target.value)}
            disabled={isLoading}
            required
            className={cn(error && "border-red-500 focus-visible:ring-red-500")}
          />
          <Input
            id="opcao2nome"
            type="text"
            placeholder="Opção 2"
            value={nome2}
            onChange={(e) => setNome2(e.target.value)}
            disabled={isLoading}
            required
            className={cn(error && "border-red-500 focus-visible:ring-red-500")}
          />
          <Input
            id="opcao3nome"
            type="text"
            placeholder="Opção 3"
            value={nome3}
            onChange={(e) => setNome3(e.target.value)}
            disabled={isLoading}
            required
            className={cn(error && "border-red-500 focus-visible:ring-red-500")}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="nomefantasia">Nome fantasia</Label>
        <Input
          id="nomefantasia"
          type="text"
          placeholder=""
          value={nomeFantasia}
          onChange={(e) => setNomeFantasia(e.target.value)}
          disabled={isLoading}
          required
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
      </div>
      <div>
        <Label htmlFor="cepempresa">CEP</Label>
        <Input
          id="cepempresa"
          type="cep"
          placeholder=""
          value={cepEmpresa}
          onChange={(e) => setCepEmpresa(e.target.value)}
          disabled={isLoading}
          required
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
      </div>
      <div>
        <Label htmlFor="mobiliaria">Inscrição mobiliária</Label>
        <Input
          id="mobiliaria"
          type="text"
          placeholder=""
          value={inscricaoMobiliaria}
          onChange={(e) => setInscricaoMobiliaria(e.target.value)}
          disabled={isLoading}
          required
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
      </div>
      <div>
        <Label htmlFor="telefoneEmpresa">Telefone da empresa</Label>
        <Input
          id="telefoneEmpresa"
          type="text"
          placeholder=""
          value={telefoneEmpresa}
          onChange={(e) => setTelefoneEmpresa(e.target.value)}
          disabled={isLoading}
          required
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
      </div>
      <div>
        <Label htmlFor="emailEmpresa">E-mail da empresa</Label>
        <Input
          id="emailEmpresa"
          type="email"
          placeholder=""
          value={emailEmpresa}
          onChange={(e) => setEmailEmpresa(e.target.value)}
          disabled={isLoading}
          required
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
      </div>
      <div>
        <Label htmlFor="capitalSocial">Valor capital social</Label>
        <Input
          id="capitalSocial"
          type="text"
          placeholder=""
          value={valorCapitalSocial}
          onChange={(e) => setValorCapitalSocial(e.target.value)}
          disabled={isLoading}
          required
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
      </div>
      <div className="flex flex-col space-y-4">
        <Label htmlFor="capitalIntegralizado">Capital será totalmente integralizado?</Label>
        <RadioGroup
          defaultValue={capitalIntegralizado.toString()} // Define o valor inicial como string
          className="flex"
          onValueChange={(value) => setCapitalIntegralizado(value === "true")} // Converte para booleano
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" />
            <Label>Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false"/>
            <Label>Não</Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label htmlFor="dataIntegralizacao">Data de integralização</Label>
        <Input
          id="dataIntegralizacao"
          type="date"
          value={dataIntegralizacao} // Corrigido para usar o estado correto
          onChange={(e) => setDataIntegralizacao(e.target.value)} // Atualiza o estado nome3
          disabled={isLoading}
          required
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
      </div>
      <div>
        <Label htmlFor="areaEmpresa">Área da empresa</Label>
        <Input
          id="areaEmpresa"
          type="text"
          value={areaEmpresa} // Corrigido para usar o estado correto
          onChange={(e) => setAreaEmpresa(e.target.value)} // Atualiza o estado nome3
          disabled={isLoading}
          required
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
      </div>
      <div className="flex flex-col space-y-4">
        <Label htmlFor="AnexadaResidencia">A empresa será anexa a residência?</Label>
        <RadioGroup
          defaultValue={empresaAnexadaResidencia.toString()} // Define o valor inicial como string
          className="flex"
          onValueChange={(value) =>
            setEmpresaAnexadaResidencia(value === "true")
          } // Converte para booleano
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="sim-anexo" />
            <Label>Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="nao-anexo" />
            <Label>Não</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="flex flex-col space-y-4">
        <Label htmlFor="enderecoContato">Endereço apenas para contato?</Label>
        <RadioGroup
          defaultValue={enderecoContato.toString()} // Define o valor inicial como string
          className="flex"
          onValueChange={(value) => setEnderecoContato(value === "true")} // Converte para booleano
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="sim-contato" />
            <Label>Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" />

            <Label>Não</Label>
          </div>
        </RadioGroup>
      </div>
      <hr className="" />
      <div className="space-y-4">
        <div className=" flex flex-col items-center justify-center mb-6">
          <h1 className="text-xl font-semibold">Informações adicionais</h1>
          <span className="text-sm text-gray-600">
            Apenas responda se necessário para sua empresa
          </span>
        </div>
        <div className="flex flex-col space-y-4">
          <Label htmlFor="RespTecnica">
            A atividade da filial necessita de responsabilidade técnica?
          </Label>
          <RadioGroup
            defaultValue={atividadeRespTecnica.toString()} // Define o valor inicial como string
            className="flex"
            onValueChange={(value) => setAtividadeRespTecnica(value === "true")} // Converte para booleano
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
        </div>
        <div className="space-y-2">
          <Label htmlFor="respTecnico">Quem será o responsável?</Label>
          <Input
            id="respTecnico"
            type="text"
            placeholder="Nome completo do responsável"
            value={nomeRespTecnico}
            onChange={(e) => setNomeRespTecnico(e.target.value)}
            disabled={isLoading}
            required
            className={cn(error && "border-red-500 focus-visible:ring-red-500")}
          />
          <Input
            id="carteira"
            type="text"
            placeholder="N° carteira de profissional"
            value={carteiraProfissional}
            onChange={(e) => setCarteiraProfissional(e.target.value)}
            disabled={isLoading}
            required
            className={cn(error && "border-red-500 focus-visible:ring-red-500")}
          />
          <UFSelect />
          <Input
            id="areaAtuacaoResp"
            type="text"
            placeholder="Área de responsabilidade"
            value={areaResp}
            onChange={(e) => setAreaResp(e.target.value)}
            disabled={isLoading}
            required
            className={cn(error && "border-red-500 focus-visible:ring-red-500")}
          />
        </div>
      </div>
      <hr className="" />
      <div className="space-y-4">
        <div className=" flex flex-col items-center justify-center mb-6">
          <h1 className="text-xl font-semibold">Dados sócios</h1>
          <span className="text-sm text-gray-600">
            Insira os dados dos associados a sua empresa
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <h2 className="text-lg font-medium">Sócio 1</h2>
          </div>
          <div>
            <Label htmlFor="nomeSocio1">Nome completo</Label>
            <Input
              id="nomeSocio1"
              type="text"
              placeholder="Fulano da Silva"
              value={nomeCompletoSocio1}
              onChange={(e) => setNomeCompletoSocio1(e.target.value)}
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="nacionalidadeSocio1">Nacionalidade</Label>
            <Input
              id="nacionalidadeSocio1"
              type="text"
              placeholder="Brasileiro(a)"
              value={nacionalidadeSocio1}
              onChange={(e) => setNacionalidadeSocio1(e.target.value)}
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          
          <div>
            <Label htmlFor="datanascSocio1">Data de nascimento</Label>
            <Input
              id="datanascSocio1"
              type="date"
              value={dataNascimentoSocio1} // Corrigido para usar o estado correto
              onChange={(e) => setDataNascimentoSocio1(e.target.value)} // Atualiza o estado nome3
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="profissaoSocio1">Profissão</Label>
            <Input
              id="profissaoSocio1"
              type="text"
              placeholder=""
              value={profissaoSocio1}
              onChange={(e) => setProfissaoSocio1(e.target.value)}
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="cepSocio1">CEP</Label>
            <Input
              id="cepSocio1"
              type="cep"
              placeholder=""
              value={cepSocio1}
              onChange={(e) => setCepSocio1(e.target.value)}
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="estado-civilSocio1">Estado Civil</Label>
            <Select onValueChange={(value) => setEstadoCivilSocio1(value)}>
              <SelectTrigger id="estado-civilSocio1" className="w-full">
                <SelectValue placeholder="Selecione seu estado civil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                <SelectItem value="casado">Casado(a)</SelectItem>
                <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                <SelectItem value="uniao-estavel">União Estável</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="cpfSocio1">CPF</Label>
            <Input
              id="cpfSocio1"
              type="cpf"
              value={cpfSocio1} // Corrigido para usar o estado correto
              onChange={(e) => setCpfSocio1(e.target.value)} // Atualiza o estado nome3
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="rgSocio1">RG</Label>
            <Input
              id="rgSocio1"
              type="text"
              value={rgSocio1} // Corrigido para usar o estado correto
              onChange={(e) => setRgSocio1(e.target.value)} // Atualiza o estado nome3
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="orgao-expedidorSocio1">Órgão Expedidor</Label>
            <Select onValueChange={(value) => setOrgaoExpedidorSocio1(value)}>
              <SelectTrigger id="orgao-expedidorSocio1" className="w-full">
                <SelectValue placeholder="Selecione o órgão expedidor" />
              </SelectTrigger>
              <SelectContent>
                {orgaosExpedidores.map((orgao) => (
                  <SelectItem key={orgao} value={orgao}>
                    {orgao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ufSocio1">UF Emitido</Label>
            <Select onValueChange={(value) => setUfEmissorSocio1(value)}>
              <SelectTrigger id="ufSocio1" className="w-full">
                <SelectValue placeholder="Selecione a UF" />
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
            <Label htmlFor="quotasSocio1">Quantidade de quotas na sociedade</Label>
            <Input
              id="quotasSocio1"
              type="text"
              placeholder=""
              value={quantidedadesQuotaSocio1}
              onChange={(e) => setQuantidedadesQuotaSocio1(e.target.value)}
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div className="flex flex-col space-y-4">
            <Label htmlFor="isAdministradorSocio1">É administrador?</Label>
            <RadioGroup
              defaultValue={isAdministradorSocio1.toString()} // Define o valor inicial como string
              className="flex space-x-2"
              onValueChange={(value) =>
                setIsAdministradorSocio1(value === "true")
              } // Converte para booleano
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
          </div>
          <div className="flex flex-col space-y-4">
            <Label htmlFor="tipoAdministradorSocio1">Se for administrador, será?</Label>
            <RadioGroup
              defaultValue={tipoAdministradorSocio1.toString()} // Define o valor inicial como string
              className="flex space-x-2"
              onValueChange={(value) => setTipoAdministradorSocio1(value)} // Mantém o valor como string
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Conjunto" id="option-one" />
                <Label>Conjunto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Isoladamente" id="option-two" />
                <Label>Isoladamente</Label>
              </div>
            </RadioGroup>
          </div>

        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <h2 className="text-lg font-medium">Sócio 2</h2>
          </div>
          <div>
            <Label htmlFor="nomeSocio2">Nome completo</Label>
            <Input
              id="nomeSocio2"
              type="text"
              placeholder="Fulano da Silva"
              value={nomeCompletoSocio2}
              onChange={(e) => setNomeCompletoSocio2(e.target.value)}
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="nacionalidadeSocio2">Nacionalidade</Label>
            <Input
              id="nacionalidadeSocio2"
              type="text"
              placeholder="Brasileiro(a)"
              value={nacionalidadeSocio2}
              onChange={(e) => setNacionalidadeSocio2(e.target.value)}
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="datanascSocio2">Data de nascimento</Label>
            <Input
              id="datanascSocio2"
              type="date"
              value={dataNascimentoSocio2} // Corrigido para usar o estado correto
              onChange={(e) => setDataNascimentoSocio2(e.target.value)} // Atualiza o estado nome3
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="profissaoSocio2">Profissão</Label>
            <Input
              id="profissaoSocio2"
              type="text"
              placeholder=""
              value={profissaoSocio2}
              onChange={(e) => setProfissaoSocio2(e.target.value)}
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="CEPSocio2">CEP</Label>
            <Input
              id="CEPSocio2"
              type="cep"
              placeholder=""
              value={cepSocio2}
              onChange={(e) => setCepSocio2(e.target.value)}
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="estado-civilSocio2">Estado Civil</Label>
            <Select onValueChange={(value) => setEstadoCivilSocio2(value)}>
              <SelectTrigger id="estado-civilSocio2" className="w-full">
                <SelectValue placeholder="Selecione seu estado civil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                <SelectItem value="casado">Casado(a)</SelectItem>
                <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                <SelectItem value="uniao-estavel">União Estável</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="cpfSocio2">CPF</Label>
            <Input
              id="cpfSocio2"
              type="cpf"
              value={cpfSocio2} // Corrigido para usar o estado correto
              onChange={(e) => setCpfSocio2(e.target.value)} // Atualiza o estado nome3
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="rgSocio2">RG</Label>
            <Input
              id="rgSocio2"
              type="text"
              value={rgSocio2} // Corrigido para usar o estado correto
              onChange={(e) => setRgSocio2(e.target.value)} // Atualiza o estado nome3
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="orgao-expedidorSocio2">Órgão Expedidor</Label>
            <Select onValueChange={(value) => setOrgaoExpedidorSocio2(value)}>
              <SelectTrigger id="orgao-expedidorSocio2" className="w-full">
                <SelectValue placeholder="Selecione o órgão expedidor" />
              </SelectTrigger>
              <SelectContent>
                {orgaosExpedidores.map((orgao) => (
                  <SelectItem key={orgao} value={orgao}>
                    {orgao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ufSocio2">UF Emitido</Label>
            <Select onValueChange={(value) => setUfEmissorSocio2(value)}>
              <SelectTrigger id="ufSocio2" className="w-full">
                <SelectValue placeholder="Selecione a UF" />
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
            <Label htmlFor="quotasSocio2">Quantidade de quotas na sociedade</Label>
            <Input
              id="quotasSocio2"
              type="text"
              placeholder=""
              value={quantidedadesQuotaSocio2}
              onChange={(e) => setQuantidedadesQuotaSocio2(e.target.value)}
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div className="flex flex-col space-y-4">
            <Label htmlFor="isAdministradorSocio2">É administrador?</Label>
            <RadioGroup
              defaultValue={isAdministradorSocio2.toString()} // Define o valor inicial como string
              className="flex space-x-2"
              onValueChange={(value) =>
                setCapitalIntegralizado(value === "true")
              } // Converte para booleano
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
          </div>
          <div className="flex flex-col space-y-4">
            <Label htmlFor="tipoAdministradorSocio2">Se for administrador, será?</Label>
            <RadioGroup
              defaultValue={tipoAdministradorSocio2.toString()} // Define o valor inicial como string
              className="flex space-x-2"
              onValueChange={(value) => setTipoAdministradorSocio2(value)} // Mantém o valor como string
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Conjunto" id="option-one" />
                <Label>Conjunto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Isoladamente" id="option-two" />
                <Label>Isoladamente</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <h2 className="text-lg font-medium">Sócio 3</h2>
          </div>
          <div>
            <Label htmlFor="nomeSocio3">Nome completo</Label>
            <Input
              id="nomeSocio3"
              type="text"
              placeholder="Fulano da Silva"
              value={nomeCompletoSocio3}
              onChange={(e) => setNomeCompletoSocio3(e.target.value)}
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="nacionalidadeSocio3">Nacionalidade</Label>
            <Input
              id="nacionalidadeSocio3"
              type="text"
              placeholder="Brasileiro(a)"
              value={nacionalidadeSocio3}
              onChange={(e) => setNacionalidadeSocio3(e.target.value)}
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="datanascSocio3">Data de nascimento</Label>
            <Input
              id="datanascSocio3"
              type="date"
              value={dataNascimentoSocio3} // Corrigido para usar o estado correto
              onChange={(e) => setDataNascimentoSocio3(e.target.value)} // Atualiza o estado nome3
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="profissaoSocio3">Profissão</Label>
            <Input
              id="profissaoSocio3"
              type="text"
              placeholder=""
              value={profissaoSocio3}
              onChange={(e) => setProfissaoSocio3(e.target.value)}
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="CEPSocio3">CEP</Label>
            <Input
              id="CEPSocio3"
              type="cep"
              placeholder=""
              value={cepSocio3}
              onChange={(e) => setCepSocio3(e.target.value)}
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="estado-civilSocio3">Estado Civil</Label>
            <Select onValueChange={(value) => setEstadoCivilSocio3(value)}>
              <SelectTrigger id="estado-civilSocio3" className="w-full">
                <SelectValue placeholder="Selecione seu estado civil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                <SelectItem value="casado">Casado(a)</SelectItem>
                <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                <SelectItem value="uniao-estavel">União Estável</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="cpfSocio3">CPF</Label>
            <Input
              id="cpfSocio3"
              type="cpf"
              value={cpfSocio3} // Corrigido para usar o estado correto
              onChange={(e) => setCpfSocio3(e.target.value)} // Atualiza o estado nome3
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="rgSocio3">RG</Label>
            <Input
              id="rgSocio3"
              type="text"
              value={rgSocio3} // Corrigido para usar o estado correto
              onChange={(e) => setRgSocio3(e.target.value)} // Atualiza o estado nome3
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div>
            <Label htmlFor="orgao-expedidorSocio3">Órgão Expedidor</Label>
            <Select onValueChange={(value) => setOrgaoExpedidorSocio3(value)}>
              <SelectTrigger id="orgao-expedidorSocio3" className="w-full">
                <SelectValue placeholder="Selecione o órgão expedidor" />
              </SelectTrigger>
              <SelectContent>
                {orgaosExpedidores.map((orgao) => (
                  <SelectItem key={orgao} value={orgao}>
                    {orgao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ufSocio3">UF Emitido</Label>
            <Select onValueChange={(value) => setUfEmissorSocio3(value)}>
              <SelectTrigger id="ufSocio3" className="w-full">
                <SelectValue placeholder="Selecione a UF" />
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
            <Label htmlFor="quotasSocio3">Quantidade de quotas na sociedade</Label>
            <Input
              id="quotasSocio3"
              type="text"
              placeholder=""
              value={quantidedadesQuotaSocio3}
              onChange={(e) => setQuantidedadesQuotaSocio3(e.target.value)}
              disabled={isLoading}
              required
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
          <div className="flex flex-col space-y-4">
            <Label htmlFor="isAdministradorSocio3">É administrador?</Label>
            <RadioGroup
              defaultValue={isAdministradorSocio3.toString()} // Define o valor inicial como string
              className="flex space-x-2"
              onValueChange={(value) =>
                setIsAdministradorSocio3(value === "true")
              } // Converte para booleano
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
          </div>
          <div className="flex flex-col space-y-4">
            <Label htmlFor="tipoAdministradorSocio3">Se for administrador, será?</Label>
            <RadioGroup
              defaultValue={tipoAdministradorSocio3.toString()} // Define o valor inicial como string
              className="flex space-x-2"
              onValueChange={(value) => setTipoAdministradorSocio3(value)} // Mantém o valor como string
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Conjunto" id="option-one" />
                <Label>Conjunto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Isoladamente" id="option-two" />
                <Label>Isoladamente</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Exibe erro da API se houver algum */}
      {error && <div className="text-sm text-red-500">{error}</div>}

      <Button
        variant="flowtec"
        className="w-full"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar"
        )}
      </Button>
    </form>
  );
};

export default FormularioAbertura;
