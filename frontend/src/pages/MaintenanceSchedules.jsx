import { useEffect, useState } from "react";
import {
  CalendarDays,
  Search,
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Truck,
  Building2,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

function MaintenanceSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [providers, setProviders] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    vehicle_id: "",
    service_provider_id: "",
    assigned_to: "",
    maintenance_type: "",
    description: "",
    scheduled_date: "",
    priority: "medium",
    status: "scheduled",
  });

  // ==========================================
  // LOAD SCHEDULES
  // ==========================================

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
      setError(
        err.message || "Unable to load maintenance schedules"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD VEHICLES
  // ==========================================

  const fetchVehicles = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vehicles`
      );

      if (!response.ok) {
        throw new Error("Failed to load vehicles");
      }

      const data = await response.json();

      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // LOAD SERVICE PROVIDERS
  // ==========================================

  const fetchProviders = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/service-providers`
      );

      if (!response.ok) {
        throw new Error("Failed to load service providers");
      }

      const data = await response.json();

      setProviders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchVehicles();
    fetchProviders();
  }, []);

  // ==========================================
  // FORM
  // ==========================================

  const resetForm = () => {
    setForm({
      vehicle_id: "",
      service_provider_id: "",
      assigned_to: "",
      maintenance_type: "",
      description: "",
      scheduled_date: "",
      priority: "medium",
      status: "scheduled",
    });

    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (schedule) => {
    setEditingId(schedule.id);

    setForm({
      vehicle_id: schedule.vehicle_id ?? "",
      service_provider_id:
        schedule.service_provider_id ?? "",
      assigned_to: schedule.assigned_to ?? "",
      maintenance_type:
        schedule.maintenance_type || "",
      description:
        schedule.description || "",
      scheduled_date: schedule.scheduled_date
        ? schedule.scheduled_date.substring(0, 10)
        : "",
      priority: schedule.priority || "medium",
      status: schedule.status || "scheduled",
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

  // ==========================================
  // CREATE / UPDATE
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.vehicle_id) {
      alert("Please select a vehicle.");
      return;
    }

    if (!form.service_provider_id) {
      alert("Please select a service provider.");
      return;
    }

    if (!form.assigned_to) {
      alert("Please enter the assigned user ID.");
      return;
    }

    if (!form.maintenance_type.trim()) {
      alert("Maintenance type is required.");
      return;
    }

    if (!form.scheduled_date) {
      alert("Scheduled date is required.");
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `${API_BASE_URL}/maintenance-schedules/${editingId}`
        : `${API_BASE_URL}/maintenance-schedules`;

      const payload = {
        vehicle_id: Number(form.vehicle_id),
        service_provider_id: Number(
          form.service_provider_id
        ),
        assigned_to: Number(form.assigned_to),
        maintenance_type:
          form.maintenance_type.trim(),
        description:
          form.description.trim() || null,
        scheduled_date: form.scheduled_date,
        priority: form.priority,
        status: form.status,
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
            "Unable to save maintenance schedule."
        );
      }

      alert(
        editingId
          ? "Maintenance schedule updated successfully."
          : "Maintenance schedule created successfully."
      );

      closeModal();

      await fetchSchedules();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (schedule) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this maintenance schedule?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/maintenance-schedules/${schedule.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let message =
          "Unable to delete maintenance schedule.";

        try {
          const result = await response.json();
          message = result?.detail || message;
        } catch {
          // DELETE may return 204
        }

        throw new Error(message);
      }

      alert(
        "Maintenance schedule deleted successfully."
      );

      await fetchSchedules();
    } catch (err) {
      alert(err.message);
    }
  };

  // ==========================================
  // FIND VEHICLE
  // ==========================================

  const getVehicle = (vehicleId) => {
    return vehicles.find(
      (vehicle) => vehicle.id === vehicleId
    );
  };

  // ==========================================
  // FIND PROVIDER
  // ==========================================

  const getProvider = (providerId) => {
    return providers.find(
      (provider) => provider.id === providerId
    );
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredSchedules = schedules.filter(
    (schedule) => {
      const vehicle = getVehicle(schedule.vehicle_id);
      const provider = getProvider(
        schedule.service_provider_id
      );

      const searchText = `
        ${schedule.maintenance_type || ""}
        ${schedule.description || ""}
        ${schedule.priority || ""}
        ${schedule.status || ""}
        ${vehicle?.registration_number || ""}
        ${vehicle?.make || ""}
        ${vehicle?.model || ""}
        ${provider?.name || ""}
      `.toLowerCase();

      return searchText.includes(
        search.toLowerCase()
      );
    }
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="schedules-page">

      {/* Header */}
      <div className="page-header">

        <div>
          <p className="page-eyebrow">
            FLEET MANAGEMENT
          </p>

          <h1>Maintenance Schedules</h1>

          <p>
            Plan and manage upcoming vehicle maintenance.
          </p>
        </div>

        <button
          className="dashboard-primary-button"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Schedule
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
            onChange={(e) =>
              setSearch(e.target.value)
            }
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

          <strong>
            Unable to load schedules
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
            Loading maintenance schedules...
          </h3>

          <p>
            Please wait while we fetch the latest
            maintenance data.
          </p>

        </div>
      ) : filteredSchedules.length === 0 ? (
        <div className="provider-empty">

          <div className="empty-icon">
            <CalendarDays size={30} />
          </div>

          <h3>
            {search
              ? "No schedules found"
              : "No maintenance schedules yet"}
          </h3>

          <p>
            {search
              ? "Try a different search term."
              : "Create your first maintenance schedule."}
          </p>

          {!search && (
            <button
              className="dashboard-primary-button"
              onClick={openAddModal}
            >
              <Plus size={18} />
              Add Schedule
            </button>
          )}

        </div>
      ) : (
        <div className="schedule-grid">

          {filteredSchedules.map((schedule) => {

            const vehicle = getVehicle(
              schedule.vehicle_id
            );

            const provider = getProvider(
              schedule.service_provider_id
            );

            return (
              <div
                className="schedule-card"
                key={schedule.id}
              >

                {/* Header */}
                <div className="schedule-card-header">

                  <div className="schedule-icon">
                    <CalendarDays size={22} />
                  </div>

                  <span
                    className={`schedule-status ${(
                      schedule.status || ""
                    )
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {schedule.status ||
                      "scheduled"}
                  </span>

                </div>

                {/* Maintenance type */}
                <h2>
                  {schedule.maintenance_type}
                </h2>

                {/* Vehicle */}
                <div className="schedule-detail">

                  <Truck size={16} />

                  <div>
                    <strong>Vehicle</strong>

                    <span>
                      {vehicle
                        ? `${vehicle.registration_number} - ${vehicle.make || ""} ${vehicle.model || ""}`
                        : `Vehicle #${schedule.vehicle_id}`}
                    </span>
                  </div>

                </div>

                {/* Provider */}
                <div className="schedule-detail">

                  <Building2 size={16} />

                  <div>
                    <strong>Service Provider</strong>

                    <span>
                      {provider
                        ? provider.name
                        : `Provider #${schedule.service_provider_id}`}
                    </span>
                  </div>

                </div>

                {/* Date */}
                <div className="schedule-detail">

                  <CalendarDays size={16} />

                  <div>
                    <strong>
                      Scheduled Date
                    </strong>

                    <span>
                      {schedule.scheduled_date
                        ? new Date(
                            schedule.scheduled_date
                          ).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>

                </div>

                {/* Priority */}
                <div className="schedule-priority">

                  <span>Priority</span>

                  <strong
                    className={`priority-${(
                      schedule.priority ||
                      "medium"
                    ).toLowerCase()}`}
                  >
                    {schedule.priority ||
                      "medium"}
                  </strong>

                </div>

                {/* Description */}
                {schedule.description && (
                  <p className="schedule-description">
                    {schedule.description}
                  </p>
                )}

                {/* Actions */}
                <div className="provider-card-actions">

                  <button
                    className="edit-button"
                    onClick={() =>
                      openEditModal(schedule)
                    }
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDelete(schedule)
                    }
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>

                </div>

                {/* ID */}
                <div className="provider-card-footer">

                  <span>
                    Schedule ID
                  </span>

                  <strong>
                    #{schedule.id}
                  </strong>

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* ====================================== */}
      {/* ADD / EDIT MODAL */}
      {/* ====================================== */}

      {showModal && (
        <div className="modal-overlay">

          <div className="provider-modal">

            <div className="modal-header">

              <div>

                <p className="page-eyebrow">
                  {editingId
                    ? "UPDATE SCHEDULE"
                    : "NEW SCHEDULE"}
                </p>

                <h2>
                  {editingId
                    ? "Edit Maintenance Schedule"
                    : "Create Maintenance Schedule"}
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

              {/* Vehicle */}
              <div className="form-group">

                <label>
                  Vehicle *
                </label>

                <select
                  name="vehicle_id"
                  value={form.vehicle_id}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Vehicle
                  </option>

                  {vehicles.map((vehicle) => (
                    <option
                      key={vehicle.id}
                      value={vehicle.id}
                    >
                      {vehicle.registration_number}
                      {vehicle.make
                        ? ` - ${vehicle.make}`
                        : ""}
                      {vehicle.model
                        ? ` ${vehicle.model}`
                        : ""}
                    </option>
                  ))}

                </select>

              </div>

              {/* Provider */}
              <div className="form-group">

                <label>
                  Service Provider *
                </label>

                <select
                  name="service_provider_id"
                  value={
                    form.service_provider_id
                  }
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Service Provider
                  </option>

                  {providers.map((provider) => (
                    <option
                      key={provider.id}
                      value={provider.id}
                    >
                      {provider.name}
                    </option>
                  ))}

                </select>

              </div>

              {/* Assigned User */}
              <div className="form-group">

                <label>
                  Assigned User ID *
                </label>

                <input
                  type="number"
                  name="assigned_to"
                  value={form.assigned_to}
                  onChange={handleChange}
                  placeholder="Example: 1"
                  min="1"
                  required
                />

                <small>
                  Enter the ID of the user responsible
                  for this maintenance schedule.
                </small>

              </div>

              {/* Maintenance Type */}
              <div className="form-group">

                <label>
                  Maintenance Type *
                </label>

                <input
                  type="text"
                  name="maintenance_type"
                  value={
                    form.maintenance_type
                  }
                  onChange={handleChange}
                  placeholder="Example: Regular Service"
                  required
                />

              </div>

              {/* Description */}
              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the required maintenance work..."
                  rows="3"
                />

              </div>

              {/* Date */}
              <div className="form-group">

                <label>
                  Scheduled Date *
                </label>

                <input
                  type="date"
                  name="scheduled_date"
                  value={
                    form.scheduled_date
                  }
                  onChange={handleChange}
                  required
                />

              </div>

              {/* Priority + Status */}
              <div className="form-row">

                <div className="form-group">

                  <label>
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                  >

                    <option value="low">
                      Low
                    </option>

                    <option value="medium">
                      Medium
                    </option>

                    <option value="high">
                      High
                    </option>

                    <option value="critical">
                      Critical
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >

                    <option value="scheduled">
                      Scheduled
                    </option>

                    <option value="in progress">
                      In Progress
                    </option>

                    <option value="completed">
                      Completed
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>

                  </select>

                </div>

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
                    ? "Update Schedule"
                    : "Create Schedule"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default MaintenanceSchedules;