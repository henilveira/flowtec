import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

const FieldWithTooltip = ({ label, tooltip, children }: any) => {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        {" "}
        {/* Removido space-y-4 e text-center, adicionado mb-4 */}
        <Label className="flex items-center gap-2">
          {" "}
          {/* Movido flex para o Label */}
          {label}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] p-2">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
      </div>
      {children}
    </div>
  );
};

export default FieldWithTooltip;
