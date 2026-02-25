import api from './client';
export const getCategories = async () => {
    const { data } = await api.get('/catalog/categories/');
    return data;
};
export const createCategory = async (payload) => {
    const { data } = await api.post('/catalog/categories/', payload);
    return data;
};
export const getBooks = async (params) => {
    const { data } = await api.get('/catalog/books/', { params });
    return data;
};
export const getBookDetail = async (bookId) => {
    const { data } = await api.get(`/catalog/books/${bookId}/`);
    return data;
};
export const getBookFileUrl = async (bookId) => {
    const { data } = await api.get(`/catalog/books/${bookId}/file/`);
    return data.url;
};
export const streamBookContent = async (bookId) => {
    const { data } = await api.get(`/catalog/books/${bookId}/read/stream/`);
    return data.url;
};
export const toggleLike = async (bookId) => {
    const { data } = await api.post(`/catalog/books/${bookId}/like/`);
    return data;
};
export const toggleBookmark = async (bookId, location) => {
    const { data } = await api.post(`/catalog/books/${bookId}/bookmark/`, { location });
    return data;
};
const toFormData = (payload) => {
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null)
            return;
        if (key === 'category_names' && Array.isArray(value)) {
            value.forEach((name) => form.append('category_names', name));
        }
        else if (key === 'tags' && Array.isArray(value)) {
            form.append('tags', JSON.stringify(value));
        }
        else if (value instanceof File) {
            form.append(key, value);
        }
        else {
            form.append(key, String(value));
        }
    });
    return form;
};
const ensureFormData = (payload) => payload instanceof FormData ? payload : toFormData(payload);
export const createBook = async (payload) => {
    const { data } = await api.post('/catalog/books/', ensureFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
};
export const updateBook = async (bookId, payload) => {
    const { data } = await api.patch(`/catalog/books/${bookId}/`, ensureFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
};
export const deleteBook = async (bookId) => {
    await api.delete(`/catalog/books/${bookId}/`);
};
