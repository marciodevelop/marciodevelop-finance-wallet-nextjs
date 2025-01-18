import Link from "next/link"
import { User } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"

export function Header() {
  const pathname = usePathname()

  async function handleLogout() {
    await signOut({ callbackUrl: `${pathname}/login` })
  } 

  return (
    <header className="bg-rose-400 opacity-85 flex justify-between items-center px-4 py-2 w-full">
      <Link href="/" className="text-white font-bold text-xl">Wallet</Link>
      <Popover>
        <PopoverTrigger className="text-white font-bold text-xl p-2 rounded-full">
          <User />
        </PopoverTrigger>
        <PopoverContent className="rounded-2xl w-[200px]">
          <button onClick={handleLogout}>Sair</button>
        </PopoverContent>
      </Popover>
    </header>
  )
}