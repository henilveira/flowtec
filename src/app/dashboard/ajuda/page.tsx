import { FilterIcon } from "lucide-react";
import Title from "../page-title";
import { Button } from "@/components/ui/button";

export default function Ajuda() {
    return (
        <Title titulo="Ajuda">
        <Button variant="outline">
          <FilterIcon className="mr-2 h-4 w-4" /> Filtrar
        </Button>
      </Title>
    );

}