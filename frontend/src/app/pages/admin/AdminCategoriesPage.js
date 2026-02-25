import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createCategory, getCategories } from '../../../lib/api/catalog';
import LoadingOverlay from '../../../components/feedback/LoadingOverlay';
import CategoryForm from '../../../components/forms/CategoryForm';
const AdminCategoriesPage = () => {
    const queryClient = useQueryClient();
    const { data, isPending } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 5 * 60 * 1000,
    });
    const mutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            toast.success('Category created');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: () => toast.error('Failed to create category'),
    });
    return (_jsxs("div", { className: "grid gap-10 lg:grid-cols-[2fr_1fr]", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: "Categories" }), isPending ? (_jsx(LoadingOverlay, { label: "Loading categories" })) : (_jsx("div", { className: "mt-6 space-y-3", children: (Array.isArray(data) ? data : data?.results)?.map((category) => (_jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5", children: [_jsx("p", { className: "text-sm font-bold text-slate-900 dark:text-white", children: category.name }), _jsx("p", { className: "text-xs font-medium text-slate-600 dark:text-slate-400", children: category.description ?? 'No description provided' }), _jsxs("p", { className: "mt-1 text-[11px] font-semibold text-slate-500", children: [category.book_count ?? 0, " books"] })] }, category.id))) }))] }), _jsxs("div", { className: "card p-5", children: [_jsx("h2", { className: "text-lg font-semibold text-white", children: "Add category" }), _jsx("p", { className: "text-xs text-slate-500", children: "Manage your library's course categories." }), _jsx("div", { className: "mt-4", children: _jsx(CategoryForm, { onSubmit: (values) => mutation.mutate(values), isLoading: mutation.isPending }) })] })] }));
};
export default AdminCategoriesPage;
