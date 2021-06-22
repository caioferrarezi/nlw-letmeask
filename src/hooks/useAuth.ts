import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function useAuth() {
  const { user, signInWithGoogle } = useContext(AuthContext)

  return { user, signInWithGoogle }
}
