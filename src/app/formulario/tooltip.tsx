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
        <Label>{label}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-gray-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-[200px] p-2">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {children}
    </div>
  );
};

export default FieldWithTooltip;
