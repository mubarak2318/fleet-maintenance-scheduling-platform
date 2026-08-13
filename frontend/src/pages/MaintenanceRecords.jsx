import { useEffect, useState } from "react";
import {
  ClipboardList,
  Search,
  Plus,
  Truck,
  Building2,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

function MaintenanceRecords() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/maintenance-records`
      );

      if (!response.ok) {
        throw new Error("Failed to load maintenance records");
      }

      const data = await response.json();

      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load maintenance records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = records.filter((record) =>
    `${record.work_description || ""} ${
      record.parts_replaced || ""
    } ${record.remarks || ""} ${record.cost || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="records-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">MAINTENANCE HISTORY</p>

          <h1>Maintenance Records</h1>

          <p>
            View completed maintenance activities and service history.
          </p>
        </div>

        <button className="dashboard-primary-button">
          <Plus size={18} />
          Add Maintenance Record
        </button>
      </div>

      {/* Toolbar */}
      <div className="providers-toolbar">

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search maintenance records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="refresh-button"
          onClick={fetchRecords}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="provider-error">
          <strong>Unable to load maintenance records</strong>
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="provider-empty">
          <RefreshCw size={28} className="loading-icon" />

          <h3>Loading maintenance records...</h3>

          <p>
            Please wait while we fetch the service history.
          </p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="provider-empty">

          <div className="empty-icon">
            <ClipboardList size={30} />
          </div>

          <h3>
            {search
              ? "No records found"
              : "No maintenance records yet"}
          </h3>

          <p>
            {search
              ? "Try a different search term."
              : "Completed maintenance activities will appear here."}
          </p>

          {!search && (
            <button className="dashboard-primary-button">
              <Plus size={18} />
              Add Maintenance Record
            </button>
          )}

        </div>
      ) : (
        <div className="records-grid">

          {filteredRecords.map((record) => (
            <div
              className="record-card"
              key={record.id}
            >

              {/* Card Header */}
              <div className="record-card-header">

                <div className="record-icon">
                  <ClipboardList size={21} />
                </div>

                <span className="record-id">
                  Record #{record.id}
                </span>

              </div>

              {/* Description */}
              <h2>
                {record.work_description}
              </h2>

              {/* Details */}
              <div className="record-details">

                <div>
                  <Truck size={16} />
                  <span>
                    Vehicle #{record.vehicle_id}
                  </span>
                </div>

                <div>
                  <Building2 size={16} />
                  <span>
                    {record.service_provider_id
                      ? `Provider #${record.service_provider_id}`
                      : "No service provider"}
                  </span>
                </div>

                <div>
                  <CalendarDays size={16} />
                  <span>
                    {record.service_date
                      ? new Date(
                          record.service_date
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </div>

              </div>

              {/* Parts */}
              {record.parts_replaced && (
                <div className="record-section">

                  <span>Parts Replaced</span>

                  <p>
                    {record.parts_replaced}
                  </p>

                </div>
              )}

              {/* Cost */}
              <div className="record-footer">

                <div>
                  <span>Service Cost</span>

                  <strong>
                    {record.cost !== null &&
                    record.cost !== undefined
                      ? `₹${Number(record.cost).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}`
                      : "Not specified"}
                  </strong>
                </div>

                <div>
                  <span>Odometer</span>

                  <strong>
                    {record.odometer_reading
                      ? `${Number(
                          record.odometer_reading
                        ).toLocaleString()} km`
                      : "-"}
                  </strong>
                </div>

              </div>

              {/* Remarks */}
              {record.remarks && (
                <div className="record-remarks">
                  <strong>Remarks</strong>
                  <p>{record.remarks}</p>
                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MaintenanceRecords;