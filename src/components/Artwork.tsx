export function Artwork({ src, alt, size = 'medium' }: { src: string; alt: string; size?: 'small' | 'medium' | 'large' }) {
    return <img className={`artwork artwork-${size}`} src={src} alt={alt} loading="lazy" />
}
