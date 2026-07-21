import { useParams, useNavigate } from "react-router-dom";
import { fetchCoinData, fetchChartData } from "../APi/coinGecko";
import { useEffect, useState } from "react";
import { formatMarketCap, formatPrice } from "../utils/formatter";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const CoinDetales = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setchartData] = useState([]);

  useEffect(() => {
    loadCoinData();
    loadChartData();
  }, [id]);

  const loadCoinData = async () => {
    try {
      const data = await fetchCoinData(id);
      setCoin(data);
    } catch (err) {
      console.error("Error fetching coin:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      const data = await fetchChartData(id);
      const formattedData = data.prices.map(([timestamp, price]) => ({
        // ✅ data.prices not data.price, correct .map() syntax
        date: new Date(timestamp).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: parseFloat(price.toFixed(2)),
      }));
      setchartData(formattedData);
    } catch (err) {
      console.error("Error fetching chart:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>loading coin data...</p>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="app">
        <div className="no-results">
          <p>Coin Not Found</p>
          <button onClick={() => navigate("/")}>Go Back to Home</button>
        </div>
      </div>
    );
  }

  const PriceChange = coin.market_data.price_change_percentage_24h;
  const IsPositive = PriceChange >= 0;

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>Crypto for my Friends</h1>
            <p>Live Price tracing</p>
          </div>
          <button className="back-button" onClick={() => navigate("/")}>
            Go Back
          </button>
        </div>
      </header>
      <div className="coin-detail">
        <div className="coin-header">
          <div className="coin-title">
            <img src={coin.image.large} alt={coin.name} />
            <div>
              <h1>{coin.name}</h1>
              <p className="symbol">{coin.symbol.toUpperCase()}</p>
            </div>
            <span className="rank">
              Rank #{coin.market_data.market_cap_rank}
            </span>
          </div>
        </div>
        <div className="coin-price-section">
          <h2>{formatPrice(Number(coin.market_data.current_price.usd))}</h2>
          <span
            className={`change-badge ${IsPositive ? "positive" : "negative"}`}
          >
            {IsPositive ? "↑" : "↓"} {Math.abs(PriceChange).toFixed(2)}%
          </span>
          <div className="price-ranges">
            <div className="price-range">
              <span className="range-label">24H High</span>
              <span className="range-value">
                {formatPrice(coin.market_data.high_24h.usd)}
              </span>
            </div>
            <div className="price-range">
              <span className="range-label">24H Low</span>
              <span className="range-value">
                {formatPrice(coin.market_data.low_24h.usd)}
              </span>
            </div>
          </div>
        </div>
        <div className="chart-section">
          <h3>Price Chart (7 Days)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip formatter={(value) => formatPrice(value)} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#00bcd4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="state-label">Market Cap</span>
            <span className="state-label">
              {formatMarketCap(coin.market_data.market_cap.usd)}
            </span>
          </div>
          <div className="stat-card">
            <span className="state-label">Vloume (24)</span>
            <span className="state-label">
              {formatMarketCap(coin.market_data.total_volume.usd)}
            </span>
          </div>
          <div className="stat-card">
            <span className="state-label">Calculating Supply</span>
            <span className="state-label">
              {formatMarketCap(
                coin.market_data.circulating_supply?.toLocaleString() || "N\A",
              )}
            </span>
          </div>
          <div className="stat-card">
            <span className="state-label">Total Supplay</span>
            <span className="state-label">
              {formatMarketCap(
                coin.market_data.total_supply?.toLocaleString() || "N/A",
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
