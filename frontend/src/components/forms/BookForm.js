import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
const schema = z.object({
    title: z.string().min(2),
    author_name: z.string().min(2),
    description: z.string().min(10),
    isbn: z.string().min(5),
    language: z.string().default('English'),
    year: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
    pages: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
    file_type: z.enum(['PDF', 'EPUB', 'VIDEO']),
    is_published: z.boolean().default(true),
    tags: z.string().optional(),
    category_names: z.string().optional(),
    cover_image: z.any().optional(),
    file: z.any().optional(),
});
const BookForm = ({ defaultValues, onSubmit, isLoading }) => {
    const { register, handleSubmit, watch, formState: { errors }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: defaultValues?.title ?? '',
            author_name: defaultValues?.author_name ?? '',
            description: defaultValues?.description ?? '',
            isbn: defaultValues?.isbn ?? '',
            language: defaultValues?.language ?? 'English',
            year: defaultValues?.year,
            pages: defaultValues?.pages,
            file_type: defaultValues?.file_type ?? 'PDF',
            is_published: defaultValues?.is_published ?? true,
            tags: Array.isArray(defaultValues?.tags) ? defaultValues.tags.join(', ') : defaultValues?.tags || '',
            category_names: Array.isArray(defaultValues?.category_names) ? defaultValues.category_names.join(', ') : defaultValues?.category_names || '',
        },
    });
    const submitHandler = handleSubmit(async (values) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '')
                return;
            if (key === 'tags') {
                if (typeof value === 'string') {
                    const tagsArray = value
                        .split(',')
                        .map((tag) => tag.trim())
                        .filter(Boolean);
                    formData.append('tags', JSON.stringify(tagsArray));
                }
            }
            else if (key === 'category_names') {
                if (typeof value === 'string') {
                    value
                        .split(',')
                        .map((cat) => cat.trim())
                        .filter(Boolean)
                        .forEach((cat) => formData.append('category_names', cat));
                }
            }
            else if (key === 'cover_image' || key === 'file') {
                const fileList = value;
                if (fileList?.length) {
                    formData.append(key, fileList[0]);
                }
            }
            else {
                formData.append(key, String(value));
            }
        });
        await onSubmit(formData);
    });
    return (_jsxs("form", { onSubmit: submitHandler, className: "space-y-4", children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-400", children: "Title" }), _jsx("input", { ...register('title'), className: "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white" }), errors.title && _jsx("p", { className: "text-xs text-red-400", children: errors.title.message })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-400", children: "Author" }), _jsx("input", { ...register('author_name'), className: "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white" }), errors.author_name && _jsx("p", { className: "text-xs text-red-400", children: errors.author_name.message })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-400", children: "Description" }), _jsx("textarea", { ...register('description'), rows: 4, className: "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white" }), errors.description && _jsx("p", { className: "text-xs text-red-400", children: errors.description.message })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-400", children: "ISBN" }), _jsx("input", { ...register('isbn'), className: "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white" }), errors.isbn && _jsx("p", { className: "text-xs text-red-400", children: errors.isbn.message })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-400", children: "Language" }), _jsx("input", { ...register('language'), className: "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-400", children: "Year" }), _jsx("input", { type: "number", ...register('year'), className: "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white" })] })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-400", children: "Pages" }), _jsx("input", { type: "number", ...register('pages'), className: "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-400", children: "File Type" }), _jsxs("select", { ...register('file_type'), className: "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white", children: [_jsx("option", { value: "PDF", children: "PDF" }), _jsx("option", { value: "EPUB", children: "EPUB" }), _jsx("option", { value: "VIDEO", children: "Video" })] })] }), _jsxs("label", { className: "flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-400", children: [_jsx("input", { type: "checkbox", ...register('is_published'), className: "h-4 w-4" }), "Published"] })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-400", children: "Tags (comma separated)" }), _jsx("input", { ...register('tags'), className: "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-400", children: "Categories (comma separated)" }), _jsx("input", { ...register('category_names'), className: "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-900 dark:text-white" })] })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-400", children: "Cover Image" }), _jsx("input", { type: "file", accept: "image/*", ...register('cover_image'), className: "mt-2 block w-full text-sm text-slate-600 dark:text-slate-200" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-400", children: "Book File" }), _jsx("input", { type: "file", accept: watch('file_type') === 'VIDEO' ? 'video/*' : '.pdf,.epub', ...register('file'), className: "mt-2 block w-full text-sm text-slate-600 dark:text-slate-200" })] })] }), _jsx("button", { type: "submit", className: "btn-primary text-sm", disabled: isLoading, children: isLoading ? 'Saving…' : 'Save Book' })] }));
};
export default BookForm;
