import api from './client';
export const getDashboard = async (period = 'week') => {
    const response = await api.get('/reading/dashboard/', {
        params: { period }
    });
    return response.data;
};
export const getUserAnalytics = async (period = 'week') => {
    const { data } = await api.get('/reading/analytics/', {
        params: { period }
    });
    return data;
};
export const getProgress = async (bookId) => {
    const { data } = await api.get(`/reading/progress/${bookId}/`);
    return data;
};
export const updateProgress = async (bookId, payload) => {
    const { data } = await api.patch(`/reading/progress/${bookId}/`, payload);
    return data;
};
export const getOrCreateSession = async (bookId) => {
    const { data } = await api.get(`/reading/sessions/${bookId}/active/`);
    return data;
};
export const updateSessionProgress = async (sessionId, payload) => {
    const { data } = await api.patch(`/reading/sessions/${sessionId}/update/`, payload);
    return data;
};
export const endSession = async (sessionId) => {
    const { data } = await api.post(`/reading/sessions/${sessionId}/end/`);
    return data;
};
