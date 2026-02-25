import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { useAutoRefreshToken } from './hooks/useAutoRefreshToken';
function App() {
    useAutoRefreshToken();
    return (_jsxs(_Fragment, { children: [_jsx(AppRoutes, {}), _jsx(Toaster, { position: "top-right" })] }));
}
export default App;
