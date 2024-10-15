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
  Bell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SearchInput } from "./search";
import Logo from "@/components/logo";
import { ThemeProvider } from "next-themes";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { NavItem } from "./nav-item";
import FlowTechLogo from "@/components/logo";
import NotificationIcon from "@/components/notificacoes";
import Profile from "@/components/profile";
import Title from "./page-title";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNavbar />
        <div className="flex flex-1">
          <DesktopAside />
          <main className="flex-1 flex flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b justify-between px-4 sm:px-6 lg:hidden">
              <div className="w-full">
                <MobileNav />
              </div>
            </header>
            <div className="flex-1 ">{children}</div>
            <Toaster />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

function DesktopNavbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background lg:flex h-16">
      <div className="w-full flex items-center justify-between px-4 h-full">
        <Link href="/" className="flex items-center">
          <FlowTechLogo />
        </Link>
        <div className="flex items-center gap-4">
          <SearchInput />
          <ThemeSwitcher />
          {/* <Bell className="h-5 w-5 text-muted-foreground" /> */}
          <NotificationIcon />
          <Profile />
        </div>
      </div>
    </nav>
  );
}

function DesktopAside() {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-background">
      <nav className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <div className="mb-2">
            <span className="text-muted-foreground">Geral</span>
          </div>
          <NavItem href="/dashboard" label="Dashboard" text="Dashboard">
            <LayoutGrid className="h-5 w-5" />
          </NavItem>
          <NavItem
            href="/dashboard/gerenciamento"
            label="Gerenciamento"
            text="Gerenciamento"
          >
            <Building2 className="h-5 w-5" />
          </NavItem>
          <NavItem
            href="/dashboard/societario"
            label="Societário"
            text="Societário"
          >
            <HeartHandshake className="h-5 w-5" />
          </NavItem>
          <NavItem href="/dashboard/alvaras" label="Alvarás" text="Alvarás">
            <ClipboardPenLine className="h-5 w-5" />
          </NavItem>
          <NavItem
            href="/dashboard/certificados-digitais"
            label="Certificados digitais"
            text="Certificados digitais"
          >
            <FileCheck className="h-5 w-5" />
          </NavItem>
          <NavItem
            href="/dashboard/contratos"
            label="Contratos"
            text="Contratos"
          >
            <Newspaper className="h-5 w-5" />
          </NavItem>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">Suporte</span>
          <NavItem
            href="/dashboard/configuracoes"
            label="Configurações"
            text="Configurações"
          >
            <Settings className="h-5 w-5" />
          </NavItem>
          <NavItem href="/dashboard/ajuda" label="Ajuda" text="Ajuda">
            <HelpCircle className="h-5 w-5" />
          </NavItem>
        </div>
      </nav>
    </aside>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="lg:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <nav className="grid gap-2 text-lg font-medium">
          <div className="mb-2">
            <span className="text-muted-foreground">Geral</span>
          </div>
          <NavItem href="/dashboard" label="Dashboard" text="Dashboard">
            <LayoutGrid className="h-5 w-5" />
          </NavItem>
          <NavItem
            href="/dashboard/societario"
            label="Societário"
            text="Societário"
          >
            <HeartHandshake className="h-5 w-5" />
          </NavItem>
          <NavItem href="/dashboard/alvaras" label="Alvarás" text="Alvarás">
            <ClipboardPenLine className="h-5 w-5" />
          </NavItem>
          <NavItem
            href="/dashboard/certificados-digitais"
            label="Certificados digitais"
            text="Certificados digitais"
          >
            <FileCheck className="h-5 w-5" />
          </NavItem>
          <NavItem
            href="/dashboard/contratos"
            label="Contratos"
            text="Contratos"
          >
            <Newspaper className="h-5 w-5" />
          </NavItem>
          <div className="flex flex-col gap-1">
            <div className="mb-2">
              <span className="text-muted-foreground">Suporte</span>
            </div>
            <NavItem
              href="/dashboard/configuracoes"
              label="Configurações"
              text="Configurações"
            >
              <Settings className="h-5 w-5" />
            </NavItem>
            <NavItem href="/dashboard/ajuda" label="Ajuda" text="Ajuda">
              <HelpCircle className="h-5 w-5" />
            </NavItem>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
