import { useState, useEffect } from "react";
import { createContext, ReactNode } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
}

type FirebaseUser = firebase.User

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  function setAuthUser(user: FirebaseUser) {
    const { displayName, photoURL, uid } = user;

    if (!displayName || !photoURL) {
      throw new Error('Missing information from Google Account');
    }

    setUser({
      id: uid,
      name: displayName,
      avatar: photoURL
    })
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setAuthUser(user);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const data = await auth.signInWithPopup(provider);

    if (data.user) {
      setAuthUser(data.user);
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  )
}
