"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateContabilidade } from "@/hooks/useCreateContabilidade";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import React from "react";

const formSchema = z.object({
  cnpj: z
    .string()
    .min(14, { message: "CNPJ deve ter no mínimo 14 números" })
    .max(18, { message: "CNPJ deve ter no máximo 14 números" }) // Aumentado para 18 para acomodar a formatação
    .transform((val) => val.replace(/\D/g, "")) // Remove caracteres não numéricos
    .refine((val) => val.length === 14, {
      message: "CNPJ deve ter 14 números",
    }),
});

const formatCNPJ = (value: string) => {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, "");

  // Limita a 14 dígitos
  const cnpj = numbers.slice(0, 14);

  // Aplica a máscara XX.XXX.XXX/XXXX-XX
  return cnpj
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

const CreateContabilidadeForm = React.memo(() => {
  const { create, error: err, isLoading } = useCreateContabilidade();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cnpj: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Remove a formatação antes de enviar
      const cleanCNPJ = values.cnpj.replace(/\D/g, "");
      await create(cleanCNPJ);
      toast.success("Contabilidade criada com sucesso!", {
        description:
          "Sua contabilidade já foi adicionada a sua lista de contabilidades.",
      });
    } catch (err) {
      console.log(err);
      toast.error("Houve algum erro ao adicionar contabilidade.", {
        description: "Verifique se o CNPJ digitado está correto.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite seu CNPJ"
                  {...field}
                  value={formatCNPJ(field.value)}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value.replace(/\D/g, ""));
                  }}
                  maxLength={18} // Comprimento máximo com a formatação
                  inputMode="numeric" // Garante que teclados móveis mostrem apenas números
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="flowtec" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cadastrando...
            </>
          ) : (
            "Cadastrar"
          )}
        </Button>
      </form>
    </Form>
  );
});
CreateContabilidadeForm.displayName = 'CreateContabilidadeForm';


export default CreateContabilidadeForm;
