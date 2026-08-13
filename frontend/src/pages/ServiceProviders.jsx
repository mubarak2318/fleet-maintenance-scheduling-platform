import { useEffect, useState } from "react";
import {
  Building2,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

function ServiceProviders() {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/service-providers`
      );

      if (!response.ok) {
        throw new Error("Failed to load service providers");
      }

      const data = await response.json();

      setProviders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load service providers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const filteredProviders = providers.filter((provider) =>
    `${provider.name || ""} ${provider.email || ""} ${
      provider.phone || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="providers-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">FLEET MANAGEMENT</p>

          <h1>Service Providers</h1>

          <p>
            Manage workshops and external maintenance service providers.
          </p>
        </div>

        <button className="dashboard-primary-button">
          <Plus size={18} />
          Add Service Provider
        </button>
      </div>

      {/* Toolbar */}
      <div className="providers-toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search service providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="refresh-button"
          onClick={fetchProviders}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="provider-error">
          <strong>Unable to load providers</strong>
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="provider-empty">
          <RefreshCw size={28} className="loading-icon" />
          <h3>Loading service providers...</h3>
          <p>Please wait while we fetch the latest data.</p>
        </div>
      ) : filteredProviders.length === 0 ? (
        <div className="provider-empty">
          <div className="empty-icon">
            <Building2 size={30} />
          </div>

          <h3>
            {search
              ? "No providers found"
              : "No service providers yet"}
          </h3>

          <p>
            {search
              ? "Try a different search term."
              : "Add your first service provider to get started."}
          </p>

          {!search && (
            <button className="dashboard-primary-button">
              <Plus size={18} />
              Add Service Provider
            </button>
          )}
        </div>
      ) : (
        <div className="provider-grid">
          {filteredProviders.map((provider) => (
            <div className="provider-card" key={provider.id}>
              <div className="provider-card-header">
                <div className="provider-icon">
                  <Building2 size={22} />
                </div>

                <span
                  className={`provider-status ${
                    provider.is_active === false
                      ? "inactive"
                      : "active"
                  }`}
                >
                  {provider.is_active === false
                    ? "Inactive"
                    : "Active"}
                </span>
              </div>

              <h2>{provider.name}</h2>

              <div className="provider-details">
                {provider.email && (
                  <div>
                    <Mail size={16} />
                    <span>{provider.email}</span>
                  </div>
                )}

                {provider.phone && (
                  <div>
                    <Phone size={16} />
                    <span>{provider.phone}</span>
                  </div>
                )}

                {provider.address && (
                  <div>
                    <MapPin size={16} />
                    <span>{provider.address}</span>
                  </div>
                )}
              </div>

              <div className="provider-card-footer">
                <span>Provider ID</span>
                <strong>#{provider.id}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ServiceProviders;