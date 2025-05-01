module.exports = {
    reactStrictMode: true,   // pehle waali setting bhi
    async rewrites() {
        return [
        {
            source: '/login',           // user URL
            destination: '/auth/login', // actual file path
        }, 
        {
            source: '/admin/course/update/:id',  // User URL pattern
            destination: '/admin/course/update',   // Actual dynamic file path
          },
        ];
    },
}