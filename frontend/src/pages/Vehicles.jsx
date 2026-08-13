import { useEffect, useState } from "react";
import {
  Truck,
  Plus,
  Search,
  ArrowUpRight,
  X,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    registration_number: "",
    vehicle_type: "Truck",
    make: "",
    model: "",
    manufacture_year: new Date().getFullYear(),
    current_status: "Active",
    odometer_reading: 0,
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/vehicles`);

      if (!response.ok) {
        throw new Error("Failed to load vehicles");
      }

      const data = await response.json();

      setVehicles(
        Array.isArray(data)
          ? data
          : data.data || data.items || []
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load vehicles");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "manufacture_year" || name === "odometer_reading"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError("");

      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to create vehicle"
        );
      }

      setVehicles((previous) => [...previous, data]);

      setFormData({
        registration_number: "",
        vehicle_type: "Truck",
        make: "",
        model: "",
        manufacture_year: new Date().getFullYear(),
        current_status: "Active",
        odometer_reading: 0,
      });

      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to create vehicle");
    }
  }

  const filteredVehicles = vehicles.filter((vehicle) => {
    const search = searchTerm.toLowerCase();

    return (
      String(vehicle.registration_number || "")
        .toLowerCase()
        .includes(search) ||
      String(vehicle.make || "")
        .toLowerCase()
        .includes(search) ||
      String(vehicle.model || "")
        .toLowerCase()
        .includes(search) ||
      String(vehicle.vehicle_type || "")
        .toLowerCase()
        .includes(search)
    );
  });

  return (
    <div className="dashboard-page">

      {/* Header */}

      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            FLEET MANAGEMENT
          </p>

          <h1>Vehicles</h1>

          <p className="dashboard-description">
            Manage your registered fleet and vehicle information.
          </p>
        </div>

        <button
          className="dashboard-primary-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          Add Vehicle
        </button>
      </div>

      {/* Error */}

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
          {error}
        </div>
      )}

      {/* Search */}

      <div
        className="dashboard-card"
        style={{ marginBottom: "20px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Search size={20} />

          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: "15px",
              background: "transparent",
            }}
          />
        </div>
      </div>

      {/* Vehicle Table */}

      <section className="dashboard-card">

        <div className="card-header">
          <div>
            <h2>Registered Vehicles</h2>

            <p>
              {vehicles.length} vehicle
              {vehicles.length !== 1 ? "s" : ""} in your fleet
            </p>
          </div>
        </div>

        <div className="maintenance-table">

          <div className="table-row table-header">
            <span>Vehicle</span>
            <span>Type</span>
            <span>Year</span>
            <span>Status</span>
            <span>Odometer</span>
          </div>

          {loading ? (
            <div
              className="table-row"
              style={{ justifyContent: "center" }}
            >
              Loading vehicles...
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              <Truck
                size={40}
                style={{
                  marginBottom: "10px",
                  opacity: 0.5,
                }}
              />

              <p>No vehicles found.</p>
            </div>
          ) : (
            filteredVehicles.map((vehicle) => (
              <div
                className="table-row"
                key={vehicle.id}
              >

                {/* Vehicle */}

                <div className="vehicle-info">
                  <div className="vehicle-icon">
                    <Truck size={18} />
                  </div>

                  <div>
                    <strong>
                      {vehicle.registration_number}
                    </strong>

                    <small>
                      {vehicle.make} {vehicle.model}
                    </small>
                  </div>
                </div>

                {/* Type */}

                <span>
                  {vehicle.vehicle_type}
                </span>

                {/* Year */}

                <span>
                  {vehicle.manufacture_year}
                </span>

                {/* Status */}

                <span>
                  <span
                    className={`priority ${
                      String(
                        vehicle.current_status || ""
                      ).toLowerCase() === "active"
                        ? "low"
                        : "high"
                    }`}
                  >
                    {vehicle.current_status}
                  </span>
                </span>

                {/* Odometer */}

                <span>
                  {Number(
                    vehicle.odometer_reading || 0
                  ).toLocaleString()}{" "}
                  km
                </span>

              </div>
            ))
          )}

        </div>

      </section>

      {/* Add Vehicle Modal */}

      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >

          <div
            className="dashboard-card"
            style={{
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >

            {/* Modal Header */}

            <div
              className="card-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2>Add Vehicle</h2>

                <p>
                  Register a new vehicle in your fleet.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmit}>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, 1fr)",
                  gap: "16px",
                  padding: "20px 0",
                }}
              >

                {/* Registration */}

                <div>
                  <label>Registration Number</label>

                  <input
                    name="registration_number"
                    value={
                      formData.registration_number
                    }
                    onChange={handleChange}
                    placeholder="TN45AB1234"
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Vehicle Type */}

                <div>
                  <label>Vehicle Type</label>

                  <select
                    name="vehicle_type"
                    value={formData.vehicle_type}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="Truck">
                      Truck
                    </option>

                    <option value="Van">
                      Van
                    </option>

                    <option value="Bus">
                      Bus
                    </option>

                    <option value="Car">
                      Car
                    </option>
                  </select>
                </div>

                {/* Make */}

                <div>
                  <label>Make</label>

                  <input
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    placeholder="Tata"
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Model */}

                <div>
                  <label>Model</label>

                  <input
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Prima"
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Manufacture Year */}

                <div>
                  <label>Manufacture Year</label>

                  <input
                    type="number"
                    name="manufacture_year"
                    value={
                      formData.manufacture_year
                    }
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Status */}

                <div>
                  <label>Current Status</label>

                  <select
                    name="current_status"
                    value={
                      formData.current_status
                    }
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="In Service">
                      In Service
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>

                {/* Odometer */}

                <div>
                  <label>Odometer Reading</label>

                  <input
                    type="number"
                    name="odometer_reading"
                    value={
                      formData.odometer_reading
                    }
                    onChange={handleChange}
                    min="0"
                    style={inputStyle}
                  />
                </div>

              </div>

              {/* Buttons */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  borderTop:
                    "1px solid #e2e8f0",
                  paddingTop: "18px",
                }}
              >

                <button
                  type="button"
                  onClick={() =>
                    setShowForm(false)
                  }
                  style={secondaryButtonStyle}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="dashboard-primary-button"
                >
                  <Plus size={18} />
                  Add Vehicle
                </button>

              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 12px",
  marginTop: "6px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box",
};

const secondaryButtonStyle = {
  padding: "11px 18px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  background: "#ffffff",
  cursor: "pointer",
  fontWeight: "600",
};

export default Vehicles;