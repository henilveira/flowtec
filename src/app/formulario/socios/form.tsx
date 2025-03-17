import { Socio, Socios } from "@/@types/Formulario";
import { useFormActions } from "@/hooks/useForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState, useEffect, Suspense } from "react";
import InputMask from "react-input-mask";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { estados } from "../estados";
import { orgaosExpedidores } from "../orgaos-expedidores";
import { useFormContext } from "@/contexts/form-context";
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
import { useRouter, useSearchParams } from "next/navigation";

// Inner component that uses useSearchParams
function PartnerFormInner() {
  const [socios, setSocios] = useState<Socio[]>([
    {
      nome: "",
      nacionalidade: "",
      data_nascimento: "",
      estado_civil: "",
      regime_casamento: "",
      profissao: "",
      cpf: "",
      rg: "",
      orgao_expedidor: "",
      uf: "",
      administrador: false,
      tipo_administrador: "",
      qtd_cotas: 0,
      endereco: {
        rua: "",
        numero: 0,
        bairro: "",
        cep: "",
        municipio: "",
        complemento: "",
        uf: "",
      },
    },
  ]);

  const { criarSocios, isLoading, error } = useFormActions();
  const { formId, setFormId } = useFormContext();
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState<Socios | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (urlId && !formId) {
      setFormId(urlId);
    }
  }, [urlId, formId, setFormId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!formId && !urlId) {
        toast.error("ID do formulário não encontrado", {
          description: "Redirecionando para o início do formulário",
        });
        router.push("/formulario/abertura");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formId, urlId, router]);

  const handleSocioChange = (
    index: number,
    field: string,
    value: string | boolean | number
  ) => {
    const updatedSocios = [...socios];
    if (field.startsWith("endereco.")) {
      const enderecoField = field.split(".")[1];
      updatedSocios[index].endereco = {
        ...updatedSocios[index].endereco,
        [enderecoField]: value,
      };
    } else {
      updatedSocios[index] = {
        ...updatedSocios[index],
        [field]: value,
      };
    }
    setSocios(updatedSocios);
  };

  const handleCepChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const cep = event.target.value.replace(/\D/g, "");
    handleSocioChange(index, "endereco.cep", cep);
  };

  const addSocio = () => {
    setSocios([
      ...socios,
      {
        nome: "",
        nacionalidade: "",
        data_nascimento: "",
        estado_civil: "",
        regime_casamento: "",
        profissao: "",
        cpf: "",
        rg: "",
        orgao_expedidor: "",
        uf: "",
        administrador: false,
        tipo_administrador: "",
        qtd_cotas: 0,
        endereco: {
          rua: "",
          numero: 0,
          bairro: "",
          cep: "",
          municipio: "",
          complemento: "",
          uf: "",
        },
      },
    ]);
  };

  const removeSocio = (index: number) => {
    if (socios.length > 1) {
      const updatedSocios = socios.filter(
        (_, indexAtual) => indexAtual !== index
      );
      setSocios(updatedSocios);
    }
  };

  const validateSocios = () => {
    for (const socio of socios) {
      if (!socio.nome || !socio.cpf || !socio.data_nascimento) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return false;
      }

      if (socio.estado_civil === "casado" && !socio.regime_casamento) {
        toast.error("Regime de casamento é obrigatório para sócios casados");
        return false;
      }

      if (socio.administrador && !socio.tipo_administrador) {
        toast.error(
          "Tipo de administrador é obrigatório para sócios administradores"
        );
        return false;
      }
    }
    return true;
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateSocios()) {
      return;
    }

    if (!formId && !urlId) {
      toast.error("ID do formulário não encontrado", {
        description: "Volte para a etapa anterior e tente novamente",
      });
      return;
    }

    const formData: Socios = {
      empresa_id: formId || urlId,
      socios: socios.map((socio) => ({
        nome: socio.nome,
        nacionalidade: socio.nacionalidade,
        data_nascimento: socio.data_nascimento,
        estado_civil: socio.estado_civil,
        regime_casamento:
          socio.estado_civil === "casado" ? socio.regime_casamento : undefined,
        profissao: socio.profissao,
        cpf: socio.cpf,
        rg: socio.rg,
        orgao_expedidor: socio.orgao_expedidor,
        uf: socio.uf,
        administrador: socio.administrador,
        tipo_administrador: socio.administrador ? socio.tipo_administrador : "",
        qtd_cotas: Number(socio.qtd_cotas),
        endereco: {
          rua: socio.endereco.rua,
          numero: Number(socio.endereco.numero),
          bairro: socio.endereco.bairro || "",
          cep: socio.endereco.cep,
          municipio: socio.endereco.municipio || "",
          complemento: socio.endereco.complemento,
          uf: socio.endereco.uf || "",
        },
      })),
    };

    setFormDataToSubmit(formData);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    if (!formDataToSubmit) {
      return;
    }

    try {
      await criarSocios(formDataToSubmit);
      toast.success("Sócios cadastrados com sucesso!");
      setShowConfirmDialog(false);

      router.push(`/formulario/finalizado${formId ? `?id=${formId}` : ""}`);
    } catch (error) {
      toast.error("Erro ao cadastrar sócios. Por favor, tente novamente.");
      console.error(error);
      setShowConfirmDialog(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="p-4 space-y-8">
      {socios.map((socio, index) => (
        <div
          key={index}
          className="border p-4 my-4 rounded-lg relative bg-white shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Sócio {index + 1}</h3>
            {socios.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeSocio(index)}
              >
                Remover
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dados Pessoais */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor={`nome-${index}`}>Nome Completo</Label>
                <span className="text-red-600 ml-1">*</span>
              </div>
              <Input
                id={`nome-${index}`}
                value={socio.nome}
                onChange={(event) =>
                  handleSocioChange(index, "nome", event.target.value)
                }
                placeholder="Nome completo do sócio"
                required
                className={cn(error && "border-red-500")}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor={`nacionalidade-${index}`}>Nacionalidade</Label>
                <span className="text-red-600 ml-1">*</span>
              </div>
              <Input
                id={`nacionalidade-${index}`}
                value={socio.nacionalidade}
                onChange={(event) =>
                  handleSocioChange(index, "nacionalidade", event.target.value)
                }
                placeholder="Ex: Brasileiro"
                required
                className={cn(error && "border-red-500")}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor={`data_nascimento-${index}`}>
                  Data de Nascimento
                </Label>
                <span className="text-red-600 ml-1">*</span>
              </div>
              <Input
                id={`data_nascimento-${index}`}
                type="date"
                value={socio.data_nascimento}
                onChange={(event) =>
                  handleSocioChange(
                    index,
                    "data_nascimento",
                    event.target.value
                  )
                }
                required
                className={cn(error && "border-red-500")}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor={`estado_civil-${index}`}>Estado Civil</Label>
                <span className="text-red-600 ml-1">*</span>
              </div>
              <Select
                value={socio.estado_civil}
                onValueChange={(value) =>
                  handleSocioChange(index, "estado_civil", value)
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado civil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                  <SelectItem value="casado">Casado(a)</SelectItem>
                  <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                  <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {socio.estado_civil === "casado" && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor={`regime_casamento-${index}`}>
                    Regime de Casamento
                  </Label>
                  <span className="text-red-600 ml-1">*</span>
                </div>
                <Select
                  value={socio.regime_casamento}
                  onValueChange={(value) =>
                    handleSocioChange(index, "regime_casamento", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o regime" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comunhao_universal">
                      Comunhão Universal
                    </SelectItem>
                    <SelectItem value="comunhao_parcial">
                      Comunhão Parcial
                    </SelectItem>
                    <SelectItem value="separacao_total">
                      Separação Total
                    </SelectItem>
                    <SelectItem value="participacao_final">
                      Participação Final nos Aquestos
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor={`profissao-${index}`}>Profissão</Label>
                <span className="text-red-600 ml-1">*</span>
              </div>
              <Input
                id={`profissao-${index}`}
                value={socio.profissao}
                onChange={(event) =>
                  handleSocioChange(index, "profissao", event.target.value)
                }
                placeholder="Ex: Empresário"
                required
                className={cn(error && "border-red-500")}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor={`cpf-${index}`}>CPF</Label>
                <span className="text-red-600 ml-1">*</span>
              </div>
              <InputMask
                mask="999.999.999-99"
                value={socio.cpf}
                onChange={(event) =>
                  handleSocioChange(
                    index,
                    "cpf",
                    event.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="000.000.000-00"
                required
              >
                {(inputProps: any) => (
                  <Input
                    {...inputProps}
                    id={`cpf-${index}`}
                    className={cn(error && "border-red-500")}
                  />
                )}
              </InputMask>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor={`rg-${index}`}>RG</Label>
                <span className="text-red-600 ml-1">*</span>
              </div>
              <InputMask
                mask="99.999.999-9"
                value={socio.rg}
                onChange={(event) =>
                  handleSocioChange(index, "rg", event.target.value)
                }
                placeholder="00.000.000-0"
                required
              >
                {(inputProps: any) => (
                  <Input
                    {...inputProps}
                    id={`rg-${index}`}
                    className={cn(error && "border-red-500")}
                  />
                )}
              </InputMask>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor={`orgao_expedidor-${index}`}>
                  Órgão Expedidor
                </Label>
                <span className="text-red-600 ml-1">*</span>
              </div>
              <Select
                value={socio.orgao_expedidor}
                onValueChange={(value) =>
                  handleSocioChange(index, "orgao_expedidor", value)
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o órgão" />
                </SelectTrigger>
                <SelectContent>
                  {orgaosExpedidores.map((orgao) => (
                    <SelectItem key={orgao.value} value={orgao.value}>
                      {orgao.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor={`uf-${index}`}>Estado de emissão</Label>
                <span className="text-red-600 ml-1">*</span>
              </div>
              <Select
                value={socio.uf}
                onValueChange={(value) => handleSocioChange(index, "uf", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor={`qtd_cotas-${index}`}>
                  Quantidade de Cotas
                </Label>
                <span className="text-red-600 ml-1">*</span>
              </div>
              <Input
                id={`qtd_cotas-${index}`}
                type="number"
                value={socio.qtd_cotas}
                onChange={(event) =>
                  handleSocioChange(
                    index,
                    "qtd_cotas",
                    Number(event.target.value)
                  )
                }
                min="0"
                required
                className={cn(error && "border-red-500")}
              />
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Checkbox
                  id={`administrador-${index}`}
                  checked={socio.administrador}
                  onCheckedChange={(checked) =>
                    handleSocioChange(index, "administrador", checked)
                  }
                />
                <Label className="ml-1" htmlFor={`administrador-${index}`}>
                  Administrador
                </Label>
              </div>
            </div>

            {socio.administrador && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor={`tipo_administrador-${index}`}>
                    Tipo de Administrador
                  </Label>
                  <span className="text-red-600 ml-1">*</span>
                </div>
                <Select
                  value={socio.tipo_administrador}
                  onValueChange={(value) =>
                    handleSocioChange(index, "tipo_administrador", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conjunto">Conjunto</SelectItem>
                    <SelectItem value="isoladamente">Isoladamente</SelectItem>
                    <SelectItem value="nao_aplica">Não aplica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Seção de Endereço */}
            <div className="col-span-2">
              <h4 className="text-lg font-medium mb-4">Endereço</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor={`cep-${index}`}>CEP</Label>
                    <span className="text-red-600 ml-1">*</span>
                  </div>
                  <div className="relative">
                    <InputMask
                      mask="99999-999"
                      value={socio.endereco.cep}
                      onChange={(event) => handleCepChange(index, event)}
                      placeholder="00000-000"
                      required
                    >
                      {(inputProps: any) => (
                        <Input
                          {...inputProps}
                          id={`cep-${index}`}
                          className={cn(error && "border-red-500")}
                        />
                      )}
                    </InputMask>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor={`rua-${index}`}>Rua</Label>
                    <span className="text-red-600 ml-1">*</span>
                  </div>
                  <Input
                    id={`rua-${index}`}
                    value={socio.endereco.rua}
                    onChange={(event) =>
                      handleSocioChange(
                        index,
                        "endereco.rua",
                        event.target.value
                      )
                    }
                    placeholder="Nome da rua"
                    required
                    className={cn(error && "border-red-500")}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor={`numero-${index}`}>Número</Label>
                    <span className="text-red-600 ml-1">*</span>
                  </div>
                  <Input
                    id={`numero-${index}`}
                    type="number"
                    value={socio.endereco.numero}
                    onChange={(event) =>
                      handleSocioChange(
                        index,
                        "endereco.numero",
                        Number(event.target.value)
                      )
                    }
                    placeholder="Nº"
                    required
                    className={cn(error && "border-red-500")}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor={`complemento-${index}`}>Complemento</Label>
                    <span className="text-red-600 ml-1">*</span>
                  </div>
                  <Input
                    id={`complemento-${index}`}
                    value={socio.endereco.complemento}
                    onChange={(event) =>
                      handleSocioChange(
                        index,
                        "endereco.complemento",
                        event.target.value
                      )
                    }
                    placeholder="Apto, Sala, etc."
                    required
                    className={cn(error && "border-red-500")}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor={`bairro-${index}`}>Bairro</Label>
                    <span className="text-red-600 ml-1">*</span>
                  </div>
                  <Input
                    id={`bairro-${index}`}
                    value={socio.endereco.bairro}
                    onChange={(event) =>
                      handleSocioChange(
                        index,
                        "endereco.bairro",
                        event.target.value
                      )
                    }
                    placeholder="Bairro"
                    required
                    className={cn(error && "border-red-500")}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor={`municipio-${index}`}>Município</Label>
                    <span className="text-red-600 ml-1">*</span>
                  </div>
                  <Input
                    id={`municipio-${index}`}
                    value={socio.endereco.municipio}
                    onChange={(event) =>
                      handleSocioChange(
                        index,
                        "endereco.municipio",
                        event.target.value
                      )
                    }
                    placeholder="Cidade"
                    required
                    className={cn(error && "border-red-500")}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor={`uf_endereco-${index}`}>UF</Label>
                    <span className="text-red-600 ml-1">*</span>
                  </div>
                  <Select
                    value={socio.endereco.uf}
                    onValueChange={(value) =>
                      handleSocioChange(index, "endereco.uf", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado..." />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((estado) => (
                        <SelectItem key={estado.value} value={estado.value}>
                          {estado.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-4 justify-end mt-6">
        <Button type="button" variant="outline" onClick={addSocio}>
          Adicionar Sócio
        </Button>

        <Button type="submit" variant="flowtec" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar formulário"
          )}
        </Button>
      </div>

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
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Confirmar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}

// Main component with Suspense
const PartnerForm = () => {
  return (
    <Suspense fallback={<div>Carregando formulário de sócios...</div>}>
      <PartnerFormInner />
    </Suspense>
  );
};

export default PartnerForm;
