"use client"


import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LogOut } from 'lucide-react';
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
    <div className="w-full bg-transparent shadow">
      <div className="text-center flex items-center justify-between p-4 container mx-auto">
        <Link href="/" className='text-2xl font-bold'>GM</Link>
        <div>
          {session?.user ? (
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
          <Link href="/login">
            <Button variant="default">Login</Button>
          </Link>
          )}
          
        </div>
      </div>
    </div>
  )
}

export default Navbar