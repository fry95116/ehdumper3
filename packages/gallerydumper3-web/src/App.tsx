import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export const NotFoundPage = () => (
  <div className="mt-16 flex flex-col items-center justify-center text-white">
    <h1>404 - 页面未找到</h1>
    <p>您访问的页面不存在。</p>
  </div>
);

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
  scrollRestoration: true,
  notFoundMode: 'fuzzy',
  defaultNotFoundComponent: NotFoundPage,
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;
