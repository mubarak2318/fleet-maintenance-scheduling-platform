import { useEffect, useState } from "react";
import {
  Truck,
  Search,
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api/v1";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    registration_number: "",
    vehicle_type: "",
    make: "",
    model: "",
    manufacture_year: "",
    current_status: "active",
    odometer_reading: "",
  });

  // ==============================
  // LOAD VEHICLES
  // ==============================

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/vehicles`
      );

      if (!response.ok) {
        throw new Error("Failed to load vehicles");
      }

      const data = await response.json();

      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message || "Unable to load vehicles"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // ==============================
  // FORM
  // ==============================

  const resetForm = () => {
    setForm({
      registration_number: "",
      vehicle_type: "",
      make: "",
      model: "",
      manufacture_year: "",
      current_status: "active",
      odometer_reading: "",
    });

    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (vehicle) => {
    setEditingId(vehicle.id);

    setForm({
      registration_number:
        vehicle.registration_number || "",
      vehicle_type: vehicle.vehicle_type || "",
      make: vehicle.make || "",
      model: vehicle.model || "",
      manufacture_year:
        vehicle.manufacture_year || "",
      current_status:
        vehicle.current_status || "active",
      odometer_reading:
        vehicle.odometer_reading ?? "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==============================
  // CREATE / UPDATE
  // ==============================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.registration_number.trim()) {
      alert("Registration number is required.");
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `${API_BASE_URL}/vehicles/${editingId}`
        : `${API_BASE_URL}/vehicles`;

      const payload = {
        registration_number:
          form.registration_number.trim(),

        vehicle_type:
          form.vehicle_type.trim(),

        make:
          form.make.trim(),

        model:
          form.model.trim(),

        manufacture_year: form.manufacture_year
          ? Number(form.manufacture_year)
          : null,

        current_status:
          form.current_status,

        odometer_reading: form.odometer_reading
          ? Number(form.odometer_reading)
          : 0,
      };

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let result = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        throw new Error(
          result?.detail ||
            "Unable to save vehicle."
        );
      }

      alert(
        editingId
          ? "Vehicle updated successfully."
          : "Vehicle created successfully."
      );

      closeModal();

      await fetchVehicles();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // DELETE
  // ==============================

  const handleDelete = async (vehicle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete vehicle "${vehicle.registration_number}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/vehicles/${vehicle.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let message = "Unable to delete vehicle.";

        try {
          const result = await response.json();
          message = result?.detail || message;
        } catch {
          // DELETE may return 204
        }

        throw new Error(message);
      }

      alert("Vehicle deleted successfully.");

      await fetchVehicles();
    } catch (err) {
      alert(err.message);
    }
  };

  // ==============================
  // SEARCH
  // ==============================

  const filteredVehicles = vehicles.filter(
    (vehicle) => {
      const searchText = search.toLowerCase();

      return `
        ${vehicle.registration_number || ""}
        ${vehicle.vehicle_type || ""}
        ${vehicle.make || ""}
        ${vehicle.model || ""}
        ${vehicle.current_status || ""}
      `
        .toLowerCase()
        .includes(searchText);
    }
  );

  // ==============================
  // UI
  // ==============================

  return (
    <div className="vehicles-page">

      {/* Header */}
      <div className="page-header">

        <div>
          <p className="page-eyebrow">
            FLEET MANAGEMENT
          </p>

          <h1>Vehicles</h1>

          <p>
            Manage fleet vehicles and their current
            operating status.
          </p>
        </div>

        <button
          className="dashboard-primary-button"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Vehicle
        </button>

      </div>

      {/* Toolbar */}
      <div className="providers-toolbar">

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <button
          className="refresh-button"
          onClick={fetchVehicles}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="provider-error">
          <strong>
            Unable to load vehicles
          </strong>

          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="provider-empty">

          <RefreshCw
            size={28}
            className="loading-icon"
          />

          <h3>
            Loading vehicles...
          </h3>

          <p>
            Please wait while we fetch the latest
            fleet data.
          </p>

        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="provider-empty">

          <div className="empty-icon">
            <Truck size={30} />
          </div>

          <h3>
            {search
              ? "No vehicles found"
              : "No vehicles yet"}
          </h3>

          <p>
            {search
              ? "Try a different search term."
              : "Add your first fleet vehicle to get started."}
          </p>

          {!search && (
            <button
              className="dashboard-primary-button"
              onClick={openAddModal}
            >
              <Plus size={18} />
              Add Vehicle
            </button>
          )}

        </div>
      ) : (
        <div className="vehicle-grid">

          {filteredVehicles.map((vehicle) => (

            <div
              className="vehicle-card"
              key={vehicle.id}
            >

              <div className="vehicle-card-header">

                <div className="provider-icon">
                  <Truck size={22} />
                </div>

                <span
                  className={`provider-status ${
                    vehicle.current_status ===
                    "inactive"
                      ? "inactive"
                      : "active"
                  }`}
                >
                  {vehicle.current_status ||
                    "active"}
                </span>

              </div>

              <h2>
                {vehicle.registration_number}
              </h2>

              <div className="vehicle-details">

                <div>
                  <strong>Type</strong>
                  <span>
                    {vehicle.vehicle_type || "-"}
                  </span>
                </div>

                <div>
                  <strong>Make</strong>
                  <span>
                    {vehicle.make || "-"}
                  </span>
                </div>

                <div>
                  <strong>Model</strong>
                  <span>
                    {vehicle.model || "-"}
                  </span>
                </div>

                <div>
                  <strong>Year</strong>
                  <span>
                    {vehicle.manufacture_year ||
                      "-"}
                  </span>
                </div>

                <div>
                  <strong>Odometer</strong>
                  <span>
                    {vehicle.odometer_reading ??
                      0}{" "}
                    km
                  </span>
                </div>

              </div>

              {/* Actions */}
              <div className="provider-card-actions">

                <button
                  className="edit-button"
                  onClick={() =>
                    openEditModal(vehicle)
                  }
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    handleDelete(vehicle)
                  }
                >
                  <Trash2 size={15} />
                  Delete
                </button>

              </div>

              <div className="provider-card-footer">

                <span>Vehicle ID</span>

                <strong>
                  #{vehicle.id}
                </strong>

              </div>

            </div>

          ))}

        </div>
      )}

      {/* ============================== */}
      {/* ADD / EDIT MODAL */}
      {/* ============================== */}

      {showModal && (
        <div className="modal-overlay">

          <div className="provider-modal">

            <div className="modal-header">

              <div>

                <p className="page-eyebrow">
                  {editingId
                    ? "UPDATE VEHICLE"
                    : "NEW VEHICLE"}
                </p>

                <h2>
                  {editingId
                    ? "Edit Vehicle"
                    : "Add Vehicle"}
                </h2>

              </div>

              <button
                className="modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={20} />
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              {/* Registration */}
              <div className="form-group">

                <label>
                  Registration Number *
                </label>

                <input
                  type="text"
                  name="registration_number"
                  value={
                    form.registration_number
                  }
                  onChange={handleChange}
                  placeholder="Example: TN45AB1234"
                  required
                />

              </div>

              {/* Vehicle Type */}
              <div className="form-group">

                <label>
                  Vehicle Type
                </label>

                <input
                  type="text"
                  name="vehicle_type"
                  value={form.vehicle_type}
                  onChange={handleChange}
                  placeholder="Example: Truck"
                />

              </div>

              {/* Make + Model */}
              <div className="form-row">

                <div className="form-group">

                  <label>Make</label>

                  <input
                    type="text"
                    name="make"
                    value={form.make}
                    onChange={handleChange}
                    placeholder="Example: Tata"
                  />

                </div>

                <div className="form-group">

                  <label>Model</label>

                  <input
                    type="text"
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    placeholder="Example: Prima"
                  />

                </div>

              </div>

              {/* Year + Odometer */}
              <div className="form-row">

                <div className="form-group">

                  <label>
                    Manufacture Year
                  </label>

                  <input
                    type="number"
                    name="manufacture_year"
                    value={
                      form.manufacture_year
                    }
                    onChange={handleChange}
                    placeholder="2024"
                    min="1900"
                    max="2100"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Odometer Reading
                  </label>

                  <input
                    type="number"
                    name="odometer_reading"
                    value={
                      form.odometer_reading
                    }
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />

                </div>

              </div>

              {/* Status */}
              <div className="form-group">

                <label>
                  Current Status
                </label>

                <select
                  name="current_status"
                  value={form.current_status}
                  onChange={handleChange}
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="in service">
                    In Service
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                  <option value="retired">
                    Retired
                  </option>
                </select>

              </div>

              {/* Actions */}
              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="dashboard-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Vehicle"
                    : "Create Vehicle"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Vehicles;