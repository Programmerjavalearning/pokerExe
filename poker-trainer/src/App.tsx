import { useRange } from './hooks/useRange';
import { CategorySelector } from './components/CategorySelector';
import { PresetSelector } from './components/PresetSelector';
import { HandMatrix } from './components/HandMatrix';
import { HandDetails } from './components/HandDetails';
import { Legend } from './components/Legend';
import { FilterBar } from './components/FilterBar';
import { getHandAction } from './utils/rangeLoader';
import { CATEGORY_CONFIG } from './config/spots';
import './App.css';

function App() {
  const {
    loading,
    category,
    setCategory,
    preset,
    setPreset,
    selectedHand,
    selectHand,
    showOnlyPlayable,
    setShowOnlyPlayable,
    viewMode,
    setViewMode,
    displayRange,
    dirty,
    setHandAction,
    saveChanges,
    resetPreset,
    resetAllToDefault,
  } = useRange();

  const selectedEntry = selectedHand ? getHandAction(displayRange, selectedHand) : null;
  const categoryConfig = CATEGORY_CONFIG.find((c) => c.category === category);
  const presetLabel = categoryConfig?.presets.find((p) => p.id === preset)?.label ?? preset;

  if (loading) {
    return (
      <div className="app-loading">
        <span>♠</span>
        <p>Loading ranges…</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__icon">♠</span>
          <h1 className="app-header__title">Poker Trainer</h1>
          <span className="app-header__subtitle">
            {categoryConfig?.label} · {presetLabel}
          </span>
        </div>

        <div className="mode-toggle">
          <button
            className={`mode-btn ${viewMode === 'view' ? 'mode-btn--active' : ''}`}
            onClick={() => setViewMode('view')}
          >
            View
          </button>
          <button
            className={`mode-btn ${viewMode === 'edit' ? 'mode-btn--active' : ''}`}
            onClick={() => setViewMode('edit')}
          >
            Edit
          </button>
        </div>
      </header>

      <main className="app-main">
        {/* ── Sidebar ──────────────────────────────────────── */}
        <aside className="app-sidebar">
          <CategorySelector value={category} onChange={setCategory} />
          <PresetSelector category={category} value={preset} onChange={setPreset} />

          {viewMode === 'edit' && (
            <div className="edit-controls">
              <button
                className={`edit-save-btn ${dirty ? 'edit-save-btn--dirty' : ''}`}
                onClick={() => void saveChanges()}
                disabled={!dirty}
              >
                {dirty ? '💾 Save changes' : '✓ Saved'}
              </button>
              <div className="edit-control-row">
                <button
                  className="edit-reset-btn"
                  onClick={resetPreset}
                  disabled={!dirty}
                  title="Discard edits to this preset"
                >
                  Reset preset
                </button>
                <button
                  className="edit-reset-all-btn"
                  onClick={() => void resetAllToDefault()}
                  title="Restore all ranges to bundled defaults"
                >
                  Reset all
                </button>
              </div>
              {dirty && (
                <span className="edit-dirty-indicator">● Unsaved changes</span>
              )}
            </div>
          )}

          <Legend category={category} />
          <FilterBar
            showOnlyPlayable={showOnlyPlayable}
            onTogglePlayable={setShowOnlyPlayable}
          />
          <HandDetails
            hand={selectedHand}
            entry={selectedEntry}
            editMode={viewMode === 'edit'}
            category={category}
            onSetAction={setHandAction}
          />
        </aside>

        {/* ── Main content ─────────────────────────────────── */}
        <section className="app-content">
          <HandMatrix
            range={displayRange}
            selectedHand={selectedHand}
            showOnlyPlayable={showOnlyPlayable}
            onSelectHand={selectHand}
          />
        </section>
      </main>
    </div>
  );
}

export default App;

