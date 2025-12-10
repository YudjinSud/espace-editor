import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { RootLayout } from "@/widgets";

export const Route = createRootRoute({
    component: () => (
        <>
            <RootLayout>
                <Outlet />
            </RootLayout>
            <TanStackRouterDevtools />
        </>
    ),
});
