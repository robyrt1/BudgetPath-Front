import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const WithAuthentication = (WrappedComponent: FC) => {
  const AuthComponent: FC = (props) => {
    const router = useRouter();
    const token = useSelector((state: any) => state.auth.token);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!token) {
        router.push('/SignUp');
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
