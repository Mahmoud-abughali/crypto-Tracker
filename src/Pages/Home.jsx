import { useEffect, useState } from "react";
import { CryptoCard } from "../components/cryptoCard";
import { fetchCryptos } from "../APi/coinGecko";

export const Home = () => {
  const [filterList, setFilterList] = useState([]);
  const [cryptoList, setCryptoList] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortby, setSortby] = useState("market_cap_rank");
  const [searchquery, setsearchquery] = useState("");
  const fetchCryptoData = async () => {
    try {
      const data = await fetchCryptos();
      setCryptoList(data);
    } catch (err) {
      console.error("Error fetching CryptoData");
    } finally {
      setisLoading(false);
    }
  };
  const FilterSearch = () => {
    let filtered = cryptoList.filter((crypto) =>
      crypto.name.toLowerCase().includes(searchquery)||
      crypto.symbol.toLowerCase().includes(searchquery)
  
  );
    filtered.sort((a, b) => {
      switch (sortby) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price": // Low to High
          return a.current_price - b.current_price;
        case "price_desc": // High to Low
          return b.current_price - a.current_price;
        case "change":
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        case "market_cap":
          return b.market_cap - a.market_cap;
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });
    setFilterList(filtered);
  };
  const FilterandSort = () => {
    let filtered = [...cryptoList];
    filtered.sort((a, b) => {
      switch (sortby) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price": // Low to High
          return a.current_price - b.current_price;
        case "price_desc": // High to Low
          return b.current_price - a.current_price;
        case "change":
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        case "market_cap":
          return b.market_cap - a.market_cap;
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });
    setFilterList(filtered);
  };
  useEffect(() => {
    FilterSearch();
  }, [sortby, cryptoList, searchquery]);
  useEffect(() => {
    FilterandSort();
  }, [sortby, cryptoList]);

  useEffect(() => {
    fetchCryptoData();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>Crypto for my Nigga</h1>
            <p>Live Price tracing</p>
          </div>
          <div className="search-section">
            <input
              type="text"
              placeholder="Search crypto"
              className="search-input"
              onChange={(e) => setsearchquery(e.target.value)}
              value={searchquery}
            />
          </div>
        </div>
      </header>
      <div className="controls">
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortby} onChange={(e) => setSortby(e.target.value)}>
            <option value="market_cap_rank">Rank</option>
            <option value="name">Name</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="price">Price (Low to High)</option>
            <option value="change">24H Change</option>
            <option value="market_cap">Market Cap</option>
          </select>
        </div>
        <div className="view-toggle">
          <button
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => setViewMode("grid")}
          >
            Grid
          </button>
          <button
            className={viewMode === "List" ? "active" : ""}
            onClick={() => setViewMode("List")}
          >
            List
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>loading crypto data...</p>
        </div>
      ) : (
        <div className={`crypto-container ${viewMode}`}>
          {filterList.map((crypto) => (
            <CryptoCard crypto={crypto} key={crypto.id || crypto.symbol} />
          ))}
        </div>
      )}
    </div>
  );
};
