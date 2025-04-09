/**
 * Logs all registered routes in an Express app
 * @param {object} app - Express app instance
 */
const logRoutes = (app) => {
  console.log('\n📍 API ROUTES:');
  
  // Function to print routes from a router
  const printRoutes = (baseRoute, router) => {
    router.stack.forEach(layer => {
      if (layer.route) {
        // Routes registered directly with the router
        const methods = Object.keys(layer.route.methods)
          .filter(method => layer.route.methods[method])
          .map(method => method.toUpperCase())
          .join(', ');
        
        console.log(`${methods} ${baseRoute}${layer.route.path}`);
      } else if (layer.name === 'router') {
        // Routes from mounted routers
        const path = baseRoute === '/' ? '' : baseRoute;
        printRoutes(`${path}${layer.regexp.source.replace('^\\/(?=\\/|$)', '/')}`, layer.handle);
      }
    });
  };

  // Get registered routes
  const routers = app._router.stack
    .filter(layer => layer.name === 'router')
    .map(layer => {
      // Extract path pattern
      let path = layer.regexp.source.replace('^\\/(?=\\/|$)', '/');
      path = path.replace('(?:\\/)?(?=\\/|$)', '').replace(/\\\\/, '\\');
      path = path === '/' ? '/api/v1' : `/api/v1${path}`;
      
      return {
        path,
        router: layer.handle
      };
    });

  // Print all routes
  routers.forEach(router => {
    printRoutes(router.path, router.router);
  });
  
  console.log('\n');
};

module.exports = logRoutes;
