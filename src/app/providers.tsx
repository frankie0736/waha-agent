"use client";

import { api } from "@/utils/api";
import { queryClient } from "@/utils/api";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import superjson from "superjson";

export function Providers({ children }: { children: ReactNode }) {
	const [trpcClient] = useState(() =>
		api.createClient({
			links: [
				httpBatchLink({
					url: "/api/trpc",
					transformer: superjson,
				}),
			],
		}),
	);

	return (
		<api.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				{children}
				<Toaster
					position="top-center"
					theme="light"
					duration={3000}
					richColors
				/>
			</QueryClientProvider>
		</api.Provider>
	);
}
