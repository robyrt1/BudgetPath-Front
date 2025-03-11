"use client";

import { useRouter } from "next/navigation";
import { FC, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface WithAuthProps {
  children?: ReactNode;
}

const WithAuthentication = <P extends object>(WrappedComponent: FC<P>) => {
  const AuthComponent: FC<P & WithAuthProps> = (props) => {
    const router = useRouter();
    const token = useSelector((state: any) => state.auth.token);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (token === undefined) return;

      if (!token) {
        router.replace("/SignUp");
      } else {
        setLoading(false);
      }
    }, [token, router]);

    if (loading) {
      return <p className="loader">Carregando...</p>;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default WithAuthentication;
