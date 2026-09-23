export function ProgressBar({ value, max, onChange, label = 'Playback progress' }: { value: number; max: number; onChange: (value: number) => void; label?: string }) {
    return <input className="progress-range" type="range" min="0" max={Math.max(max, 1)} step="1" value={Math.min(value, Math.max(max, 1))} onChange={(event) => onChange(Number(event.target.value))} aria-label={label} />
}
