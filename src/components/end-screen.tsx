import { SECTIONS } from '@/game/balance';

type Props = { cleared: boolean; section: number; onRetry: () => void };

export function EndScreen({ cleared, section, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-3xl font-black">{cleared ? 'Cleared' : 'Defeated'}</h2>
      {!cleared && (
        <p className="text-muted tabular-nums">
          Section {section + 1}/{SECTIONS}
        </p>
      )}
      <button
        type="button"
        onClick={onRetry}
        className="cursor-pointer rounded-2xl bg-accent px-6 py-3 font-bold text-fg"
      >
        Try again
      </button>
    </div>
  );
}
