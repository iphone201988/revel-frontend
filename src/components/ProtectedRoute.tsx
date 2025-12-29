import { Navigate, Outlet } from "react-router-dom";
import { usePermission } from "../utils/usePermission";
import type { PermissionKey } from "../Types/types";

interface ProtectedRouteProps {
    permission: PermissionKey;
    redirectPath?: string;
}

export const ProtectedRoute = ({
    permission,
    redirectPath = "/",
}: ProtectedRouteProps) => {
    const { hasPermission, isLoading } = usePermission();

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!hasPermission(permission)) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};
