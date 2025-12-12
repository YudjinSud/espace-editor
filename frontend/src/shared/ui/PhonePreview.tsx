import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { usePhonePreview } from "./usePhonePreview";

type PhonePreviewProps = {
    children: ReactNode;
};

export function PhonePreview({ children }: PhonePreviewProps) {
    const {
        contentSize,
        containerPosition,
        relativeRef,
        containerRef,
        phoneImageRef,
        onImageLoad,
    } = usePhonePreview();

    return (
        <div
            ref={relativeRef}
            className="relative flex h-full min-h-[600px] w-full items-center justify-center"
        >
            <img
                ref={phoneImageRef}
                alt="iPhone Frame"
                className={cn(
                    "pointer-events-none",
                    "absolute",
                    "left-1/2",
                    "-translate-x-1/2",
                )}
                src="/iPhone.svg"
                style={{
                    top: containerPosition.top,
                    height: "calc(100% - 120px)",
                    minHeight: "550px",
                    zIndex: 1,
                }}
                onLoad={onImageLoad}
            />

            <div
                ref={containerRef}
                className="absolute"
                style={{
                    top: containerPosition.top,
                    left: "50%",
                    transform: "translateX(-50%)",
                    height: "calc(100% - 120px)",
                    minHeight: "550px",
                    zIndex: 2,
                }}
            >
                <div
                    className="origin-top overflow-hidden rounded-b-[60px] bg-white"
                    style={contentSize}
                >
                    <div className="h-[calc(100%-45px)] overflow-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
