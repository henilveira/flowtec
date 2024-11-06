"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CalendarIcon, Copy, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function EditCard({ triggerContent }: any) {
  const [date, setDate] = useState<Date>();
  const [tasks, setTasks] = useState([
    { id: 1, label: "Proposta enviada", checked: true },
    { id: 2, label: "Proposta aceita e formulário enviado", checked: true },
    { id: 3, label: "Formulário recebido", checked: false },
  ]);
  const formLink = "forms.com.br/formulario/939887/bxg93ky4tgj8";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formLink);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="w-full cursor-pointer">{triggerContent}</div>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[600px] sm:w-[540px] flex flex-col h-full"
      >
        <div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">EcoWave</h1>
              <p className="text-sm text-muted-foreground">Empresa de Pedro</p>
            </div>
          </div>

          <div className="grid gap-6 py-6 flex-grow">
            <div className="space-y-2">
              <Label htmlFor="process">Processo</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o processo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new-company">
                    Abertura de empresa
                  </SelectItem>
                  <SelectItem value="contract-change">
                    Alteração contratual
                  </SelectItem>
                  <SelectItem value="transformation">Transformação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data de conclusão</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "PPP")
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-4">
              <Label>Tarefas</Label>
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={task.checked}
                    onCheckedChange={(checked) => {
                      setTasks(
                        tasks.map((t) =>
                          t.id === task.id ? { ...t, checked: !!checked } : t
                        )
                      );
                    }}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                      task.checked ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {task.label}
                  </label>
                </div>
              ))}
            </div>

          </div>
        </div>

            <div className="space-y-2">
              <Label>Link para formulário</Label>
              <div className="flex space-x-2">
                <Input readOnly value={formLink} className="flex-1" />
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
        <SheetFooter className="mt-auto flex justify-end sm:justify-end">
          <Button variant="destructive">Excluir processo</Button>
          <Button variant='flowtec' type="submit">Salvar alterações</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
