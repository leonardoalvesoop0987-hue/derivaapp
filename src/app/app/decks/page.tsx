"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DecksPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/app");
  }, [router]);

  return null;
}
