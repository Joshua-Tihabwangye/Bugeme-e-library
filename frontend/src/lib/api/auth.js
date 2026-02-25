import api from './client';
export const login = async (payload) => {
    const { data } = await api.post('/auth/login/', payload);
    return data;
};
export const register = async (payload) => {
    const { data } = await api.post('/auth/register/', payload);
    return data;
};
export const fetchProfile = async () => {
    const { data } = await api.get('/auth/me/');
    return data;
};
export const logout = async (refresh) => {
    if (!refresh)
        return;
    await api.post('/auth/logout/', { refresh_token: refresh });
};
export const requestPasswordReset = async (email) => {
    const { data } = await api.post('/auth/password-reset/request/', { email });
    return data;
};
export const verifyResetCode = async (email, code) => {
    const { data } = await api.post('/auth/password-reset/verify/', { email, code });
    return data;
};
export const completePasswordReset = async (email, code, password) => {
    const { data } = await api.post('/auth/password-reset/complete/', {
        email,
        code,
        password,
    });
    return data;
};
export const resendResetCode = async (email) => {
    const { data } = await api.post('/auth/password-reset/resend/', { email });
    return data;
};
