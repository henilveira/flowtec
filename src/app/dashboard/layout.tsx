"use client";
import Link from "next/link";
import {
  HeartHandshake,
  LayoutGrid,
  ClipboardPenLine,
  FileCheck,
  Newspaper,
  Settings,
  HelpCircle,
  PanelLeft,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "@/components/logo";
import { ThemeProvider } from "next-themes";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Toaster } from "@/components/ui/sonner";
import { ContabilidadeProvider } from "./societario/select-contabilidade";
import { EtapaProvider } from "./societario/select-etapas";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavUser } from "@/components/nav-user";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContabilidadeProvider>
      <EtapaProvider>
        <ThemeProvider attribute="class" defaultTheme="system">
          <SidebarProvider>
            {" "}
            {/* Adicione o SidebarProvider aqui */}
            <div className="flex h-screen w-screen overflow-hidden">
              <nav className="hidden lg:flex w-64 flex-shrink-0 flex-col border-r bg-background">
                <div className="p-6">
                  <Logo />
                </div>
                <div className="flex-1">
                  <Sidebar />
                </div>
                <Separator />
                <div className="p-4">
                  <NavUser />
                </div>
              </nav>
              <div className="flex-1 flex flex-col overflow-hidden">
                <header className="lg:hidden flex h-14 items-center border-b bg-background px-6 flex-shrink-0">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="w-[80%] sm:w-[350px] p-0"
                    >
                      <div className="p-6">
                        <Logo />
                      </div>
                      <div className="h-[calc(100vh-8rem)]">
                        <Sidebar />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0">
                        <Separator />
                        <div className="p-4">
                          <NavUser />
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </header>
                <main className="flex-1 overflow-auto">
                  {children}
                  <Toaster />
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </EtapaProvider>
    </ContabilidadeProvider>
  );
}

function NavItem({ href, children, ...props }: any) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-flowtech-gradient-transparent text-accent-foreground",
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

function Sidebar() {
  return (
    <div className="flex flex-col gap-4 py-2 px-4">
      <div className="flex flex-col gap-1">
        <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
          Geral
        </h2>
        <nav className="grid gap-1">
          <NavItem href="/dashboard">
            <LayoutGrid className="h-4 w-4" />
            Dashboard
          </NavItem>
          <NavItem href="/dashboard/gerenciamento">
            <Building2 className="h-4 w-4" />
            Gerenciamento
          </NavItem>
          <NavItem href="/dashboard/societario">
            <HeartHandshake className="h-4 w-4" />
            Societário
          </NavItem>
          <NavItem href="/dashboard/alvaras">
            <ClipboardPenLine className="h-4 w-4" />
            Alvarás
          </NavItem>
          <NavItem href="/dashboard/certificados-digitais">
            <FileCheck className="h-4 w-4" />
            Certificados Digitais
          </NavItem>
          <NavItem href="/dashboard/contratos">
            <Newspaper className="h-4 w-4" />
            Contratos
          </NavItem>
        </nav>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
          Suporte
        </h2>
        <nav className="grid gap-1">
          <NavItem href="/dashboard/configuracoes">
            <Settings className="h-4 w-4" />
            Configurações
          </NavItem>
          <NavItem href="/dashboard/ajuda">
            <HelpCircle className="h-4 w-4" />
            Ajuda
          </NavItem>
        </nav>
      </div>
    </div>
  );
}
