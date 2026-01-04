'use client'

'use client'

import { usePathname } from 'next/navigation';

export default function useExibirCarrinho() {
  const pathname = usePathname();
  const pathsNotShowNotExcept = ['/carrinho']

  return !pathsNotShowNotExcept.includes(pathname);
}