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
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  cnpj: z
    .string()
    .min(14, { message: "CNPJ deve ter no mínimo 14 números" })
    .max(14, { message: "CNPJ deve ter no máximo 14 números" })
    .regex(/^\d+$/, { message: "CNPJ deve conter apenas números" }), // Regex para garantir que tenha apenas números
});

const CreateContabilidadeForm = () => {
  const { create } = useCreateContabilidade();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cnpj: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await create(values.cnpj);
      toast({
        title: "Contabilidade criada com sucesso!",
        description:
          "Sua contabilidade já foi adicionada a sua lista de contabilidades.",
        variant: "default",
      });
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Houve algum erro ao adicionar contabilidade.",
        description: "Verifique se o CNPJ digitado está correto.",
        variant: "destructive",
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
                  inputMode="numeric" // Garante que teclados móveis mostrem apenas números
                />
              </FormControl>
              <FormDescription>
                Insira o CNPJ da contabilidade que deseja cadastrar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant='flowtec' type="submit">Cadastrar</Button>
      </form>
    </Form>
  );
};

export default CreateContabilidadeForm;
