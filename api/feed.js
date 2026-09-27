/**
 * Fetches a podcast RSS feed server-side, because most publishers send no CORS headers
 * and the browser will not hand their feed to the app. Served by Vercel's free tier as
 * a function at /api/feed?url=<encoded feed url>.
 *
 * This is reachable by anyone, so it is deliberately narrow: https only, no private or
 * internal hosts, a short timeout and a size cap.
 */

const TIMEOUT_MS = 20_000
const MAX_BYTES = 10 * 1024 * 1024

// Hostnames that must never be fetched through here.
const BLOCKED_HOSTS = new Set(['localhost', 'metadata.google.internal', 'instance-data'])

function isBlocked(hostname) {
    const host = hostname.toLowerCase().replace(/^\[|\]$/g, '')
    if (BLOCKED_HOSTS.has(host)) return true
    if (host.endsWith('.local') || host.endsWith('.internal')) return true
    if (host === '::1' || host.startsWith('fe80:')) return true
    if (/^127\./.test(host)) return true
    if (/^10\./.test(host)) return true
    if (/^192\.168\./.test(host)) return true
    if (/^169\.254\./.test(host)) return true
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return true
    return false
}

export default async function handler(request, response) {
    const requested = typeof request.query.url === 'string' ? request.query.url : ''

    let target
    try {
        target = new URL(requested)
    } catch {
        response.status(400).json({ error: 'A valid feed url is required.' })
        return
    }

    if (target.protocol !== 'https:') {
        response.status(400).json({ error: 'Only https feed urls are supported.' })
        return
    }

    if (isBlocked(target.hostname)) {
        response.status(400).json({ error: 'That host is not reachable through this proxy.' })
        return
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

    try {
        const upstream = await fetch(target, {
            signal: controller.signal,
            redirect: 'follow',
            headers: {
                Accept: 'application/rss+xml, application/xml, text/xml, */*',
                'User-Agent': 'Quitecasts/1.0 (+podcast feed reader)',
            },
        })

        if (!upstream.ok) {
            response.status(502).json({ error: `The publisher responded ${upstream.status}.` })
            return
        }

        const body = await upstream.text()
        if (body.length > MAX_BYTES) {
            response.status(502).json({ error: 'That feed is too large to proxy.' })
            return
        }

        // Feeds change a few times a week at most, so a short shared cache keeps this
        // well inside the free tier's request budget.
        response.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/xml')
        response.setHeader('Cache-Control', 'public, max-age=900, s-maxage=1800')
        response.status(200).send(body)
    } catch {
        response.status(502).json({ error: 'The publisher could not be reached.' })
    } finally {
        clearTimeout(timer)
    }
}
