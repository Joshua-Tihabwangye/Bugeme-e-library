import api from './client';
export const getHighlights = async (bookId) => {
    const { data } = await api.get(`/reading/highlights/${bookId}/`);
    return data;
};
export const createHighlight = async (bookId, payload) => {
    const { data } = await api.post(`/reading/highlights/${bookId}/`, payload);
    return data;
};
export const updateHighlight = async (highlightId, payload) => {
    const { data } = await api.patch(`/reading/highlights/${highlightId}/detail/`, payload);
    return data;
};
export const deleteHighlight = async (highlightId) => {
    await api.delete(`/reading/highlights/${highlightId}/detail/`);
};
