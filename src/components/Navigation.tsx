import { Icon, type IconName } from './Icon'

const items: { path: string; label: string; icon: IconName }[] = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/search', label: 'Search', icon: 'search' },
    { path: '/subscriptions', label: 'Subscriptions', icon: 'subscriptions' },
    { path: '/activity', label: 'Activity', icon: 'activity' },
]

export function Navigation({ path, theme, onNavigate, onToggleTheme }: { path: string; theme: 'light' | 'dark'; onNavigate: (path: string) => void; onToggleTheme: () => void }) {
    return <nav className="navigation" aria-label="Primary navigation">
        <div className="brand"><span className="brand-mark">q</span><span>quietcasts</span></div>
        <div className="nav-links">{items.map((item) => <button className={path === item.path ? 'nav-link active' : 'nav-link'} key={item.path} onClick={() => onNavigate(item.path)}><Icon name={item.icon} size={19} /><span>{item.label}</span></button>)}</div>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}><Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} /><span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span></button>
    </nav>
}
