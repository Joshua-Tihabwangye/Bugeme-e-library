import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getUsers, updateUserRole, deleteUser } from '../../../lib/api/admin';
import { useAuthStore } from '../../../lib/store/auth';
import LoadingOverlay from '../../../components/feedback/LoadingOverlay';
import ConfirmDialog from '../../../components/ConfirmDialog';
const AdminUsersPage = () => {
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, userId: null, userName: '' });
    const { user: currentUser } = useAuthStore();
    const queryClient = useQueryClient();
    // Use React Query with caching for better performance
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: getUsers,
        staleTime: 30 * 1000, // Cache for 30 seconds
        gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    });
    const roleMutation = useMutation({
        mutationFn: ({ userId, newRole }) => updateUserRole(userId, newRole),
        onSuccess: (_, variables) => {
            toast.success(`User role updated to ${variables.newRole}`);
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
        onError: () => {
            toast.error('Failed to update user role');
        },
    });
    const handleRoleChange = (userId, newRole) => {
        roleMutation.mutate({ userId, newRole });
    };
    const openDeleteDialog = (userId, userName) => {
        setDeleteDialog({ isOpen: true, userId, userName });
    };
    const closeDeleteDialog = () => {
        setDeleteDialog({ isOpen: false, userId: null, userName: '' });
    };
    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            toast.success('User deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            closeDeleteDialog();
        },
        onError: () => {
            toast.error('Failed to delete user');
        },
    });
    const confirmDelete = () => {
        if (!deleteDialog.userId)
            return;
        deleteMutation.mutate(deleteDialog.userId);
    };
    if (isLoading) {
        return _jsx(LoadingOverlay, { label: "Loading users" });
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.4em] text-brand-500 dark:text-brand-300", children: "Admin" }), _jsx("h1", { className: "mt-2 text-3xl font-bold text-slate-900 dark:text-white", children: "User Management" })] }), _jsx("div", { className: "card overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-sm text-slate-600 dark:text-slate-400", children: [_jsx("thead", { className: "bg-slate-100 text-xs uppercase text-slate-600 dark:bg-slate-900/50 dark:text-slate-400", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3", children: "User" }), _jsx("th", { className: "px-6 py-3", children: "Status" }), _jsx("th", { className: "px-6 py-3", children: "Type" }), _jsx("th", { className: "px-6 py-3", children: "Role" }), _jsx("th", { className: "px-6 py-3", children: "Joined" }), _jsx("th", { className: "px-6 py-3 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-200 dark:divide-white/5", children: users.map((user) => (_jsxs("tr", { className: "hover:bg-slate-50 dark:hover:bg-white/5", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "h-10 w-10 flex-shrink-0 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold", children: user.name.charAt(0).toUpperCase() }), _jsxs("div", { className: "ml-4", children: [_jsx("div", { className: "font-bold text-slate-900 dark:text-white", children: user.name }), _jsx("div", { className: "text-slate-500", children: user.email })] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("span", { className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${user.is_online
                                                    ? 'bg-green-500/20 text-green-300'
                                                    : 'bg-gray-500/20 text-gray-400'}`, children: [_jsx("span", { className: `mr-1.5 h-2 w-2 rounded-full ${user.is_online ? 'bg-green-500' : 'bg-gray-500'}` }), user.is_online ? 'Online' : 'Offline'] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.user_type === 'Student'
                                                    ? 'bg-blue-500/20 text-blue-300'
                                                    : user.user_type === 'Staff'
                                                        ? 'bg-emerald-500/20 text-emerald-300'
                                                        : 'bg-amber-500/20 text-amber-300'}`, children: user.user_type || 'Visitor' }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("select", { value: user.role, onChange: (e) => handleRoleChange(user.id, e.target.value), disabled: user.id === currentUser?.id, className: `rounded-full px-3 py-1 text-xs font-semibold leading-5 border-0 cursor-pointer ${user.role === 'ADMIN'
                                                    ? 'bg-purple-500/20 text-purple-300'
                                                    : 'bg-orange-500/20 text-orange-300'} disabled:opacity-50 disabled:cursor-not-allowed`, children: [_jsx("option", { value: "ADMIN", children: "ADMIN" }), _jsx("option", { value: "USER", children: "USER" })] }) }), _jsx("td", { className: "px-6 py-4", children: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : 'N/A' }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx("button", { onClick: () => openDeleteDialog(user.id, user.name), className: "p-2 text-slate-400 hover:text-red-400 transition-colors", title: "Delete User", disabled: user.id === currentUser?.id, children: _jsx(Trash2, { className: "h-5 w-5" }) }) })] }, user.id))) })] }) }) }), _jsx(ConfirmDialog, { isOpen: deleteDialog.isOpen, onClose: closeDeleteDialog, onConfirm: confirmDelete, title: "Delete User", message: `Are you sure you want to delete ${deleteDialog.userName}? This action cannot be undone.`, confirmText: "Delete", cancelText: "Cancel", isDangerous: true })] }));
};
export default AdminUsersPage;
