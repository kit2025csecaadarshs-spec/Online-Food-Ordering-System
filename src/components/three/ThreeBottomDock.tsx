import React from 'react';
import { RotateCw, Sun, Flame, Sparkles, ChevronDown, ChevronUp, Layers, RefreshCw } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface ThreeBottomDockProps {
  explodeProgress: number;
  onExplodeChange: (val: number) => void;
  lightingPreset: 'daylight' | 'studio' | 'sunset';
  onLightingChange: (preset: 'daylight' | 'studio' | 'sunset') => void;
  isAutoRotating: boolean;
  onToggleAutoRotate: () => void;
  onResetView: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const ThreeBottomDock: React.FC<ThreeBottomDockProps> = ({
  explodeProgress,
  onExplodeChange,
  lightingPreset,
  onLightingChange,
  isAutoRotating,
  onToggleAutoRotate,
  onResetView,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-auto max-w-[92vw] w-auto">
      {/* Collapse / Expand Toggle Button */}
      <button
        onClick={() => {
          soundFx.playClick();
          onToggleCollapse();
        }}
        className="flex items-center gap-1.5 px-3 py-1 bg-white/95 border border-stone-200/80 rounded-t-lg shadow-xs text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors mb-[-1px]"
        title={isCollapsed ? 'Show 3D Controls' : 'Hide 3D Controls'}
      >
        {isCollapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Show 3D Controls</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5" />
            <span>Zen Mode</span>
          </>
        )}
      </button>

      {/* Main Unified Control Dock */}
      {!isCollapsed && (
        <div className="bg-white/95 border border-stone-200/90 rounded-2xl shadow-lg p-3 sm:p-3.5 flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 backdrop-blur-xs transition-all">
          {/* Explode Ingredients Slider */}
          <div className="flex items-center gap-2.5 min-w-[190px]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 whitespace-nowrap">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Explode</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(explodeProgress * 100)}
              onChange={(e) => onExplodeChange(parseFloat(e.target.value) / 100)}
              className="w-28 sm:w-32 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              title="Drag to inspect individual food layers"
            />
            <span className="text-[11px] font-mono text-stone-500 w-8 text-right tabular-nums">
              {Math.round(explodeProgress * 100)}%
            </span>
          </div>

          <div className="hidden sm:block h-6 w-[1px] bg-stone-200" />

          {/* Lighting Presets */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mr-1 hidden md:inline">
              Light:
            </span>
            <button
              onClick={() => {
                soundFx.playClick();
                onLightingChange('daylight');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap ${
                lightingPreset === 'daylight'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-stone-600 hover:bg-stone-100 border border-transparent'
              }`}
              title="Warm Daylight"
            >
              <Sun className="w-3 h-3 text-amber-600" />
              <span>Daylight</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                onLightingChange('studio');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap ${
                lightingPreset === 'studio'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-stone-600 hover:bg-stone-100 border border-transparent'
              }`}
              title="Chef's Studio High-CRI"
            >
              <Sparkles className="w-3 h-3 text-stone-700" />
              <span>Studio</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                onLightingChange('sunset');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap ${
                lightingPreset === 'sunset'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-stone-600 hover:bg-stone-100 border border-transparent'
              }`}
              title="Golden Hour Sunset"
            >
              <Flame className="w-3 h-3 text-orange-600" />
              <span>Sunset</span>
            </button>
          </div>

          <div className="hidden sm:block h-6 w-[1px] bg-stone-200" />

          {/* Action Buttons: Auto-Rotate & Reset */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundFx.playClick();
                onToggleAutoRotate();
              }}
              className={`p-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 ${
                isAutoRotating
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'text-stone-700 hover:bg-stone-100 border-stone-200'
              }`}
              title={isAutoRotating ? 'Pause Rotation' : 'Auto Rotate 360°'}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              <span className="hidden md:inline">{isAutoRotating ? 'Rotating' : 'Spin'}</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                onResetView();
              }}
              className="p-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-medium transition-colors flex items-center gap-1"
              title="Reset 3D Camera View"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
