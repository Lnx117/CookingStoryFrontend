export const useCookApi: typeof useFetch = (request, opts?) => {
    const config = useRuntimeConfig()
    const auth = useAuth()

    return useFetch(request, {
        baseURL: config.public.apiBase as string,
        timeout: 30000,
        watch: false,
        onRequest({ options }) {
            options.headers = new Headers(options.headers || {})

            if (auth.token?.value) {
                options.headers.set('authorization', auth.token.value)
            }
        },
        ...opts,
        //для вывода ошибки, чтобы запрос отличался от предыдущего даже если параметры не поменялись
        key: `${Date.now()}`,
        immediate: true,
    })
}