import useAuthAction from "@/actions/auth.action";
import { clearAllInfoFromLocalStorage } from "@/actions/localStorage.actions";
import { JWT_KEY, LOGGED_USER_INFO_KEY } from "@constants";
import { User, CustomerRoleType } from "@models";
import { useRouter } from "next/router";

interface AuthVerifierProps {
  requireAuth: boolean;
  children: React.ReactNode;
  roles?: CustomerRoleType[number][];
  user?: User;
  isLoading?: boolean;
}

const AuthVerifier = ({
  children,
  requireAuth,
  roles = [],
  user = undefined,
  isLoading = false,
}: AuthVerifierProps): React.ReactNode => {
  const router = useRouter();
  if (isLoading) {
    // Mostrar un mensaje de carga o spinner mientras se verifica la autenticación
    return <p>Loading...</p>;
  }
  if (typeof window === "undefined" || !requireAuth) {
    // SSR: Si estamos en el servidor, simplemente retornamos el componente sin cambios.
    return <>{children}</>;
  }

  if (requireAuth && !user) {
    // Si requireAuth es true y el usuario no está autenticado, redirigir al inicio de sesión.
    clearAllInfoFromLocalStorage();
    router.replace("/");
    return null;
  }

  if (
    roles.length > 0 &&
    !!user?.role &&
    !roles.includes(user.role as CustomerRoleType[number])
  ) {
    router.replace("/access-denied");
    return null;
  }

  // Si pasa todas las verificaciones, renderizar el elemento children.
  return <>{children}</>;
};

export default AuthVerifier;
