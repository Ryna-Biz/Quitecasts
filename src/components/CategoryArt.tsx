import { useId, type ReactElement } from 'react'

interface CategoryArtwork {
    from: string
    to: string
    glyph: ReactElement
}

const artwork: Record<string, CategoryArtwork> = {
    Arts: {
        from: '#F97316', to: '#DB2777',
        glyph: <><path d="M12 21a9 9 0 1 1 9-9c0 2-1.6 3-3 3h-1.5a2 2 0 0 0-1.4 3.4A2 2 0 0 1 12 21Z" /><circle cx="7.5" cy="12.5" r=".9" /><circle cx="9.5" cy="8" r=".9" /><circle cx="14.5" cy="7" r=".9" /></>,
    },
    Comedy: {
        from: '#F59E0B', to: '#EF4444',
        glyph: <><path d="M4 5h16v6.5A8 8 0 0 1 12 19.5 8 8 0 0 1 4 11.5Z" /><path d="M8.2 10.2h1.6M14.2 10.2h1.6" /><path d="M8.8 14.6c1.8 1.5 4.6 1.5 6.4 0" /></>,
    },
    Education: {
        from: '#0EA5E9', to: '#6366F1',
        glyph: <><path d="M12 4 2.5 8.6 12 13.2l9.5-4.6Z" /><path d="M6.5 10.6V15c0 1.8 2.5 3.2 5.5 3.2s5.5-1.4 5.5-3.2v-4.4" /><path d="M20.5 9.2v4.6" /></>,
    },
    Finance: {
        from: '#10B981', to: '#0EA5E9',
        glyph: <><path d="M4 20h16" /><path d="M7 20v-5.5" /><path d="M12 20V9" /><path d="M17 20v-8.5" /><path d="m6.2 9.5 4-3.5 3.4 2.4 4.6-4.4" /></>,
    },
    Health: {
        from: '#14B8A6', to: '#10B981',
        glyph: <><path d="M12 20.2s-7.2-4.4-7.2-9.4A4.2 4.2 0 0 1 12 8.3a4.2 4.2 0 0 1 7.2 2.5c0 5-7.2 9.4-7.2 9.4Z" /><path d="M4.8 13.2h3.4l1.6-2.8 2.2 4.6 1.5-2.6h3.4" /></>,
    },
    Relationships: {
        from: '#EC4899', to: '#8B5CF6',
        glyph: <><circle cx="9.3" cy="14" r="5.6" /><circle cx="14.7" cy="14" r="5.6" /></>,
    },
    'True Crime': {
        from: '#64748B', to: '#1E1B4B',
        glyph: <><path d="M4.4 13.2a7.6 7.6 0 0 1 15.2 0v1.4" /><path d="M7.6 19.2v-6a4.4 4.4 0 0 1 8.8 0v3.4" /><path d="M10.7 20.6V13.2a1.3 1.3 0 0 1 2.6 0v5.4" /></>,
    },
    Technology: {
        from: '#6366F1', to: '#8B5CF6',
        glyph: <><rect x="7.2" y="7.2" width="9.6" height="9.6" rx="2.2" /><path d="M10.2 3.4v3.8M13.8 3.4v3.8M10.2 16.8v3.8M13.8 16.8v3.8M3.4 10.2h3.8M3.4 13.8h3.8M16.8 10.2h3.8M16.8 13.8h3.8" /></>,
    },
}

const glyphStroke = {
    fill: 'none',
    stroke: '#FFFFFF',
    strokeWidth: 2.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
}

/** Self-contained cover art for a browse category — no network request, always renders. */
export function CategoryArt({ category, className }: { category: string; className?: string }) {
    const gradientId = `category-art-${useId().replace(/:/g, '')}`
    const entry = artwork[category] ?? { from: '#6366F1', to: '#8B5CF6', glyph: artwork.Technology.glyph }
    return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={entry.from} />
                    <stop offset="100%" stopColor={entry.to} />
                </linearGradient>
            </defs>
            <rect width="24" height="24" fill={`url(#${gradientId})`} />
            <g {...glyphStroke} transform="translate(4 4) scale(0.667)">{entry.glyph}</g>
        </svg>
    )
}
