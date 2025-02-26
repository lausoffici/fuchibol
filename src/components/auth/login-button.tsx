"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginButtonContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSignIn = async () => {
    await signIn("google", { callbackUrl });
  };

  return (
    <Button
      className="w-full"
      variant="outline"
      size="lg"
      onClick={handleSignIn}
    >
      <FaGoogle className="mr-2" />
      Iniciar sesión con Google
    </Button>
  );
}

export function LoginButton() {
  return (
    <Suspense>
      <LoginButtonContent />
    </Suspense>
  );
}
