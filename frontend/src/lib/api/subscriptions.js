import client from './client';
export const getPlans = async () => {
    const response = await client.get('/subscriptions/plans/');
    return response.data;
};
export const createSubscription = async (data) => {
    const response = await client.post('/subscriptions/subscribe/', data);
    return response.data;
};
export const getMySubscription = async () => {
    const response = await client.get('/subscriptions/me/');
    return response.data;
};
