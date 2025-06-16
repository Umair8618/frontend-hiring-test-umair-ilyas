"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import TTLogo from "@/assets/images/TT Logo.png";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import { getToken, logout } from "@/lib/auth";

export default function Header() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getToken()); //Use getToken helper
  }, []);

  const handleLogout = () => {
    logout(); // Use logout helper
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <Image src={TTLogo} alt="Logo" width={310} height={40} />
      {token && (
        <Button
          onClick={handleLogout}
          type="primary"
          className="w-[100px] avenir-black rounded-[1px]"
        >
          <div className="avenir-black font-bold text-[16px]">Log out</div>
        </Button>
      )}
    </header>
  );
}
