import { userData } from "@/authserver/users";
import HomePage from "./sections/HomePage";
import Navbar from "./shared/Navbar";



export default async function Home() {

  const session = await userData();

  return (
    <div>
      <Navbar session={session!} />
      <HomePage />
    </div>
  );
}
