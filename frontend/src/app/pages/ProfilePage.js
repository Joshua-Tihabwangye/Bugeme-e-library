import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../lib/store/auth';
import api from '../../lib/api/client';
const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', profile_picture: null });
    const [previewUrl, setPreviewUrl] = useState(null);
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const queryClient = useQueryClient();
    // Initialize form data when user is available
    useState(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email, profile_picture: null });
        }
    });
    const updateMutation = useMutation({
        mutationFn: async (data) => {
            const formDataToSend = new FormData();
            formDataToSend.append('name', data.name);
            formDataToSend.append('email', data.email);
            if (data.profile_picture) {
                formDataToSend.append('profile_picture', data.profile_picture);
            }
            const { data: responseData } = await api.patch('/auth/profile/', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return responseData;
        },
        onSuccess: (data) => {
            setUser(data);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            setIsEditing(false);
            setPreviewUrl(null);
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };
    const handleCancel = () => {
        if (user) {
            setFormData({ name: user.name, email: user.email, profile_picture: null });
        }
        setIsEditing(false);
        setPreviewUrl(null);
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, profile_picture: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    if (!user) {
        return (_jsx("div", { className: "flex min-h-[40vh] items-center justify-center", children: _jsx("p", { className: "text-slate-600 dark:text-slate-400", children: "Please log in to view your profile." }) }));
    }
    return (_jsxs("div", { className: "mx-auto max-w-2xl space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-semibold text-slate-900 dark:text-white", children: "My Profile" }), _jsx("p", { className: "text-slate-600 dark:text-slate-400", children: "Manage your account information" })] }), _jsxs("div", { className: "card p-6", children: [_jsxs("div", { className: "mb-6 flex items-center gap-4", children: [user.profile_picture ? (_jsx("img", { src: user.profile_picture, alt: user.name, className: "h-20 w-20 rounded-full object-cover" })) : (_jsx("div", { className: "flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 text-3xl font-bold text-white", children: user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() })), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-slate-900 dark:text-white", children: user.name }), _jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: user.email }), _jsx("p", { className: "mt-1 text-xs text-slate-400 dark:text-slate-500 capitalize", children: user.role.toLowerCase() })] })] }), isEditing ? (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 dark:text-slate-300", children: "Profile Picture" }), _jsxs("div", { className: "mt-2 flex items-center gap-4", children: [previewUrl || user.profile_picture ? (_jsx("img", { src: previewUrl || user.profile_picture || '', alt: "Preview", className: "h-20 w-20 rounded-full object-cover" })) : (_jsx("div", { className: "flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 text-2xl font-bold text-white", children: user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() })), _jsx("input", { type: "file", accept: "image/*", onChange: handleFileChange, className: "text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-600 dark:text-slate-400" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 dark:text-slate-300", children: "Name" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-white", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 dark:text-slate-300", children: "Email" }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), className: "mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-white", required: true })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "submit", disabled: updateMutation.isPending, className: "rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50", children: updateMutation.isPending ? 'Saving...' : 'Save Changes' }), _jsx("button", { type: "button", onClick: handleCancel, className: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-white dark:hover:bg-white/5", children: "Cancel" })] }), updateMutation.isError && (_jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: "Failed to update profile. Please try again." }))] })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-500 dark:text-slate-400", children: "Name" }), _jsx("p", { className: "mt-1 text-slate-900 dark:text-white", children: user.name })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-500 dark:text-slate-400", children: "Email" }), _jsx("p", { className: "mt-1 text-slate-900 dark:text-white", children: user.email })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-500 dark:text-slate-400", children: "Role" }), _jsx("p", { className: "mt-1 text-slate-900 dark:text-white capitalize", children: user.role.toLowerCase() })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-500 dark:text-slate-400", children: "Account Status" }), _jsx("p", { className: "mt-1 text-slate-900 dark:text-white", children: user.is_active ? 'Active' : 'Inactive' })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-500 dark:text-slate-400", children: "Member Since" }), _jsx("p", { className: "mt-1 text-slate-900 dark:text-white", children: new Date(user.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        }) })] }), _jsx("button", { onClick: () => setIsEditing(true), className: "rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600", children: "Edit Profile" })] }))] })] }));
};
export default ProfilePage;
