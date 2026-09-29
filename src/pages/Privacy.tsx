import { CATEGORIES } from '../data/categories'
import { Icon } from '../components/Icon'

const LAST_UPDATED = '29 September 2026'

export function Privacy({ onNavigate }: { onNavigate: (path: string) => void }) {
    return (
        <div className="page legal-page">
            <button className="back-link" onClick={() => onNavigate('/')}>
                <Icon name="back" size={17} /> Back
            </button>

            <header className="legal-header">
                <p className="eyebrow">Legal</p>
                <h1>Privacy Policy</h1>
                <p className="intro-copy">
                    How QuietCasts&trade; handles your data. Plainly, and without hiding behind jargon.
                </p>
                <p className="legal-updated">Last updated {LAST_UPDATED}</p>
            </header>

            <section className="legal-section">
                <h2>Who we are</h2>
                <p>
                    QuietCasts&trade; is a product of <strong>RYNA&trade;</strong>, a registered trademark.
                    RYNA&trade; is responsible for this application and for the data it processes.
                    Reach us at <a href="https://rynabiz.com" target="_blank" rel="noopener noreferrer">rynabiz.com</a>.
                </p>
            </section>

            <section className="legal-section">
                <h2>What we collect</h2>
                <p>Only two kinds of information, and neither is bought, sold or rented.</p>
                <ul>
                    <li>
                        <strong>Account details.</strong> If you sign in with Google, we receive your email
                        address, display name and profile photo from Google. We never see or store your
                        Google password.
                    </li>
                    <li>
                        <strong>Your listening activity.</strong> The shows you subscribe to, your episode
                        progress and play position, listening history, your queue, your downloaded
                        episodes and your playback speed setting.
                    </li>
                </ul>
                <p>
                    We do not collect your name, address, phone number, payment details, contacts,
                    location or any advertising identifier. QuietCasts&trade; contains no ads and no
                    third-party tracking scripts.
                </p>
            </section>

            <section className="legal-section">
                <h2>Why we collect it</h2>
                <p>
                    Sole to make the product work: to show you your own library, to remember where you
                    stopped listening, and to keep that in step across the devices you sign in on.
                    Nothing is used for advertising, profiling or automated decision-making.
                </p>
            </section>

            <section className="legal-section">
                <h2>Where your data lives</h2>
                <ul>
                    <li>
                        <strong>Your device.</strong> If you browse as a guest, your subscriptions,
                        progress, history, queue, downloads and theme are stored only in your browser and
                        never leave it. Clearing your browser data erases them permanently, and we have no
                        copy to restore.
                    </li>
                    <li>
                        <strong>Our servers.</strong> If you sign in, the listening data listed above is
                        stored under your account so it can follow you between devices.
                    </li>
                </ul>
                <p>
                    Account sign-in and server storage are provided by Google Firebase. Your data is
                    held in the region our Firebase project is configured for.
                </p>
            </section>

            <section className="legal-section">
                <h2>Third parties we talk to</h2>
                <p>We contact these services only to deliver a feature, and we do not send them anything about you.</p>
                <ul>
                    <li>
                        <strong>Apple.</strong> The podcast directory search and the &ldquo;Top Podcasts
                        chart&rdquo; query Apple's public iTunes and RSS feeds. These searches do not
                        include your account information.
                    </li>
                    <li>
                        <strong>Podcast publishers.</strong> When you subscribe to a show, its RSS feed is
                        requested through a small proxy on our server, because most publishers do not
                        allow browsers to read their feeds directly. The proxy fetches only the feed URL
                        you chose and never forwards your account information.
                    </li>
                    <li>
                        <strong>Google.</strong> Sign-in, and the two web fonts used to draw the interface.
                        Font requests reveal your IP address and browser to Google.
                    </li>
                    <li>
                        <strong>Podcast artwork.</strong> Cover images are loaded from Apple and from
                        wherever a publisher hosts them, so those hosts see your IP address.
                    </li>
                </ul>
            </section>

            <section className="legal-section">
                <h2>Cookies and local storage</h2>
                <p>
                    QuietCasts&trade; sets no cookies. It does use your browser's local and session
                    storage to remember your subscriptions, progress, theme and recent searches. You can
                    erase these at any time through your browser settings, which also signs you out locally
                    and returns guest browsing to a clean state.
                </p>
            </section>

            <section className="legal-section">
                <h2>Your rights</h2>
                <p>
                    You can view, export or delete your data at any time. Deleting your account removes
                    your stored subscriptions, progress, history, queue and downloads. Because guest data
                    never reaches us, we can only act on data belonging to a signed-in account &mdash;
                    contact us at <a href="https://rynabiz.com" target="_blank" rel="noopener noreferrer">rynabiz.com</a>
                    and we will action the request.
                </p>
                <p>
                    If you are in the EEA, the UK or Switzerland, you also have the rights to object to
                    processing, request a portable copy, and complain to your data protection authority.
                </p>
            </section>

            <section className="legal-section">
                <h2>Children</h2>
                <p>
                    QuietCasts&trade; is not directed at children under 13, and we do not knowingly
                    collect their personal information.
                </p>
            </section>

            <section className="legal-section">
                <h2>Changes to this policy</h2>
                <p>
                    If we change how we handle your data we will update this page and revise the date at
                    the top. Material changes affecting signed-in users will be announced in the app
                    before they take effect.
                </p>
            </section>

            <section className="legal-section">
                <h2>Trademarks</h2>
                <p>
                    QuietCasts&trade;, RYNA&trade;, the QuietCasts mark and the RYNA mark are trademarks
                    of RYNA&trade;. Podcast names, artwork and audio belong to their respective owners and
                    are used here to identify the content they belong to. Their appearance does not imply
                    any endorsement or affiliation.
                </p>
            </section>

            <section className="legal-section">
                <h2>Contact</h2>
                <p>
                    Questions about this policy, or a request concerning your data, go to RYNA&trade; at{' '}
                    <a href="https://rynabiz.com" target="_blank" rel="noopener noreferrer">rynabiz.com</a>.
                </p>
                <p className="legal-note">
                    You can also <button className="text-button" onClick={() => onNavigate('/')}>browse the {CATEGORIES.length} categories</button> without signing in at all.
                </p>
            </section>
        </div>
    )
}
