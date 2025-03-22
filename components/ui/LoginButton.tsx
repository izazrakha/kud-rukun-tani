"use client";

import { Button } from "@/components/ui/button";

export default function LoginButton() {
  return (
    <Button 
      className="bg-green-600 hover:bg-green-700"
      onClick={() => window.location.href = '/login'}
    >
      Masuk Sekarang
    </Button>
  );
}
