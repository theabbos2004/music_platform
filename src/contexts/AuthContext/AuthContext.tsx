import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { IAuthContextType, IUser } from "../../types";
import { usegetCurrentAccountQuery, usegetCurrentUserQuery, useSignOutAccount } from "../../lib/react-query/queris";



const INITIAL_STATE = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => {return {}},
};


const AuthContext = createContext<IAuthContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {data:getCurrentUser}=usegetCurrentUserQuery()
  const {data:getCurrentAccount}=usegetCurrentAccountQuery()
  const {mutateAsync:signOutAccount}=useSignOutAccount()

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      if(getCurrentUser?.error) {
        signOutAccount()
        throw new Error(getCurrentUser.error)
      }
      setUser(getCurrentUser?.data);
      setIsAuthenticated(true);
      return {data:getCurrentUser?.data};
    } catch (error) {
      setIsAuthenticated(false);
      return {error};
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getCurrentAccount && checkAuthUser();
  }, [usegetCurrentAccountQuery,getCurrentUser]);
  
  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
