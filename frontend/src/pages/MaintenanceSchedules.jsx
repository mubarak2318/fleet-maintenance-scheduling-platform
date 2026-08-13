import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Search,
  Plus,
  Truck,
  Building2,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

function MaintenanceSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/maintenance-schedules`
      );

      if (!response.ok) {
        throw new Error("Failed to load maintenance schedules");
      }

      const data = await response.json();

      setSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const filteredSchedules = schedules.filter((schedule) =>
    `${schedule.maintenance_type || ""} ${
      schedule.description || ""
    } ${schedule.priority || ""} ${schedule.status || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "priority high";

      case "medium":
        return "priority medium";

      case "low":
        return "priority low";

      default:
        return "priority";
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "schedule-status scheduled";

      case "completed":
        return "schedule-status completed";

      case "cancelled":
        return "schedule-status cancelled";

      case "in progress":
        return "schedule-status progress";

      default:
        return "schedule-status";
    }
  };

  return (
    <div className="schedules-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">MAINTENANCE MANAGEMENT</p>

          <h1>Maintenance Schedules</h1>

          <p>
            Plan, track and manage upcoming vehicle maintenance activities.
          </p>
        </div>

        <button className="dashboard-primary-button">
          <Plus size={18} />
          Schedule Maintenance
        </button>
      </div>

      {/* Toolbar */}
      <div className="providers-toolbar">

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search maintenance schedules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="refresh-button"
          onClick={fetchSchedules}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="provider-error">
          <strong>Unable to load schedules</strong>
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="provider-empty">
          <RefreshCw size={28} className="loading-icon" />

          <h3>Loading maintenance schedules...</h3>

          <p>
            Please wait while we fetch the latest schedules.
          </p>
        </div>
      ) : filteredSchedules.length === 0 ? (
        <div className="provider-empty">

          <div className="empty-icon">
            <CalendarCheck size={30} />
          </div>

          <h3>
            {search
              ? "No schedules found"
              : "No maintenance schedules yet"}
          </h3>

          <p>
            {search
              ? "Try a different search term."
              : "Create your first maintenance schedule to get started."}
          </p>

          {!search && (
            <button className="dashboard-primary-button">
              <Plus size={18} />
              Schedule Maintenance
            </button>
          )}

        </div>
      ) : (
        <div className="schedule-table-card">

          <div className="schedule-table">

            {/* Table Header */}
            <div className="schedule-row schedule-header">
              <span>Maintenance</span>
              <span>Vehicle</span>
              <span>Service Provider</span>
              <span>Date</span>
              <span>Priority</span>
              <span>Status</span>
            </div>

            {/* Rows */}
            {filteredSchedules.map((schedule) => (
              <div
                className="schedule-row"
                key={schedule.id}
              >

                <div className="maintenance-info">
                  <div className="schedule-icon">
                    <CalendarCheck size={18} />
                  </div>

                  <div>
                    <strong>
                      {schedule.maintenance_type}
                    </strong>

                    <small>
                      {schedule.description ||
                        "Maintenance service"}
                    </small>
                  </div>
                </div>

                <div className="schedule-detail">
                  <Truck size={16} />
                  <span>
                    Vehicle #{schedule.vehicle_id}
                  </span>
                </div>

                <div className="schedule-detail">
                  <Building2 size={16} />
                  <span>
                    {schedule.service_provider_id
                      ? `Provider #${schedule.service_provider_id}`
                      : "Not assigned"}
                  </span>
                </div>

                <span>
                  {schedule.scheduled_date
                    ? new Date(
                        schedule.scheduled_date
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </span>

                <span className={getPriorityClass(schedule.priority)}>
                  {schedule.priority || "-"}
                </span>

                <span className={getStatusClass(schedule.status)}>
                  {schedule.status || "-"}
                </span>

              </div>
            ))}

          </div>
        </div>
      )}

    </div>
  );
}

export default MaintenanceSchedules;