export default defineNuxtRouteMiddleware(async (to) => {
    if (process.server) return;

    const user = useState('user');
    const protectedRoutes = ['/dashboard'];
    if (!protectedRoutes.includes(to.path)) return;
    if (!user.value) {
        const userFromStorage = localStorage.getItem('user');
        if (userFromStorage) {
            try {
                user.value = JSON.parse(userFromStorage);
                return;
            } catch (e) {
                console.error('Ошибка парсинга пользователя', e);
                localStorage.removeItem('user');
            }
        }

        return navigateTo('/login');
    }

    if (to.path === '/') {
        return navigateTo('/login')
    }
});