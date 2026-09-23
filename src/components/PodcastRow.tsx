import type { Podcast } from '../types/podcast'
import { Artwork } from './Artwork'
import { Icon } from './Icon'

export function PodcastRow({ podcast, onOpen }: { podcast: Podcast; onOpen: () => void }) {
    return <button className="podcast-row" onClick={onOpen}>
        <Artwork src={podcast.artwork} alt="" size="medium" />
        <span className="podcast-row-copy"><strong>{podcast.title}</strong><span>{podcast.author}</span><small>{podcast.category}</small></span>
        <Icon name="chevron" size={19} />
    </button>
}
