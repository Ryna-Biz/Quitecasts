import type { Episode } from '../types/podcast'

const audioUrl = 'https://storage.googleapis.com/coverr-main/mp3/Mt_Baker.mp3'

export const episodes: Episode[] = [
    { id: 'signal-path-01', podcastId: 'signal-path', title: 'The shape of useful technology', description: 'A conversation about designing tools that stay out of the way.', audioUrl, publishedAt: '2026-09-18', duration: 1860 },
    { id: 'signal-path-02', podcastId: 'signal-path', title: 'When the interface disappears', description: 'What happens when the best product is the one you barely notice?', audioUrl, publishedAt: '2026-09-11', duration: 2140 },
    { id: 'small-hours-01', podcastId: 'small-hours', title: 'A room of your own', description: 'On attention, solitude, and making a place for a thought to finish.', audioUrl, publishedAt: '2026-09-16', duration: 1440 },
    { id: 'small-hours-02', podcastId: 'small-hours', title: 'The art of the ordinary day', description: 'Finding texture in routines that look unremarkable from the outside.', audioUrl, publishedAt: '2026-09-02', duration: 1680 },
    { id: 'field-notes-01', podcastId: 'field-notes', title: 'The city after dark', description: 'How cities change when the working day ends.', audioUrl, publishedAt: '2026-09-14', duration: 1920 },
    { id: 'field-notes-02', podcastId: 'field-notes', title: 'Listening to a watershed', description: 'A field recording and conversation from a river restoration project.', audioUrl, publishedAt: '2026-08-28', duration: 2310 },
    { id: 'long-view-01', podcastId: 'the-long-view', title: 'The invention of the weekend', description: 'A small history of how time off became a social institution.', audioUrl, publishedAt: '2026-09-12', duration: 2040 },
    { id: 'long-view-02', podcastId: 'the-long-view', title: 'Maps that changed the world', description: 'The political power hidden in a line drawn across a page.', audioUrl, publishedAt: '2026-08-30', duration: 2220 },
    { id: 'common-ground-01', podcastId: 'common-ground', title: 'How a library becomes a commons', description: 'The public spaces that make a neighborhood feel like itself.', audioUrl, publishedAt: '2026-09-09', duration: 1740 },
    { id: 'after-rain-01', podcastId: 'after-the-rain', title: 'Making room for unfinished work', description: 'A practical conversation about creative momentum.', audioUrl, publishedAt: '2026-09-07', duration: 1560 },
    { id: 'open-water-01', podcastId: 'open-water', title: 'What the tide remembers', description: 'Coastlines, memory, and the changing edge of land.', audioUrl, publishedAt: '2026-09-05', duration: 1980 },
    { id: 'work-progress-01', podcastId: 'work-in-progress', title: 'The first useful draft', description: 'Why shipping an imperfect first pass can be a generous act.', audioUrl, publishedAt: '2026-09-03', duration: 1620 },
]
