import api from './client';
export const getAdminOverview = async () => {
    const { data } = await api.get('/analytics/admin/overview/');
    return data;
};
// Admin User Management
export const getUsers = async () => {
    const { data } = await api.get('/accounts/users/');
    return data;
};
export const updateUserRole = async (userId, role) => {
    const { data } = await api.patch(`/accounts/users/${userId}/assign_role/`, { role });
    return data;
};
export const deleteUser = async (userId) => {
    await api.delete(`/accounts/users/${userId}/`);
};
