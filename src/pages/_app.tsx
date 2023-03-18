import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import SidebarWithHeader from '@/components/SidebarWithNav';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <ChakraProvider>
      {currentPath === '/login' ? (
        <Component {...pageProps} />
      ) : (
        <SidebarWithHeader>
          <Component {...pageProps} />
        </SidebarWithHeader>
      )}
    </ChakraProvider>
  );
}
