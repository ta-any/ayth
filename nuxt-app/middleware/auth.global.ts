export default defineNuxtRouteMiddleware((to) => {
    const user = useState('user')

    // Redirect to login if not authenticated and trying to access protected page
    if (!user.value && to.path !== '/login') {
        return navigateTo('/login')
    }

    // Redirect to dashboard if already logged in
    if (user.value && to.path === '/login') {
        return navigateTo('/dashboard')
    }
})