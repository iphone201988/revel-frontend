import { useGetUserProfileQuery } from "../redux/api/provider";
import type { PermissionKey } from "../Types/types";
import { PERMISSION_MAP } from "./helper";

export const usePermission = () => {
    const { data, isLoading } = useGetUserProfileQuery();
    const user = data?.data;

    const hasPermission = (permissionKey: PermissionKey): boolean => {
        // If user is not loaded yet or doesn't exist, deny permission
        if (isLoading || !user) {
            return false;
        }

        // Admin bypass
        // Checking multiple possible admin role values to be safe based on legacy code observations
        const adminRoles = ['Admin', 'Super Admin', '1', '2'];
        if (adminRoles.includes(user.systemRole)) {
            return true;
        }

        const permissionString = PERMISSION_MAP[permissionKey];

        // Case 1: permissions is an array of strings (Most likely API response)
        if (Array.isArray(user.permissions)) {
            return user.permissions.includes(permissionString);
        }

        // Case 2: permissions is an object (As per Types definition, in case it was transformed)
        if (user.permissions && typeof user.permissions === 'object') {
            return !!user.permissions[permissionKey];
        }

        return false;
    };

    /**
     * Check multiple permissions (OR logic - returns true if user has ANY of the permissions)
     */
    const hasAnyPermission = (permissionKeys: PermissionKey[]): boolean => {
        return permissionKeys.some(key => hasPermission(key));
    };

    /**
     * Check multiple permissions (AND logic - returns true if user has ALL of the permissions)
     */
    const hasAllPermissions = (permissionKeys: PermissionKey[]): boolean => {
        return permissionKeys.every(key => hasPermission(key));
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        isLoading,
        user
    };
};
