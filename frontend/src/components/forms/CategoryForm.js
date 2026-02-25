import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
const schema = z.object({
    name: z.string().min(2, 'Name is required'),
    description: z.string().optional(),
});
const CategoryForm = ({ onSubmit, isLoading }) => {
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: '', description: '' },
    });
    const submitHandler = handleSubmit(async (values) => {
        await onSubmit(values);
        reset();
    });
    return (_jsxs("form", { onSubmit: submitHandler, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-400", children: "Name" }), _jsx("input", { ...register('name'), className: "mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10", placeholder: "e.g. Computer Science" }), errors.name && _jsx("p", { className: "mt-1 text-xs text-red-400", children: errors.name.message })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-400", children: "Description" }), _jsx("textarea", { ...register('description'), className: "mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10", rows: 3 }), errors.description && (_jsx("p", { className: "mt-1 text-xs text-red-400", children: errors.description.message }))] }), _jsx("button", { type: "submit", className: "btn-primary text-sm", disabled: isLoading, children: isLoading ? 'Saving…' : 'Add Category' })] }));
};
export default CategoryForm;
