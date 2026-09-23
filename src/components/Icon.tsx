import type { ReactElement } from 'react'

export type IconName = 'home' | 'search' | 'subscriptions' | 'activity' | 'play' | 'pause' | 'back' | 'forward' | 'chevron' | 'plus' | 'check' | 'download' | 'queue' | 'volume' | 'close' | 'sun' | 'moon'

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
    const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
    const paths: Record<IconName, ReactElement> = {
        home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /></>,
        search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
        subscriptions: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></>,
        activity: <><path d="M4 19V5M4 19h16" /><path d="m7 15 3-4 3 2 4-6" /></>,
        play: <path d="m8 5 11 7-11 7Z" fill="currentColor" stroke="none" />,
        pause: <><path d="M8 5v14M16 5v14" /></>,
        back: <><path d="M7 6 3 12l4 6" /><path d="M3 12h9a5 5 0 0 1 5 5" /></>,
        forward: <><path d="m17 6 4 6-4 6" /><path d="M21 12h-9a5 5 0 0 0-5 5" /></>,
        chevron: <path d="m9 18 6-6-6-6" />,
        plus: <><path d="M12 5v14M5 12h14" /></>,
        check: <path d="m5 12 4 4L19 6" />,
        download: <><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></>,
        queue: <><path d="M4 6h12M4 12h12M4 18h7" /><path d="m17 15 4 3-4 3Z" /></>,
        volume: <><path d="M4 10v4h4l5 4V6l-5 4Z" /><path d="M17 9a4 4 0 0 1 0 6" /></>,
        close: <><path d="m6 6 12 12M18 6 6 18" /></>,
        sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>,
        moon: <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />,
    }
    return <svg {...common}>{paths[name]}</svg>
}
