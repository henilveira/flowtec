import { Socios } from "@/@types/Formulario";
import { useFormActions } from "@/hooks/useForm";
import React, { useState } from "react";

interface Endereco {
  rua: string;
  numero: number;
  bairro: string;
  cep: string; // Máx. 9 dígitos, com ou sem hífen
  municipio: string;
  complemento: string;
  uf: string;
}

interface Socio {
  nome: string;
  nacionalidade: string;
  data_nascimento: string; // Formato: "YYYY-MM-DD"
  estado_civil: string;
  regime_casamento?: string; // Obrigatório se estado_civil === "casado"
  profissao: string;
  cpf: string; // Máx. 11 dígitos, com ou sem pontuação
  rg: string; // Máx. 14 dígitos, com ou sem pontuação
  orgao_expedidor: string; // Máx. 8 letras
  uf: string;
  administrador: boolean;
  tipo_administrador?: string; // Obrigatório se administrador === true
  qtd_cotas: number;
  endereco: Endereco;
}


const PartnerForm = () => {
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

  const handleSocioChange = (
    index: number,
    field: keyof Socio | keyof Endereco,
    value: string | boolean | number
  ) => {
    const updatedSocios = [...socios];
    if (field in updatedSocios[index].endereco) {
      updatedSocios[index].endereco = {
        ...updatedSocios[index].endereco,
        [field]: value,
      };
    } else {
      updatedSocios[index] = {
        ...updatedSocios[index],
        [field]: value,
      };
    }
    setSocios(updatedSocios);
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

  const { criarSocios } = useFormActions();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData: Socios = {
      empresa_form_id: "623ac598-dfe2-49e2-a773-ebb52873b78c",
      socios: socios.map((socio) => ({
        ...socio,
        qtd_cotas: socio.qtd_cotas || 0,
        regime_casamento:
          socio.estado_civil === "casado" ? socio.regime_casamento : undefined,
        tipo_administrador: socio.administrador
          ? socio.tipo_administrador
          : undefined,
      })),
    };

    try {
      await criarSocios(formData);
      alert("Sócios criados com sucesso!");
    } catch (error) {
      console.error("Erro ao criar sócios:", error);
    }
  };

  return (
    <div>
      {socios.map((socio, index) => (
        <div key={index} className="border p-4 my-4 rounded">
          <h3>Sócio {index + 1}</h3>

          <input
            type="text"
            value={socio.nome}
            onChange={(e) => handleSocioChange(index, "nome", e.target.value)}
            placeholder="Nome"
          />
          <input
            type="text"
            value={socio.nacionalidade}
            onChange={(e) =>
              handleSocioChange(index, "nacionalidade", e.target.value)
            }
            placeholder="Nacionalidade"
          />
          <input
            type="date"
            value={socio.dataNascimento}
            onChange={(e) =>
              handleSocioChange(index, "dataNascimento", e.target.value)
            }
          />
          <input
            type="text"
            value={socio.estadoCivil}
            onChange={(e) =>
              handleSocioChange(index, "estadoCivil", e.target.value)
            }
            placeholder="Estado Civil"
          />
          <input
            type="text"
            value={socio.regimeCasamento}
            onChange={(e) =>
              handleSocioChange(index, "regimeCasamento", e.target.value)
            }
            placeholder="Regime de Casamento"
          />
          <input
            type="text"
            value={socio.profissao}
            onChange={(e) =>
              handleSocioChange(index, "profissao", e.target.value)
            }
            placeholder="Profissão"
          />
          <input
            type="text"
            value={socio.CPF}
            onChange={(e) => handleSocioChange(index, "CPF", e.target.value)}
            placeholder="CPF"
          />
          <input
            type="text"
            value={socio.RG}
            onChange={(e) => handleSocioChange(index, "RG", e.target.value)}
            placeholder="RG"
          />
          <input
            type="text"
            value={socio.orgaoExpedidor}
            onChange={(e) =>
              handleSocioChange(index, "orgaoExpedidor", e.target.value)
            }
            placeholder="Órgão Expedidor"
          />
          <div>
            <label>
              <input
                type="checkbox"
                checked={socio.administrador}
                onChange={(e) =>
                  handleSocioChange(index, "administrador", e.target.checked)
                }
              />
              Administrador
            </label>
          </div>
          {socio.administrador && (
            <input
              type="text"
              value={socio.tipoAdministrador}
              onChange={(e) =>
                handleSocioChange(index, "tipoAdministrador", e.target.value)
              }
              placeholder="Tipo de Administrador"
            />
          )}
          <input
            type="number"
            value={socio.quantidadeCotas}
            onChange={(e) =>
              handleSocioChange(
                index,
                "quantidadeCotas",
                parseInt(e.target.value)
              )
            }
            placeholder="Quantidade de Cotas"
          />

          <h4>Endereço</h4>
          <input
            type="text"
            value={socio.cepSocio}
            onChange={(e) =>
              handleSocioChange(index, "cepSocio", e.target.value)
            }
            placeholder="CEP"
          />
          <input
            type="text"
            value={socio.ruaSocio}
            onChange={(e) =>
              handleSocioChange(index, "ruaSocio", e.target.value)
            }
            placeholder="Rua"
          />
          <input
            type="text"
            value={socio.numeroSocio}
            onChange={(e) =>
              handleSocioChange(index, "numeroSocio", e.target.value)
            }
            placeholder="Número"
          />
          <input
            type="text"
            value={socio.bairroSocio}
            onChange={(e) =>
              handleSocioChange(index, "bairroSocio", e.target.value)
            }
            placeholder="Bairro"
          />
          <input
            type="text"
            value={socio.municipioSocio}
            onChange={(e) =>
              handleSocioChange(index, "municipioSocio", e.target.value)
            }
            placeholder="Município"
          />
          <input
            type="text"
            value={socio.UFSocio}
            onChange={(e) =>
              handleSocioChange(index, "UFSocio", e.target.value)
            }
            placeholder="UF"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addSocio}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Adicionar Sócio
      </button>
    </div>
  );
};

export default PartnerForm;
