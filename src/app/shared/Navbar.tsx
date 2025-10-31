"use client"


import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Crown, LogOut } from 'lucide-react';
import { User } from '../types'



const Navbar = ({session}: {session: User}) => {

  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('You have been logged out successfully');
        }
      }
    });
    router.push("/");
    router.refresh();
  }


  return (
    <header className="border-b border-purple-500/30 bg-black/80 backdrop-blur-2xl sticky top-0 z-50 shadow-lg shadow-purple-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/50">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              ROYAL<span className="text-white">WIN</span>
            </span>
          </div>
          <div>
            {
              session?.user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar>
                        <AvatarImage src={session?.user?.image || ''} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href={"/login"}>
                    <Button variant="outline" className="border-2 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white font-bold">
                      Login
                    </Button>
                  </Link>
                  <Link href={"/register"}>
                      <Button className="bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 hover:from-yellow-600 hover:via-pink-600 hover:to-purple-700 font-bold shadow-lg shadow-purple-500/50 animate-pulse">
                        Sign Up Now
                      </Button>
                  </Link>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar