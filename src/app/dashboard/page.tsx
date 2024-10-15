import { Button } from "@/components/ui/button";
import Title from "./page-title";
import { FilterIcon } from "lucide-react";

export default function Painel() {
  return (
    <div>
      <Title titulo="Dashboard">
        <Button variant="outline">
          <FilterIcon className="mr-2 h-4 w-4" /> Filtrar
        </Button>
      </Title>
    </div>
  );
}
