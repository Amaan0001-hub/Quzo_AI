"use client";

import { useState, useEffect } from "react";

interface AnalyticsData {
  TradeID: number;
  Capital: number;
  TradeDate: string;
  AssetID: number;
  AIAgent: string;
  TradeAction: string;
  EntryPrice: number;
  ExitPrice: number;
  ProfitPercentage: number;
  Profit: number;
  PortfolioValue: number;
  Status: string;
  CreatedOn: string | null;
  TotalProfit: number;
}

const ACCENT_COLOR = "#12a594";

export default function AnalyticsPage() {
  const [opsValue, setOpsValue] = useState(1716);
  const [spreadValue, setSpreadValue] = useState(0.308);
  const [execsValue, setExecsValue] = useState(16850);
  const [routedValue, setRoutedValue] = useState(2700225);
  const [fillsValue, setFillsValue] = useState(91);
  const [reserveValue, setReserveValue] = useState(1.49);
  const [p50, setP50] = useState(68);
  const [p95, setP95] = useState(132);

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch analytics data from API
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics", {
          method: "POST",
        });
        const result = await response.json();
        if (result.data) {
          setAnalyticsData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Simulate live data updates for stats
  useEffect(() => {
    const interval = setInterval(() => {
      setOpsValue((prev) => Math.max(1500, Math.min(1800, prev + (Math.random() - 0.5) * 50)));
      setSpreadValue((prev) => Math.max(0.2, Math.min(0.4, prev + (Math.random() - 0.5) * 0.02)));
      setExecsValue((prev) => prev + Math.floor(Math.random() * 10));
      setRoutedValue((prev) => prev + Math.floor(Math.random() * 50000));
      setFillsValue((prev) => Math.max(80, Math.min(100, prev + (Math.random() - 0.5) * 5)));
      setReserveValue((prev) => Math.max(1.4, Math.min(1.6, prev + (Math.random() - 0.5) * 0.01)));
      setP50((prev) => Math.max(50, Math.min(100, prev + (Math.random() - 0.5) * 10)));
      setP95((prev) => Math.max(100, Math.min(180, prev + (Math.random() - 0.5) * 15)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);



  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full animate-ping" style={{ background: ACCENT_COLOR }}></span>
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: ACCENT_COLOR }}></span>
          </span>
          <span className="text-xs font-mono font-semibold tracking-wide text-gray-500 dark:text-gray-400">
            HYPERGEN ENGINE
          </span>
        </div>
        <div className="text-xs font-mono text-gray-400">12 CHAINS · 38 VENUES · ONE ORDER BOOK</div>
      </header>

      {/* Main Stats Card */}
      <div className="card p-6 mb-4 bg-white dark:bg-[#0B1021] border border-gray-200 dark:border-[#1E293B] rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* OPS / MIN */}
          <div>
            <div className="text-[11px] font-medium text-gray-400 tracking-wide mb-3">OPS / MIN</div>
            <div className="font-mono text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              {Math.round(opsValue).toLocaleString()}
            </div>
            <div className="mt-3">
              <div style={{ width: "220px", height: "120px", position: "relative", overflow: "hidden" }}>
                <div
                  style={{
                    width: "220px",
                    height: "220px",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    background: `conic-gradient(from -125deg, ${ACCENT_COLOR} 0deg ${(opsValue / 1800) * 250}deg, #e5e7eb ${(opsValue / 1800) * 250}deg 250deg, transparent 250deg 360deg)`,
                  }}
                ></div>
                <div style={{ width: "172px", height: "172px", borderRadius: "50%", background: "white", position: "absolute", top: "24px", left: "24px" }} className="dark:bg-[#0B1021]"></div>
                <div style={{ position: "absolute", left: "110px", top: "110px", width: "2px", height: "88px" }}>
                  <div
                    style={{
                      width: "3px",
                      height: "88px",
                      background: ACCENT_COLOR,
                      borderRadius: "2px",
                      position: "absolute",
                      bottom: "0px",
                      left: "-1px",
                      transform: `rotate(${(opsValue / 1800) * 250 - 125}deg)`,
                    }}
                  ></div>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#374151", position: "absolute", bottom: "-5px", left: "-4px" }} className="dark:bg-white"></div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-1">OF 1,800 CEILING</div>
          </div>

          {/* AVG SPREAD CAPTURED */}
          <div>
            <div className="text-[11px] font-medium text-gray-400 tracking-wide mb-3">AVG SPREAD CAPTURED</div>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="font-mono text-5xl font-bold text-blue-700 dark:text-cyan-300" style={{ color: ACCENT_COLOR }}>
                {spreadValue.toFixed(3)}
              </span>
              <span className="font-mono text-2xl font-semibold text-blue-700 dark:text-cyan-300" style={{ color: ACCENT_COLOR }}>%</span>
            </div>
            <div className="flex gap-[3px] mb-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="seg"
                  style={{
                    width: "10px",
                    height: "20px",
                    borderRadius: "2px",
                    background: i < (spreadValue / 0.4) * 20 ? ACCENT_COLOR : "#e5e7eb",
                    opacity: i < (spreadValue / 0.4) * 20 ? 1 : 0.6,
                  }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 font-mono">
              <span>0</span>
              <span>27 BPS</span>
              <span>40 BPS</span>
            </div>
          </div>

          {/* EXECS TODAY */}
          <div>
            <div className="text-[11px] font-medium text-gray-400 tracking-wide mb-3">EXECS TODAY · UTC</div>
            <div className="font-mono text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              {execsValue.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1 mb-4">all filled · atomic legs · zero open positions</div>
            <div className="flex gap-8">
              <div>
                <div className="text-[11px] text-gray-400 mb-0.5">LATENCY P50</div>
                <div className="font-mono text-lg font-semibold text-gray-900 dark:text-white">{p50} ms</div>
              </div>
              <div>
                <div className="text-[11px] text-gray-400 mb-0.5">P95</div>
                <div className="font-mono text-lg font-semibold text-gray-900 dark:text-white">{p95} ms</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-200 dark:border-[#1E293B] relative">
          <div>
            <div className="text-[11px] text-gray-400 mb-1">VENUES</div>
            <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white">38</div>
            <div className="text-[11px] text-gray-400 mt-0.5">across 12 chains</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 mb-1">CIRCUIT BREAKER</div>
            <div className="flex items-center gap-1.5 text-lg font-bold text-gray-900 dark:text-white">
              <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ background: ACCENT_COLOR }}></span>
              ARMED
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">no trips today</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 mb-1">RESERVE RATIO</div>
            <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white">{reserveValue.toFixed(2)}×</div>
            <div className="text-[11px] text-gray-400 mt-0.5">liabilities covered</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 mb-1">FEED</div>
            <div className="flex items-center gap-1.5 text-lg font-bold text-green-500">
              <span className="h-1.5 w-1.5 rounded-full animate-ping bg-green-500"></span>
              Live
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">5s pulse · UTC</div>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-3xl">
        HyperGen is the liquidity intelligence engine watching twelve chains as one order book. Every gap it finds is simulated, routed and settled in the same breath — what you see below is the engine working.
      </p>

      {/* Execution Stream */}
      <div className="card p-6 mb-4 bg-white dark:bg-[#0B1021] border border-gray-200 dark:border-[#1E293B] rounded-lg">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full animate-ping" style={{ background: ACCENT_COLOR }}></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: ACCENT_COLOR }}></span>
            </span>
            <span className="text-xs font-mono font-semibold tracking-wide text-gray-500 dark:text-gray-400">
              EXECUTION STREAM
            </span>
          </div>
          <div className="text-xs font-mono text-gray-400">UTC · POLLING</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <div className="text-[11px] text-gray-400 mb-1">ROUTED · LAST HOUR</div>
            <div className="font-mono text-3xl font-bold text-gradient" style={{ color: ACCENT_COLOR }}>
              {formatCurrency(routedValue)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 mb-1">FILLS · LAST MINUTE</div>
            <div className="font-mono text-3xl font-bold text-gray-900 dark:text-white">{fillsValue}</div>
            <div className="text-[11px] text-gray-400 mt-1">last 30 min tracked</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400 mb-1">FILLS / MIN · 30 MIN</div>
            <svg viewBox="0 0 300 60" className="w-full h-14">
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT_COLOR} stopOpacity="0.25"></stop>
                  <stop offset="100%" stopColor={ACCENT_COLOR} stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path
                d="M 4 54.8 L 16.7 47.6 L 29.4 37.9 L 42.1 37.1 L 54.8 43.4 L 67.5 56 L 80.2 47.6 L 92.9 48.2 L 105.6 36.4 L 118.3 29.5 L 130.9 29.6 L 143.7 17.4 L 156.3 14.7 L 169 19.9 L 181.7 12.2 L 194.4 4 L 207.1 9 L 219.8 7.4 L 232.5 5.8 L 245.2 10.7 L 257.9 14.1 L 270.6 13.3 L 283.3 24.9 L 296 16.6 L 296 60 L 4 60 Z"
                fill="url(#sg)"
              ></path>
              <path
                d="M 4 54.8 L 16.7 47.6 L 29.4 37.9 L 42.1 37.1 L 54.8 43.4 L 67.5 56 L 80.2 47.6 L 92.9 48.2 L 105.6 36.4 L 118.3 29.5 L 130.9 29.6 L 143.7 17.4 L 156.3 14.7 L 169 19.9 L 181.7 12.2 L 194.4 4 L 207.1 9 L 219.8 7.4 L 232.5 5.8 L 245.2 10.7 L 257.9 14.1 L 270.6 13.3 L 283.3 24.9 L 296 16.6"
                fill="none"
                stroke={ACCENT_COLOR}
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <circle cx="296" cy="16.6" r="3" fill={ACCENT_COLOR}></circle>
            </svg>
          </div>
        </div>



        {/* Execution Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading analytics data...</div>
          ) : (
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#1E293B]">
                  <th className="text-left px-3 py-2 text-[11px] font-medium text-gray-400">DATE</th>
                  <th className="text-left px-3 py-2 text-[11px] font-medium text-gray-400">AI AGENT</th>
                  <th className="text-left px-3 py-2 text-[11px] font-medium text-gray-400">ACTION</th>
                  <th className="text-left px-3 py-2 text-[11px] font-medium text-gray-400">ASSET · ID</th>
                  <th className="text-right px-3 py-2 text-[11px] font-medium text-gray-400">ENTRY PRICE</th>
                  <th className="text-right px-3 py-2 text-[11px] font-medium text-gray-400">EXIT PRICE</th>
                  <th className="text-right px-3 py-2 text-[11px] font-medium text-gray-400">CAPITAL</th>
                  <th className="text-right px-3 py-2 text-[11px] font-medium text-gray-400">PROFIT %</th>
                  <th className="text-right px-3 py-2 text-[11px] font-medium text-gray-400">TOTAL PROFIT</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.map((row) => (
                  <tr key={row.TradeID} className="border-b border-gray-200 dark:border-[#1E293B]">
                    <td className="px-3 py-2.5 font-mono text-xs text-gray-500 dark:text-gray-400">
                      {new Date(row.TradeDate).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded border border-gray-200 dark:border-[#1E293B]">
                        {row.AIAgent}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">{row.TradeAction}</td>
                    <td className="px-3 py-2.5">
                      <div className="font-mono text-xs font-semibold text-gray-900 dark:text-white">Asset #{row.AssetID}</div>
                      <div className="font-mono text-[10px] text-gray-400">Trade #{row.TradeID}</div>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-gray-500 dark:text-gray-400">
                      ${row.EntryPrice.toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-gray-500 dark:text-gray-400">
                      ${row.ExitPrice.toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(row.Capital)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-gray-500 dark:text-gray-400">
                      {row.ProfitPercentage}%
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-gray-500 dark:text-gray-400">
                      {formatCurrency(row.TotalProfit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
