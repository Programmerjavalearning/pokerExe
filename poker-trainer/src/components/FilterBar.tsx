interface Props {
  showOnlyPlayable: boolean;
  onTogglePlayable: (v: boolean) => void;
}

export function FilterBar({ showOnlyPlayable, onTogglePlayable }: Props) {
  return (
    <div className="filter-bar">
      <label className="filter-toggle">
        <input
          type="checkbox"
          checked={showOnlyPlayable}
          onChange={(e) => onTogglePlayable(e.target.checked)}
        />
        <span>Playable only</span>
      </label>
    </div>
  );
}
