import useAuthAction from "@/actions/auth.action";
import { User, UserRoleType } from "@models";
import { useRouter } from "next/router";

interface AuthCheckerProps {
  requireAuth: boolean; // ¿Es necesario que el usuario esté autenticado?
  children: React.ReactNode;
  roles?: UserRoleType[number][]; // Roles necesarios para acceder a la página
  user?: User;
}

const AuthChecker = ({
  children,
  requireAuth,
  roles = [],
  user = undefined,
}: AuthCheckerProps): React.ReactNode => {
  const router = useRouter();
  if (typeof window === "undefined" || !requireAuth) {
    // SSR: Si estamos en el servidor, simplemente retornamos el componente sin cambios.
    return <>{children}</>;
  }

  if (requireAuth && !user) {
    // Si requireAuth es true y el usuario no está autenticado, redirigir al inicio de sesión.
    router.replace("/");
    return null;
  }

  if (
    roles.length > 0 &&
    !!user?.role &&
    !roles.includes(user.role as UserRoleType[number])
  ) {
    router.replace("/access-denied");
    return null;
  }

  // Si pasa todas las verificaciones, renderizar el elemento children.
  return <>{children}</>;
};

export default AuthChecker;
