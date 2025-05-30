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
      {
        source: '/admin/users/update/:id',  // User URL pattern
        destination: '/admin/users/update',   // Actual dynamic file path
      },
      {
        source: '/courses',  // User URL pattern
        destination: '/public/courses',   // Actual dynamic file path
      },
      {
        source: '/about',  // User URL pattern
        destination: '/public/about',   // Actual dynamic file path
      },
      {
        source: '/contact',  // User URL pattern
        destination: '/public/contact',   // Actual dynamic file path
      },
       {
        source: '/course/:id',  // User URL pattern
        destination: '/public/course',   // Actual dynamic file path
      },
    ];
  }
}