import api from './client';
export const getAdminOverview = async (readsPeriod = 'month', likedPeriod = 'month', searchPeriod = 'month', viewedPeriod = 'month') => {
    const { data } = await api.get('/analytics/admin/overview/', {
        params: {
            reads_period: readsPeriod,
            liked_period: likedPeriod,
            search_period: searchPeriod,
            viewed_period: viewedPeriod
        }
    });
    return data;
};
