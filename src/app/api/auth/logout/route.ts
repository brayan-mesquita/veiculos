import { signOut } from "next-auth/react";
import { NextResponse } from "next/server";

export async function POST() {
  await signOut({ redirect: false });
  return NextResponse.json({ message: "Logout realizado com sucesso" });
}