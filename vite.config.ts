import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Podcast publishers rarely send CORS headers, so the browser refuses to give their feed
 * to the app. This serves the feed same-origin during development so the app is usable
 * locally. In production the same /api/feed route is served by the Vercel function in
 * api/feed.js, so the app needs no configuration for either environment.
 */
function feedProxy(): Plugin {
    return {
        name: 'quietcasts-feed-proxy',
        configureServer(server) {
            server.middlewares.use('/api/feed', async (req, res) => {
                const requested = new URL(req.url ?? '', 'http://localhost').searchParams.get('url')
                if (!requested) {
                    res.statusCode = 400
                    res.end('Missing url parameter')
                    return
                }

                let target: URL
                try {
                    target = new URL(requested)
                    if (target.protocol !== 'https:') throw new Error('https only')
                } catch {
                    res.statusCode = 400
                    res.end('Only absolute https feed URLs are proxied')
                    return
                }

                try {
                    const upstream = await fetch(target, {
                        signal: AbortSignal.timeout(25_000),
                        headers: { 'User-Agent': 'Quietcasts/1.0 (+podcast feed reader)' },
                    })
                    res.statusCode = upstream.status
                    res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/xml')
                    res.end(await upstream.text())
                } catch {
                    res.statusCode = 502
                    res.end('The publisher could not be reached')
                }
            })
        },
    }
}

export default defineConfig({
    plugins: [react(), feedProxy()],
})
