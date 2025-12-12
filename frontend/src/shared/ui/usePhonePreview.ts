import { useCallback, useEffect, useRef, useState } from "react";

const STATUS_PANEL_HEIGHT = 70;
const VERTICAL_MARGIN = 32;
const REAL_WIDGET_HEIGHT = 850;
const IFRAME_RATIO = 417 / 850;

type ContentSize = {
    width: string;
    height: string;
    transform: string;
    marginTop: string;
};

type ContainerPosition = {
    top: number;
};

function positionElement(
    el: HTMLElement | null,
    parent: HTMLElement | null,
): ContainerPosition {
    let top = 0;
    if (!el || !parent) {
        return { top };
    }

    const parentHeight = parent.offsetHeight;
    const { height: elHeight } = el.getBoundingClientRect();
    const ideal = (parentHeight - elHeight) / 2;

    if (parentHeight >= elHeight + 2 * VERTICAL_MARGIN) {
        top = Math.max(
            VERTICAL_MARGIN,
            Math.min(ideal, parentHeight - VERTICAL_MARGIN - elHeight),
        );
    } else {
        top = VERTICAL_MARGIN;
    }

    return { top };
}

export function usePhonePreview() {
    const [contentSize, setContentSize] = useState<ContentSize>({
        width: "400px",
        height: "800px",
        transform: "none",
        marginTop: "0",
    });
    const [containerPosition, setContainerPosition] =
        useState<ContainerPosition>({ top: 0 });

    const relativeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const phoneImageRef = useRef<HTMLImageElement>(null);

    const resizeIframe = useCallback(() => {
        if (phoneImageRef.current) {
            const phoneHeight = phoneImageRef.current.offsetHeight * 0.91;
            const scale = phoneHeight / REAL_WIDGET_HEIGHT;
            const marginTop = scale * STATUS_PANEL_HEIGHT;
            const width = REAL_WIDGET_HEIGHT * IFRAME_RATIO;

            setContentSize({
                width: `${width}px`,
                height: `${REAL_WIDGET_HEIGHT}px`,
                transform: `scale(${scale})`,
                marginTop: `${marginTop}px`,
            });
        }

        setContainerPosition(
            positionElement(containerRef.current, relativeRef.current),
        );
    }, []);

    useEffect(() => {
        resizeIframe();
        window.addEventListener("resize", resizeIframe);
        return () => window.removeEventListener("resize", resizeIframe);
    }, [resizeIframe]);

    useEffect(() => {
        const timeout = setTimeout(resizeIframe, 10);
        return () => clearTimeout(timeout);
    }, [resizeIframe]);

    return {
        contentSize,
        containerPosition,
        relativeRef,
        containerRef,
        phoneImageRef,
        onImageLoad: resizeIframe,
    };
}
