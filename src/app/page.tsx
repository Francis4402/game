import { userData } from "@/authserver/users";
import HomePage from "./sections/HomePage";



export default async function Home() {

  const session = await userData();

  return (
    <div>
      <HomePage session = {session} />
    </div>
  );
}
