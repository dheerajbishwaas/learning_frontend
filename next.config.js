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
          source: "/api/:path*",
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "*" },
            { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
            { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
          ]
        }
      ]
    }
}  