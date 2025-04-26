module.exports = {
    reactStrictMode: true,   // pehle waali setting bhi
    async rewrites() {
        return [
        {
            source: '/login',           // user URL
            destination: '/auth/login', // actual file path
        },
        ];
    },
}