/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BarChart2,
  Sliders,
  PlaySquare,
  Calendar,
  Maximize2,
  Minimize2,
  Key,
  Save,
  RotateCcw,
  Search,
  Check,
  ChevronDown,
  Code,
} from 'lucide-react';
import { ChartType, SymbolMeta, Timeframe } from '../types/chart';
import { SUPPORTED_SYMBOLS, TIMEFRAMES } from '../data/marketData';

interface TopToolbarProps {
  currentSymbol: string;
  currentTimeframe: Timeframe;
  currentChartType: ChartType;
  onSelectSymbol: (symbol: string) => void;
  onSelectTimeframe: (tf: Timeframe) => void;
  onSelectChartType: (type: ChartType) => void;
  onOpenIndicators: () => void;
  onOpenPineEditor?: () => void;
  onOpenReplay: () => void;
  onOpenGoToDate: () => void;
  onOpenSettings: () => void;
  onOpenApiKey: () => void;
  onSaveLayout: () => void;
  onResetLayout: () => void;
  isReplayActive: boolean;
  isSelectingReplayPoint?: boolean;
  statusText: string;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  currentSymbol,
  currentTimeframe,
  currentChartType,
  onSelectSymbol,
  onSelectTimeframe,
  onSelectChartType,
  onOpenIndicators,
  onOpenPineEditor,
  onOpenReplay,
  onOpenGoToDate,
  onOpenApiKey,
  onSaveLayout,
  isReplayActive,
  isSelectingReplayPoint = false,
  statusText,
}) => {
  const [showSymbolSearch, setShowSymbolSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [symbolCategory, setSymbolCategory] = useState<'all' | 'crypto' | 'forex' | 'metal'>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const filteredSymbols = SUPPORTED_SYMBOLS.filter((s) => {
    const matchesCat = symbolCategory === 'all' || s.category === symbolCategory;
    const matchesQuery =
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameAr.includes(searchQuery);
    return matchesCat && matchesQuery;
  });

  const selectedMeta = SUPPORTED_SYMBOLS.find((s) => s.symbol === currentSymbol) || {
    symbol: currentSymbol,
    nameAr: currentSymbol,
  };

  return (
    <header className="flex items-center justify-between px-3 py-1.5 bg-[#18202a] border-b border-[#2a3542] text-xs text-[#d5dde6] select-none z-30">
      {/* Left controls: Symbol, Timeframes, Chart Type */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
        {/* Symbol Button & Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#222d3a] hover:bg-[#2c3a4a] border border-[#2a3542] font-semibold text-white transition-colors"
            onClick={() => setShowSymbolSearch(!showSymbolSearch)}
          >
            <span className="text-[#f0b429]">{selectedMeta.symbol}</span>
            <span className="text-[#7d8b9a] text-[11px] font-normal hidden sm:inline">
              ({selectedMeta.nameAr})
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7d8b9a]" />
          </button>

          {/* Symbol Search Modal / Popover */}
          {showSymbolSearch && (
            <div className="absolute top-full left-0 mt-1 w-80 bg-[#18202a] border border-[#2a3542] rounded-lg shadow-2xl p-3 z-50">
              <div className="relative mb-2">
                <Search className="w-4 h-4 text-[#7d8b9a] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="ابحث عن رمز مالي أو عملة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#10151c] border border-[#2a3542] rounded pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#f0b429]"
                  autoFocus
                />
              </div>

              {/* Categories */}
              <div className="flex gap-1 mb-2 pb-1 border-b border-[#2a3542]">
                {(['all', 'crypto', 'metal', 'forex'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`px-2 py-0.5 rounded text-[11px] capitalize ${
                      symbolCategory === cat
                        ? 'bg-[#f0b429] text-[#10151c] font-bold'
                        : 'text-[#7d8b9a] hover:text-white'
                    }`}
                    onClick={() => setSymbolCategory(cat)}
                  >
                    {cat === 'all'
                      ? 'الكل'
                      : cat === 'crypto'
                      ? 'كريبتو'
                      : cat === 'metal'
                      ? 'معادن وذهب'
                      : 'فوركس'}
                  </button>
                ))}
              </div>

              {/* Symbol List */}
              <div className="max-h-60 overflow-y-auto space-y-1">
                {filteredSymbols.map((item) => (
                  <button
                    key={item.symbol}
                    type="button"
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${
                      item.symbol === currentSymbol ? 'bg-[#2a3542] text-white' : 'hover:bg-[#222d3a]'
                    }`}
                    onClick={() => {
                      onSelectSymbol(item.symbol);
                      setShowSymbolSearch(false);
                    }}
                  >
                    <div>
                      <div className="font-semibold text-white">{item.symbol}</div>
                      <div className="text-[11px] text-[#7d8b9a]">{item.nameAr}</div>
                    </div>
                    {item.symbol === currentSymbol && (
                      <Check className="w-4 h-4 text-[#26a69a]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timeframes Quick Pills */}
        <div className="flex items-center gap-0.5 bg-[#10151c] p-0.5 rounded border border-[#2a3542]">
          {(['1m', '5m', '15m', '1h', '4h', '1D'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              type="button"
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentTimeframe === tf
                  ? 'bg-[#f0b429] text-[#10151c] font-bold shadow-xs'
                  : 'text-[#7d8b9a] hover:text-white'
              }`}
              onClick={() => onSelectTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
          {/* Extended Timeframe Select */}
          <select
            value={currentTimeframe}
            onChange={(e) => onSelectTimeframe(e.target.value as Timeframe)}
            className="bg-transparent text-[11px] text-[#7d8b9a] hover:text-white focus:outline-none cursor-pointer pl-1"
          >
            {TIMEFRAMES.map((t) => (
              <option key={t.tf} value={t.tf} className="bg-[#18202a] text-white">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="h-4 w-[1px] bg-[#2a3542] mx-1" />

        {/* Chart Type Selector */}
        <div className="flex items-center gap-1">
          <select
            value={currentChartType}
            onChange={(e) => onSelectChartType(e.target.value as ChartType)}
            className="bg-[#222d3a] hover:bg-[#2c3a4a] text-white border border-[#2a3542] rounded px-2 py-1 text-xs focus:outline-none cursor-pointer"
          >
            <option value="candles">🕯 شموع يابانية (Candles)</option>
            <option value="bars">📊 بارات OHLC</option>
            <option value="line">📈 خطي (Line)</option>
            <option value="area">🌊 مساحة (Area)</option>
            <option value="heikinAshi">🎋 هايكن آشي (Heikin Ashi)</option>
            <option value="renko">🧱 رينكو (Renko Bricks)</option>
            <option value="kagi">🎋 كاجي (Kagi)</option>
            <option value="pointAndFigure">✖️ نقطة وشكل (P&F)</option>
            <option value="footprint">🦶 فوت برينت وسيارات السيولة (Footprint)</option>
          </select>
        </div>

        <div className="h-4 w-[1px] bg-[#2a3542] mx-1" />

        {/* Indicators Dialog Trigger */}
        <button
          type="button"
          onClick={onOpenIndicators}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#222d3a] hover:bg-[#2c3a4a] border border-[#2a3542] text-white font-medium transition-colors"
          title="مكتبة المؤشرات الفنية"
        >
          <BarChart2 className="w-3.5 h-3.5 text-[#4aa3ff]" />
          <span>المؤشرات (Indicators)</span>
        </button>

        {/* Pine Script Editor Trigger */}
        {onOpenPineEditor && (
          <button
            type="button"
            onClick={onOpenPineEditor}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#222d3a] hover:bg-[#2c3a4a] border border-[#2a3542] text-white font-medium transition-colors"
            title="محرر باين سكريبت والمؤشرات المخصصة (Pine Script Editor v5/v6)"
          >
            <Code className="w-3.5 h-3.5 text-[#f0b429]" />
            <span>Pine Script</span>
          </button>
        )}

        {/* Historical Bar Replay Trigger */}
        <button
          type="button"
          onClick={onOpenReplay}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
            isSelectingReplayPoint
              ? 'bg-[#2962ff] text-white font-bold border-[#2962ff] ring-2 ring-[#2962ff]/50 animate-pulse'
              : isReplayActive
              ? 'bg-[#f0b429] text-[#10151c] font-bold border-[#f0b429]'
              : 'bg-[#222d3a] hover:bg-[#2c3a4a] text-white border-[#2a3542]'
          }`}
          title={
            isSelectingReplayPoint
              ? 'انقر هنا لإلغاء وضع تحديد الشمعة'
              : 'محاكي إعادة تشغيل السوق التاريخي (GoCharting Bar Replay)'
          }
        >
          <PlaySquare className={`w-3.5 h-3.5 ${isSelectingReplayPoint ? 'text-white' : 'text-[#ff9f43]'}`} />
          <span>
            {isSelectingReplayPoint ? 'حدد شمعة...' : 'إعادة التشغيل (Replay)'}
          </span>
        </button>

        {/* Go To Date */}
        <button
          type="button"
          onClick={onOpenGoToDate}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#222d3a] hover:bg-[#2c3a4a] border border-[#2a3542] text-[#d5dde6] hover:text-white transition-colors"
          title="الانتقال إلى تاريخ ووقت محدد"
        >
          <Calendar className="w-3.5 h-3.5 text-[#26a69a]" />
          <span className="hidden md:inline">انتقال لتاريخ</span>
        </button>
      </div>

      {/* Right controls: Status, API Key, Save Layout, Fullscreen */}
      <div className="flex items-center gap-2">
        {/* Status Badge */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#10151c] border border-[#2a3542]">
          <span className="text-[#26a69a] font-medium">{statusText}</span>
        </div>

        {/* API Key Modal Button */}
        <button
          type="button"
          onClick={onOpenApiKey}
          className="p-1.5 rounded bg-[#222d3a] hover:bg-[#2c3a4a] text-[#f0b429] border border-[#2a3542] transition-colors"
          title="إعداد مفتاح Twelve Data API للذهب والفوركس"
        >
          <Key className="w-3.5 h-3.5" />
        </button>

        {/* Save Layout */}
        <button
          type="button"
          onClick={onSaveLayout}
          className="p-1.5 rounded bg-[#222d3a] hover:bg-[#2c3a4a] text-[#4aa3ff] border border-[#2a3542] transition-colors"
          title="حفظ تخطيط الشارت والمؤشرات"
        >
          <Save className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-1.5 rounded bg-[#222d3a] hover:bg-[#2c3a4a] text-[#d5dde6] border border-[#2a3542] transition-colors"
          title="شاشة كاملة"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
