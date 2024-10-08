'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/icons';
import { Search } from 'lucide-react';

export function SearchInput() {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Extrair o nome da página do pathname
  const page = pathname.split('/').filter(Boolean).pop() || 'Página';

  useEffect(() => {
    setIsActive(pathname === `/${page}`);
  }, [pathname, page]);

  function searchAction(formData: FormData) {
    const value = formData.get('q') as string;
    const params = new URLSearchParams({ q: value });
    startTransition(() => {
      router.replace(`/?${params.toString()}`);
    });
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); searchAction(new FormData(e.currentTarget)) }} className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
      <Input
        name="q"
        type="search"
        placeholder={`Procurar por ${page}`}
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
      />
      {isPending && <Spinner />}
    </form>
  );
}
