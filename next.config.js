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
        {
            source: '/admin/categories/update/:id',  // User URL pattern
            destination: '/admin/categories/update',   // Actual dynamic file path
          },
        ];
    },
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            { key: 'Access-Control-Allow-Credentials', value: 'true' },
            { key: 'Access-Control-Allow-Origin', value: 'https://learning-frontend-coral.vercel.app' },
          ],
        },
      ];
    }
}