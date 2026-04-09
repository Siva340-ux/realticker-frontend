import { useEffect, useState } from "react";
import api from "./services/api";
import StockChart from "./components/StockChart";

function App() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTopStocks();
  }, []);

  const fetchTopStocks = async () => {
    try {
      setLoadingStocks(true);
      const response = await api.get("/stocks/top10");
      setStocks(response.data.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch top stocks");
    } finally {
      setLoadingStocks(false);
    }
  };

  const handleSelectStock = async (stock) => {
    setSelectedStock(stock);
    setAnalysis(null);

    try {
      setLoadingHistory(true);
      const response = await api.get(`/stocks/${stock.ticker}/history`);
      setHistory(response.data.data.history);
      setError("");
    } catch (err) {
      setError("Failed to fetch stock history");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAnalyzeStock = async () => {
    if (!selectedStock) return;

    try {
      setLoadingAnalysis(true);
      const response = await api.post(`/stocks/${selectedStock.ticker}/analyze`, {});
      setAnalysis(response.data.data.analysis);
      setError("");
    } catch (err) {
      setError("Failed to analyze stock");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="border-b border-slate-800/50 bg-slate-900/60 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-4xl font-bold text-transparent">
            RealTicker
          </h1>
          <p className="mt-2 text-slate-300">
            AI-Powered Stock Insights Platform
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {error && (
          <div className="mb-8 flex items-center justify-between rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-200">
            <span>{error}</span>
            <button
              onClick={fetchTopStocks}
              className="rounded-lg bg-red-500/40 px-4 py-2 text-sm font-medium transition hover:bg-red-500/60"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left section */}
          <section className="rounded-3xl border border-slate-800/50 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cyan-400">Top 10 Stocks</h2>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
                Mock Market Data
              </span>
            </div>

            {loadingStocks ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
                <span className="ml-3 text-slate-400">Loading stocks...</span>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800/50">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-950/40">
                    <tr className="border-b border-slate-800/50 text-left text-slate-300">
                      <th className="px-4 py-4 font-semibold">Ticker</th>
                      <th className="px-4 py-4 font-semibold">Company</th>
                      <th className="px-4 py-4 font-semibold">Price</th>
                      <th className="px-4 py-4 font-semibold">Change %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((stock) => (
                      <tr
                        key={stock.ticker}
                        onClick={() => handleSelectStock(stock)}
                        className={`cursor-pointer border-b border-slate-800/30 transition-all duration-200 hover:bg-slate-800/60 ${
                          selectedStock?.ticker === stock.ticker
                            ? "bg-cyan-500/10"
                            : ""
                        }`}
                      >
                        <td className="px-4 py-4 font-bold text-cyan-400">
                          {stock.ticker}
                        </td>
                        <td className="px-4 py-4 text-slate-200">
                          {stock.companyName}
                        </td>
                        <td className="px-4 py-4 font-mono text-slate-100">
                          ${stock.currentPrice.toFixed(2)}
                        </td>
                        <td
                          className={`px-4 py-4 font-mono font-semibold ${
                            stock.dailyChangePercent >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {stock.dailyChangePercent >= 0 ? "+" : ""}
                          {stock.dailyChangePercent.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Right section */}
          <section className="space-y-6">
            {!selectedStock ? (
              <div className="rounded-3xl border-2 border-dashed border-slate-800/50 bg-slate-900/30 p-12 text-center backdrop-blur-xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-2xl">
                  📈
                </div>
                <h3 className="mt-4 text-2xl font-bold text-slate-300">
                  Select a Stock
                </h3>
                <p className="mt-2 text-slate-500">
                  Click any stock from the list to view details and AI analysis.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-3xl border border-slate-800/50 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-xl">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      {selectedStock.companyName}
                    </h2>
                    <p className="mt-1 text-cyan-400">{selectedStock.ticker}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800/50 bg-slate-950/50 p-5">
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Current Price
                      </p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        ${selectedStock.currentPrice.toFixed(2)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800/50 bg-slate-950/50 p-5">
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Daily Change
                      </p>
                      <p
                        className={`mt-2 text-2xl font-bold ${
                          selectedStock.dailyChangePercent >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {selectedStock.dailyChangePercent >= 0 ? "+" : ""}
                        {selectedStock.dailyChangePercent.toFixed(1)}%
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800/50 bg-slate-950/50 p-5">
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Volume
                      </p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        {selectedStock.volume.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleAnalyzeStock}
                      disabled={loadingAnalysis}
                      className="rounded-2xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loadingAnalysis ? "Analyzing..." : "Analyze with AI"}
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800/50 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-xl">
                  <h3 className="mb-4 text-xl font-bold text-white">
                    6-Month Price Trend
                  </h3>

                  {loadingHistory ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
                      <span className="ml-3 text-slate-400">Loading history...</span>
                    </div>
                  ) : (
                    <StockChart data={history} />
                  )}
                </div>

                {analysis && (
                  <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-6 shadow-2xl backdrop-blur-xl">
                    <h3 className="mb-4 text-xl font-bold text-cyan-400">
                      AI Analysis
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl border border-slate-800/50 bg-slate-950/40 p-4">
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          Trend
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          {analysis.trend}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-800/50 bg-slate-950/40 p-4">
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          Risk Level
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          {analysis.riskLevel}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-800/50 bg-slate-950/40 p-4">
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          Suggested Action
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          {analysis.suggestedAction}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-800/50 bg-slate-950/40 p-5">
                      <p className="text-sm leading-7 text-slate-300">
                        {analysis.reasoning}
                      </p>
                    </div>

                    <div className="mt-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
                      This is AI-generated analysis and not financial advice.
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;