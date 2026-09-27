import type { Podcast } from '../types/podcast'
import { Artwork } from './Artwork'

export function PodcastCard({ podcast, onOpen }: { podcast: Podcast; onOpen: () => void }) {
    return <button className="podcast-card" onClick={onOpen} title={podcast.title}>
        <Artwork src={podcast.artwork} alt="" size="large" />
        <span className="podcast-card-copy">
            <strong>{podcast.title}</strong>
            <span>{podcast.author}</span>
            <small>{podcast.category}</small>
        </span>
    </button>
}
