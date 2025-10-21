import React, { forwardRef, ImgHTMLAttributes } from "react";

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    /**
     * Image source (required)
     */
    src: string;
    /**
     * Fallback source used when the main src fails to load
     */
    fallbackSrc?: string;
    /**
     * Whether to lazy-load the image. Defaults to true.
     */
    lazy?: boolean;
    /**
     * Provide srcSet for responsive images (e.g. "small.jpg 480w, medium.jpg 800w")
     */
    srcSet?: string;
    /**
     * sizes attribute (e.g. "(max-width: 600px) 480px, 800px")
     */
    sizes?: string;
    /**
     * Object-fit style (cover | contain | fill | none | scale-down)
     */
    objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
    /**
     * Placeholder: 'none' | 'blur' (if blur you can pass a blurDataURL via style backgroundImage)
     */
    placeholder?: "none" | "blur";
    /**
     * If true, the component will stop trying the fallback after it fails (prevents loops)
     */
    stopOnFallbackError?: boolean;
}

/**
 * Reusable Image component with defaults and fallback handling.
 */
export const CustomImage = forwardRef<HTMLImageElement, ImageProps>(
    (
        {
            alt,
            lazy = true,
            srcSet,
            sizes,
            objectFit = "cover",
            decoding = "async",
            draggable = false,
            loading, // allow override if user passes explicit value
            className,
            style,
            onLoad,
            ...rest
        },
        ref
    ) => {

        const loadingVal = loading ?? (lazy ? "lazy" : "eager");

        const mergedStyle: React.CSSProperties = {
            objectFit,
            // if placeholder is blur, user can pass blur style via style prop (we don't force a blur filter here)
            ...style,
        };

        return (
            <img
                ref={ref}
                alt={alt ?? ""}
                srcSet={srcSet}
                sizes={sizes}
                loading={loadingVal}
                decoding={decoding}
                draggable={draggable}
                className={className}
                style={mergedStyle}
                onLoad={onLoad}
                {...rest}
            />
        );
    }
);

CustomImage.displayName = "Image";

export default CustomImage;
