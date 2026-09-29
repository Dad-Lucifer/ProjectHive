import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes/router';
import { ToastProvider } from './components/ui/ToastProvider';
import { useCurrentUser } from './hooks/useCurrentUser';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useCurrentUser();
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthInitializer>
          <RouterProvider router={router} />
        </AuthInitializer>
      </ToastProvider>
    </QueryClientProvider>
  );
}
