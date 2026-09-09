import { useEffect, useState } from "react";
import { api, getToken, setToken, onAuthChange } from "@/api";

export function useAuth() {
  const [token, setTok] = useState<string | null>(getToken());
  useEffect(() => onAuthChange(setTok), []);

  return {
    isAuthed: !!token,
    async login(user: string, pass: string) {
      const r = await api.login(user, pass);
      setToken(r.token);
      return r;
    },
    logout() {
      api.logout().catch(() => {});
      setToken(null);
    },
  };
}
