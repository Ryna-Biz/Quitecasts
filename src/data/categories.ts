export const CATEGORIES = [
    'Arts',
    'Comedy',
    'Education',
    'Finance',
    'Health',
    'History',
    'News',
    'Relationships',
    'Science',
    'Sports',
    'True Crime',
    'Technology',
] as const

export type Category = (typeof CATEGORIES)[number]

/**
 * The iTunes genres each browse category actually spans. Several of our category
 * names are friendlier than Apple's own (we offer "Finance", Apple files it under
 * "Business"), so these keep result ranking honest instead of matching on name.
 */
const CATEGORY_GENRES: Record<Category, string[]> = {
    Arts: ['arts', 'design', 'fashion & beauty', 'food', 'performing arts', 'visual arts'],
    Comedy: ['comedy'],
    Education: ['education', 'self-improvement', 'language learning'],
    Finance: ['business', 'investing', 'entrepreneurship', 'money'],
    Health: ['health & fitness', 'medicine', 'mental health', 'nutrition', 'fitness'],
    History: ['history'],
    News: ['news', 'politics', 'news commentary', 'daily news'],
    Relationships: ['society & culture', 'relationships', 'personal journals', 'philosophy'],
    Science: ['science', 'natural sciences', 'astronomy', 'physics', 'biology', 'earth sciences'],
    Sports: ['sports', 'football', 'basketball', 'soccer', 'running', 'golf', 'baseball', 'hockey'],
    'True Crime': ['true crime', 'society & culture', 'documentary', 'tv & film'],
    Technology: ['technology', 'software how-to', 'tech news'],
}

export function isKnownCategory(name: string): name is Category {
    return (CATEGORIES as readonly string[]).includes(name)
}

/**
 * iTunes free-text search matches loosely, so a genre term can return plenty of
 * off-genre shows. Sort the genuine matches to the front instead of hiding the rest.
 */
export function rankByCategory<T extends { category: string }>(results: T[], category: Category): T[] {
    const genres = CATEGORY_GENRES[category] ?? [category.toLowerCase()]
    const rank = (item: T) => {
        const value = item.category.toLowerCase()
        const index = genres.findIndex((genre) => value === genre || value.startsWith(`${genre} `))
        return index === -1 ? genres.length : index
    }
    return [...results].sort((a, b) => rank(a) - rank(b))
}
