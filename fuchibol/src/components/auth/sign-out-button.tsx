"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm text-red-500 hover:text-red-700"
    >
      Cerrar sesión
    </button>
  );
}
