import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Search, Edit } from 'lucide-react';
import { createBook, updateBook, deleteBook, getBooks } from '../../../lib/api/catalog';
import LoadingOverlay from '../../../components/feedback/LoadingOverlay';
import BookForm from '../../../components/forms/BookForm';
const AdminBooksPage = () => {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const { data, isPending } = useQuery({
        queryKey: ['admin-books', searchQuery],
        queryFn: () => getBooks({ page: 1, ordering: '-created_at', query: searchQuery }),
        staleTime: 2 * 60 * 1000,
    });
    const createMutation = useMutation({
        mutationFn: (formData) => createBook(formData),
        onSuccess: () => {
            toast.success('Book created');
            queryClient.invalidateQueries({ queryKey: ['admin-books'] });
            setSelectedBook(null);
        },
        onError: () => toast.error('Failed to create book'),
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, formData }) => updateBook(id, formData),
        onSuccess: () => {
            toast.success('Book updated');
            queryClient.invalidateQueries({ queryKey: ['admin-books'] });
            setSelectedBook(null);
        },
        onError: () => toast.error('Failed to update book'),
    });
    const deleteMutation = useMutation({
        mutationFn: (bookId) => deleteBook(bookId),
        onSuccess: () => {
            toast.success('Book deleted');
            queryClient.invalidateQueries({ queryKey: ['admin-books'] });
        },
        onError: () => toast.error('Failed to delete book'),
    });
    const handleSubmit = (formData) => {
        if (selectedBook) {
            updateMutation.mutate({ id: selectedBook.id, formData });
        }
        else {
            createMutation.mutate(formData);
        }
    };
    const handleEdit = (book) => {
        setSelectedBook(book);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleCancelEdit = () => {
        setSelectedBook(null);
    };
    return (_jsx("div", { className: "space-y-10", children: _jsxs("div", { className: "grid gap-10 lg:grid-cols-[1.1fr_0.9fr]", children: [_jsxs("div", { children: [_jsx("div", { className: "flex items-center justify-between", children: _jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Manage books" }) }), _jsxs("div", { className: "mt-6 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }), _jsx("input", { type: "text", placeholder: "Search books by title, author, or description...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white" })] }), isPending ? (_jsx(LoadingOverlay, { label: "Loading books" })) : (_jsx("div", { className: "mt-6 space-y-4", children: data?.results.map((book) => (_jsxs("div", { className: `rounded-2xl border p-4 transition ${selectedBook?.id === book.id
                                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                                    : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/40'}`, children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-brand-200", children: book.author }), _jsx("h3", { className: "text-base font-semibold text-slate-900 dark:text-white", children: book.title }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: book.is_published ? 'Published' : 'Draft' })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => handleEdit(book), className: "flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300", children: [_jsx(Edit, { className: "h-3 w-3" }), "Edit"] }), _jsx("button", { onClick: () => deleteMutation.mutate(book.id), className: "text-xs text-red-400 hover:text-red-300", disabled: deleteMutation.isPending, children: "Remove" })] })] }), _jsx("p", { className: "mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400", children: book.description })] }, book.id))) }))] }), _jsxs("div", { className: "card p-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: selectedBook ? 'Edit Book' : 'Create Book' }), _jsx("p", { className: "text-xs text-slate-600 dark:text-slate-500", children: selectedBook ? `Editing: ${selectedBook.title} ` : 'Add a new book to the library' })] }), selectedBook && (_jsx("button", { onClick: handleCancelEdit, className: "text-xs text-slate-400 hover:text-white", children: "Cancel" }))] }), _jsx("div", { className: "mt-4", children: _jsx(BookForm, { defaultValues: selectedBook ? {
                                    title: selectedBook.title,
                                    author_name: selectedBook.author,
                                    description: selectedBook.description,
                                    isbn: selectedBook.isbn || '',
                                    language: selectedBook.language,
                                    year: selectedBook.year,
                                    pages: selectedBook.pages,
                                    file_type: selectedBook.file_type,
                                    is_published: selectedBook.is_published,
                                    tags: selectedBook.tags || [],
                                    category_names: selectedBook.categories?.map(c => c.name),
                                } : undefined, onSubmit: handleSubmit, isLoading: createMutation.isPending || updateMutation.isPending }, selectedBook?.id || 'new') })] })] }) }));
};
export default AdminBooksPage;
