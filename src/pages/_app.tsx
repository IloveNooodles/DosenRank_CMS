import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import SidebarWithHeader from "@/components/SidebarWithNav";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <SidebarWithHeader>
                <Component {...pageProps} />
            </SidebarWithHeader>
        </ChakraProvider>
    );
}
