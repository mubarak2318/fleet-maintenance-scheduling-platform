import { useEffect, useState } from "react";
import {
  Truck,
  CalendarCheck,
  Building2,
  ArrowUpRight,
  Wrench,
  AlertTriangle,
  ClipboardList,
  Clock,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api/v1";

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [providers, setProviders] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError("");

      const [
        vehiclesResponse,
        providersResponse,
        schedulesResponse,
        recordsResponse,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/vehicles`),
        fetch(`${API_BASE_URL}/service-providers`),
        fetch(`${API_BASE_URL}/maintenance-schedules`),
        fetch(`${API_BASE_URL}/maintenance-records`),
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

      if (!recordsResponse.ok) {
        throw new Error("Failed to load maintenance records");
      }

      const vehiclesData = await vehiclesResponse.json();
      const providersData = await providersResponse.json();
      const schedulesData = await schedulesResponse.json();
      const recordsData = await recordsResponse.json();

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

      setRecords(
        Array.isArray(recordsData)
          ? recordsData
          : recordsData.data || recordsData.items || []
      );
    } catch (err) {
      console.error("Dashboard API error:", err);
      setError(err.message || "Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  /* ================= VEHICLE STATISTICS ================= */

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

  /* ================= MAINTENANCE STATISTICS ================= */

  const upcomingMaintenance = schedules.filter(
    (schedule) =>
      String(schedule.status || "").toUpperCase() === "UPCOMING"
  );

  const dueMaintenance = schedules.filter(
    (schedule) =>
      String(schedule.status || "").toUpperCase() === "DUE"
  );

  const overdueMaintenance = schedules.filter(
    (schedule) =>
      String(schedule.status || "").toUpperCase() === "OVERDUE"
  );

  /* ================= HELPERS ================= */

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

  function getStatusClass(statusValue) {
    const value = String(statusValue || "").toLowerCase();

    if (value === "upcoming") return "upcoming";
    if (value === "due") return "due";
    if (value === "overdue") return "overdue";

    return "";
  }

  function getStatusLabel(statusValue) {
    const value = String(statusValue || "").toUpperCase();

    if (value === "UPCOMING") return "Upcoming";
    if (value === "DUE") return "Due";
    if (value === "OVERDUE") return "Overdue";

    return value || "-";
  }

  /* ================= DASHBOARD CARDS ================= */

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
      title: "Upcoming Maintenance",
      value: loading ? "..." : upcomingMaintenance.length,
      description: "Scheduled for future dates",
      icon: <CalendarCheck size={22} />,
    },
    {
      title: "Overdue Maintenance",
      value: loading ? "..." : overdueMaintenance.length,
      description: "Requires attention",
      icon: <AlertTriangle size={22} />,
    },
    {
      title: "Service Providers",
      value: loading ? "..." : providers.length,
      description: "Registered providers",
      icon: <Building2 size={22} />,
    },
    {
      title: "Maintenance Records",
      value: loading ? "..." : records.length,
      description: "Completed activities",
      icon: <ClipboardList size={22} />,
    },
  ];

  /* ================= MAINTENANCE DISPLAY ================= */

  const maintenanceList = [...schedules]
    .filter((schedule) => {
      const status = String(schedule.status || "").toUpperCase();

      return (
        status === "OVERDUE" ||
        status === "DUE" ||
        status === "UPCOMING"
      );
    })
    .sort((a, b) => {
      const priority = {
        OVERDUE: 1,
        DUE: 2,
        UPCOMING: 3,
      };

      const statusA = String(a.status || "").toUpperCase();
      const statusB = String(b.status || "").toUpperCase();

      if (priority[statusA] !== priority[statusB]) {
        return priority[statusA] - priority[statusB];
      }

      return (
        new Date(a.scheduled_date) -
        new Date(b.scheduled_date)
      );
    })
    .slice(0, 6);

  return (
    <div className="dashboard-page">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            FLEET OVERVIEW
          </p>

          <h1>
            Good morning, Mubarak 👋
          </h1>

          <p className="dashboard-description">
            Here's what's happening with your fleet today.
          </p>
        </div>
      </div>

      {/* ================= ERROR ================= */}

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

      {/* ================= STATISTICS ================= */}

      <div className="dashboard-stats">
        {stats.map((stat) => (
          <div
            className="stat-card"
            key={stat.title}
          >
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

      {/* ================= MAINTENANCE STATUS ================= */}

      <div className="dashboard-grid">

        <section className="dashboard-card maintenance-card">

          <div className="card-header">
            <div>
              <h2>Maintenance Overview</h2>
              <p>
                Current maintenance schedule status
              </p>
            </div>
          </div>

          <div className="maintenance-status-summary">

            <div className="status-summary-item">
              <div className="status-summary-icon upcoming">
                <Clock size={19} />
              </div>

              <div>
                <strong>Upcoming</strong>
                <span>
                  Future maintenance
                </span>
              </div>

              <b>
                {loading ? "..." : upcomingMaintenance.length}
              </b>
            </div>

            <div className="status-summary-item">
              <div className="status-summary-icon due">
                <CalendarCheck size={19} />
              </div>

              <div>
                <strong>Due Today</strong>
                <span>
                  Requires today's service
                </span>
              </div>

              <b>
                {loading ? "..." : dueMaintenance.length}
              </b>
            </div>

            <div className="status-summary-item">
              <div className="status-summary-icon overdue">
                <AlertTriangle size={19} />
              </div>

              <div>
                <strong>Overdue</strong>
                <span>
                  Maintenance date passed
                </span>
              </div>

              <b>
                {loading ? "..." : overdueMaintenance.length}
              </b>
            </div>

          </div>
        </section>

        {/* ================= FLEET STATUS ================= */}

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
                <span>
                  Vehicles operating normally
                </span>
              </div>

              <b>
                {loading ? "..." : activeVehicles}
              </b>
            </div>

            <div className="status-item">
              <span className="status-indicator service"></span>

              <div>
                <strong>In Service</strong>
                <span>
                  Currently under maintenance
                </span>
              </div>

              <b>
                {loading ? "..." : inServiceVehicles}
              </b>
            </div>

            <div className="status-item">
              <span className="status-indicator inactive"></span>

              <div>
                <strong>Inactive</strong>
                <span>
                  Not currently operational
                </span>
              </div>

              <b>
                {loading ? "..." : inactiveVehicles}
              </b>
            </div>

          </div>
        </section>

      </div>

      {/* ================= MAINTENANCE TABLE ================= */}

      <section className="dashboard-card maintenance-card">

        <div className="card-header">
          <div>
            <h2>Maintenance Schedule</h2>
            <p>
              Upcoming, due and overdue maintenance
            </p>
          </div>
        </div>

        <div className="maintenance-table">

          <div className="table-row table-header">
            <span>Vehicle</span>
            <span>Service</span>
            <span>Date</span>
            <span>Status</span>
            <span>Priority</span>
          </div>

          {loading ? (
            <div
              className="table-row"
              style={{ justifyContent: "center" }}
            >
              Loading maintenance...
            </div>
          ) : maintenanceList.length === 0 ? (
            <div
              className="table-row"
              style={{ justifyContent: "center" }}
            >
              No maintenance schedules available.
            </div>
          ) : (
            maintenanceList.map((schedule) => {
              const vehicle = getVehicle(
                schedule.vehicle_id
              );

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
                        {vehicle?.make &&
                        vehicle?.model
                          ? `${vehicle.make} ${vehicle.model}`
                          : vehicle?.vehicle_type ||
                            "Fleet Vehicle"}
                      </small>
                    </div>

                  </div>

                  <span>
                    {schedule.maintenance_type ||
                      "Maintenance Service"}
                  </span>

                  <span>
                    {formatDate(
                      schedule.scheduled_date
                    )}
                  </span>

                  <span
                    className={`maintenance-status ${getStatusClass(
                      schedule.status
                    )}`}
                  >
                    {getStatusLabel(
                      schedule.status
                    )}
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

      {/* ================= ALERTS + QUICK INFORMATION ================= */}

      <div className="dashboard-grid bottom-grid">

        <section className="dashboard-card">

          <div className="card-header">
            <div>
              <h2>Maintenance Alerts</h2>
              <p>
                Items requiring attention
              </p>
            </div>
          </div>

          <div className="alert-box">

            <div className="alert-icon">
              <AlertTriangle size={20} />
            </div>

            <div>
              <strong>
                {overdueMaintenance.length > 0
                  ? `${overdueMaintenance.length} overdue ${
                      overdueMaintenance.length === 1
                        ? "maintenance activity"
                        : "maintenance activities"
                    }`
                  : dueMaintenance.length > 0
                    ? `${dueMaintenance.length} maintenance ${
                        dueMaintenance.length === 1
                          ? "activity is"
                          : "activities are"
                      } due today`
                    : "No critical maintenance alerts"}
              </strong>

              <p>
                {overdueMaintenance.length > 0
                  ? "Review overdue maintenance and create the corresponding maintenance records after completion."
                  : dueMaintenance.length > 0
                    ? "Maintenance activities are scheduled for today."
                    : "Your fleet currently has no overdue or due maintenance."}
              </p>
            </div>

          </div>

        </section>

        <section className="dashboard-card">

          <div className="card-header">
            <div>
              <h2>System Summary</h2>
              <p>
                Current fleet management information
              </p>
            </div>
          </div>

          <div className="quick-actions">

            <div>
              <Truck size={19} />
              <span>
                Vehicles
              </span>
              <strong>
                {loading ? "..." : totalVehicles}
              </strong>
            </div>

            <div>
              <Building2 size={19} />
              <span>
                Service Providers
              </span>
              <strong>
                {loading ? "..." : providers.length}
              </strong>
            </div>

            <div>
              <Wrench size={19} />
              <span>
                Maintenance Records
              </span>
              <strong>
                {loading ? "..." : records.length}
              </strong>
            </div>

            <div>
              <ClipboardList size={19} />
              <span>
                Total Schedules
              </span>
              <strong>
                {loading ? "..." : schedules.length}
              </strong>
            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Dashboard;