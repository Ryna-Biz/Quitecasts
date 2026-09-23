import { Icon } from './Icon'

export function PlayButton({ playing, onClick, label, small = false }: { playing: boolean; onClick: () => void; label: string; small?: boolean }) {
    return <button className={`play-button${small ? ' play-button-small' : ''}`} onClick={onClick} aria-label={label} title={label}><Icon name={playing ? 'pause' : 'play'} size={small ? 15 : 18} /></button>
}
