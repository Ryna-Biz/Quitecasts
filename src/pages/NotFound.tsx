export function NotFound({ onNavigate }: { onNavigate: (path: string) => void }) {
    return <div className="page empty-state"><p className="eyebrow">404</p><h1>That page isn’t here.</h1><button className="primary-button" onClick={() => onNavigate('/')}>Back home</button></div>
}
