import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../lib/store/auth';
import LoadingOverlay from './feedback/LoadingOverlay';
const ProtectedRoute = ({ roles, children }) => {
    const location = useLocation();
    const { user, isHydrated } = useAuthStore();
    if (!isHydrated) {
        return _jsx(LoadingOverlay, { label: "Preparing your library experience" });
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    if (roles && !roles.includes(user.role)) {
        return _jsx(Navigate, { to: "/unauthorized", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
