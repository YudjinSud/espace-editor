import type { ReactNode } from "react";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { PhonePreview } from "@/shared";
import { desktopContainerVariants } from "./styles";

type RootLayoutProps = {
    children: ReactNode;
};

export function RootLayout({ children }: RootLayoutProps) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return <>{children}</>;
    }

    return (
        <div className={desktopContainerVariants()}>
            <PhonePreview>{children}</PhonePreview>
        </div>
    );
}
