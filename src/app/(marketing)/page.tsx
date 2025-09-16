import Logo from '@/ui/components/icons/Logo'
import { SignOutButton } from '@clerk/nextjs';
export default function Home() {
  return (
    <div>
      <Logo />
      <SignOutButton />
    </div>
  );
}
