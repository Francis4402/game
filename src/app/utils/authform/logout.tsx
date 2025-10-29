import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner';

const Logout = () => {

    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("You have been logged out successfully");
                }
            }
        });

        router.push("/");
    }

  return (
    <Button variant={"outline"} onClick={handleLogout}>Logout</Button>
  )
}

export default Logout