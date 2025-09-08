"use client"

import { ModeToggle } from '@/components/ToggleButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'




const Navbar = () => {

    const {data: session} = useSession();

  return (
    <Card className="w-full mb-10">
      <CardHeader className="text-center">
        <ModeToggle />
        <CardTitle>
          <Link href="/">Next CRUD</Link>
        </CardTitle>
        <CardAction>
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src={session.user.image ? session.user.image : ""} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => signOut()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="default">Login</Button>
            </Link>
          )}
        </CardAction>
      </CardHeader>
    </Card>
  )
}

export default Navbar