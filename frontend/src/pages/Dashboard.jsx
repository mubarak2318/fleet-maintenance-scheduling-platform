import { useEffect, useState } from "react";
import {
  Truck,
  CalendarCheck,
  Building2,
  ArrowUpRight,
  Plus,
  Wrench,
  AlertTriangle,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [providers, setProviders] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError("");

      const [vehiclesResponse, providersResponse, schedulesResponse] =
        await Promise.all([
          fetch(`${API_BASE_URL}/vehicles`),
          fetch(`${API_BASE_URL}/service-providers`),
          fetch(`${API_BASE_URL}/maintenance-schedules`),
        ]);

      if (!vehiclesResponse.ok) {
        throw new Error("Failed to load vehicles");
      }

      if (!providersResponse.ok) {
        throw new Error("Failed to load service providers");
      }

      if (!schedulesResponse.ok) {
        throw new Error("Failed to load maintenance schedules");
      }

      const vehiclesData = await vehiclesResponse.json();
      const providersData = await providersResponse.json();
      const schedulesData = await schedulesResponse.json();

      setVehicles(
        Array.isArray(vehiclesData)
          ? vehiclesData
          : vehiclesData.data || vehiclesData.items || []
      );

      setProviders(
        Array.isArray(providersData)
          ? providersData
          : providersData.data || providersData.items || []
      );

      setSchedules(
        Array.isArray(schedulesData)
          ? schedulesData
          : schedulesData.data || schedulesData.items || []
      );
    } catch (err) {
      console.error("Dashboard API error:", err);
      setError(err.message || "Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  /* -----------------------------
     Vehicle statistics
  ----------------------------- */

  const totalVehicles = vehicles.length;

  const activeVehicles = vehicles.filter(
    (vehicle) =>
      String(vehicle.current_status || "").toLowerCase() === "active"
  ).length;

  const inServiceVehicles = vehicles.filter(
    (vehicle) =>
      String(vehicle.current_status || "").toLowerCase() === "in service"
  ).length;

  const inactiveVehicles = vehicles.filter((vehicle) => {
    const status = String(vehicle.current_status || "").toLowerCase();

    return status === "inactive" || status === "retired";
  }).length;

  /* -----------------------------
     Maintenance statistics
  ----------------------------- */

  const scheduledMaintenance = schedules.filter(
    (schedule) =>
      String(schedule.status || "").toLowerCase() === "scheduled"
  ).length;

  /* -----------------------------
     Dashboard cards
  ----------------------------- */

  const stats = [
    {
      title: "Total Vehicles",
      value: loading ? "..." : totalVehicles,
      description: "Registered fleet",
      icon: <Truck size={22} />,
    },
    {
      title: "Active Vehicles",
      value: loading ? "..." : activeVehicles,
      description: "Currently operational",
      icon: <Truck size={22} />,
    },
    {
      title: "Scheduled",
      value: loading ? "..." : scheduledMaintenance,
      description: "Upcoming maintenance",
      icon: <CalendarCheck size={22} />,
    },
    {
      title: "Service Providers",
      value: loading ? "..." : providers.length,
      description: "Registered providers",
      icon: <Building2 size={22} />,
    },
  ];

  /* -----------------------------
     Helper functions
  ----------------------------- */

  function getVehicle(vehicleId) {
    return vehicles.find(
      (vehicle) => Number(vehicle.id) === Number(vehicleId)
    );
  }

  function formatDate(dateValue) {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getPriorityClass(priority) {
    const value = String(priority || "").toLowerCase();

    if (value === "high") return "high";
    if (value === "medium") return "medium";
    if (value === "low") return "low";

    return "";
  }

  return (
    <div className="dashboard-page">

      {/* ---------------- HEADER ---------------- */}

      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">FLEET OVERVIEW</p>

          <h1>Good morning, Mubarak 👋</h1>

          <p className="dashboard-description">
            Here's what's happening with your fleet today.
          </p>
        </div>

        <button className="dashboard-primary-button">
          <Plus size={18} />
          Schedule Maintenance
        </button>
      </div>

      {/* ---------------- ERROR ---------------- */}

      {error && (
        <div
          style={{
            background: "#fff1f2",
            color: "#be123c",
            padding: "12px 16px",
            borderRadius: "10px",
            marginBottom: "20px",
            border: "1px solid #fecdd3",
          }}
        >
          Unable to load dashboard data: {error}
        </div>
      )}

      {/* ---------------- STATISTICS ---------------- */}

      <div className="dashboard-stats">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.title}>

            <div className="stat-card-top">
              <div className="stat-icon">
                {stat.icon}
              </div>

              <ArrowUpRight size={17} />
            </div>

            <div className="stat-value">
              {stat.value}
            </div>

            <div className="stat-title">
              {stat.title}
            </div>

            <div className="stat-description">
              {stat.description}
            </div>

          </div>
        ))}
      </div>

      {/* ---------------- MAIN GRID ---------------- */}

      <div className="dashboard-grid">

        {/* UPCOMING MAINTENANCE */}

        <section className="dashboard-card maintenance-card">

          <div className="card-header">
            <div>
              <h2>Upcoming Maintenance</h2>
              <p>Scheduled maintenance activities</p>
            </div>

            <button className="view-button">
              View all
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="maintenance-table">

            <div className="table-row table-header">
              <span>Vehicle</span>
              <span>Service</span>
              <span>Date</span>
              <span>Priority</span>
            </div>

            {loading ? (
              <div
                className="table-row"
                style={{ justifyContent: "center" }}
              >
                Loading maintenance...
              </div>
            ) : schedules.length === 0 ? (
              <div
                className="table-row"
                style={{ justifyContent: "center" }}
              >
                No upcoming maintenance scheduled.
              </div>
            ) : (
              schedules
                .filter(
                  (schedule) =>
                    String(schedule.status || "").toLowerCase() ===
                    "scheduled"
                )
                .slice(0, 5)
                .map((schedule) => {
                  const vehicle = getVehicle(schedule.vehicle_id);

                  return (
                    <div
                      className="table-row"
                      key={schedule.id}
                    >

                      <div className="vehicle-info">
                        <div className="vehicle-icon">
                          <Truck size={18} />
                        </div>

                        <div>
                          <strong>
                            {vehicle?.registration_number ||
                              `Vehicle #${schedule.vehicle_id}`}
                          </strong>

                          <small>
                            {vehicle?.make && vehicle?.model
                              ? `${vehicle.make} ${vehicle.model}`
                              : vehicle?.vehicle_type || "Fleet Vehicle"}
                          </small>
                        </div>
                      </div>

                      <span>
                        {schedule.maintenance_type ||
                          "Maintenance Service"}
                      </span>

                      <span>
                        {formatDate(schedule.scheduled_date)}
                      </span>

                      <span
                        className={`priority ${getPriorityClass(
                          schedule.priority
                        )}`}
                      >
                        {schedule.priority || "-"}
                      </span>

                    </div>
                  );
                })
            )}

          </div>
        </section>

        {/* ---------------- FLEET STATUS ---------------- */}

        <section className="dashboard-card">

          <div className="card-header">
            <div>
              <h2>Fleet Status</h2>
              <p>Current vehicle condition</p>
            </div>
          </div>

          <div className="fleet-status">

            <div className="status-item">
              <span className="status-indicator active"></span>

              <div>
                <strong>Active</strong>
                <span>Vehicles operating normally</span>
              </div>

              <b>{loading ? "..." : activeVehicles}</b>
            </div>

            <div className="status-item">
              <span className="status-indicator service"></span>

              <div>
                <strong>In Service</strong>
                <span>Currently under maintenance</span>
              </div>

              <b>{loading ? "..." : inServiceVehicles}</b>
            </div>

            <div className="status-item">
              <span className="status-indicator inactive"></span>

              <div>
                <strong>Inactive</strong>
                <span>Not currently operational</span>
              </div>

              <b>{loading ? "..." : inactiveVehicles}</b>
            </div>

          </div>

        </section>

      </div>

      {/* ---------------- BOTTOM GRID ---------------- */}

      <div className="dashboard-grid bottom-grid">

        {/* MAINTENANCE ALERTS */}

        <section className="dashboard-card">

          <div className="card-header">
            <div>
              <h2>Maintenance Alerts</h2>
              <p>Items requiring attention</p>
            </div>
          </div>

          <div className="alert-box">

            <div className="alert-icon">
              <AlertTriangle size={20} />
            </div>

            <div>
              <strong>
                {scheduledMaintenance > 0
                  ? `${scheduledMaintenance} scheduled maintenance ${
                      scheduledMaintenance === 1 ? "activity" : "activities"
                    }`
                  : "No critical alerts"}
              </strong>

              <p>
                {scheduledMaintenance > 0
                  ? "Review upcoming maintenance activities."
                  : "Your fleet currently has no critical maintenance issues."}
              </p>
            </div>

          </div>

        </section>

        {/* QUICK ACTIONS */}

        <section className="dashboard-card">

          <div className="card-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Common fleet operations</p>
            </div>
          </div>

          <div className="quick-actions">

            <button>
              <Truck size={19} />
              <span>Add Vehicle</span>
              <ArrowUpRight size={16} />
            </button>

            <button>
              <CalendarCheck size={19} />
              <span>Schedule Maintenance</span>
              <ArrowUpRight size={16} />
            </button>

            <button>
              <Wrench size={19} />
              <span>Add Maintenance Record</span>
              <ArrowUpRight size={16} />
            </button>

            <button>
              <Building2 size={19} />
              <span>Add Service Provider</span>
              <ArrowUpRight size={16} />
            </button>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Dashboard;