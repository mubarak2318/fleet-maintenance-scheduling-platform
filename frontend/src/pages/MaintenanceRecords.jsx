import { useEffect, useState } from "react";
import {
  ClipboardCheck,
  Search,
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Truck,
  Building2,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api/v1";

function MaintenanceRecords() {
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [providers, setProviders] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    schedule_id: "",
    vehicle_id: "",
    service_provider_id: "",
    performed_by: "",
    service_date: "",
    work_description: "",
    parts_replaced: "",
    cost: "",
    odometer_reading: "",
    remarks: "",
  });

  // ==========================================
  // LOAD RECORDS
  // ==========================================

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
      setError(
        err.message || "Unable to load maintenance records"
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
  // LOAD PROVIDERS
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

  // ==========================================
  // LOAD SCHEDULES
  // ==========================================

  const fetchSchedules = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/maintenance-schedules`
      );

      if (!response.ok) {
        throw new Error("Failed to load maintenance schedules");
      }

      const data = await response.json();

      setSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchVehicles();
    fetchProviders();
    fetchSchedules();
  }, []);

  // ==========================================
  // FORM
  // ==========================================

  const resetForm = () => {
    setForm({
      schedule_id: "",
      vehicle_id: "",
      service_provider_id: "",
      performed_by: "",
      service_date: "",
      work_description: "",
      parts_replaced: "",
      cost: "",
      odometer_reading: "",
      remarks: "",
    });

    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (record) => {
    setEditingId(record.id);

    setForm({
      schedule_id: record.schedule_id ?? "",
      vehicle_id: record.vehicle_id ?? "",
      service_provider_id:
        record.service_provider_id ?? "",
      performed_by: record.performed_by ?? "",
      service_date: record.service_date
        ? record.service_date.substring(0, 10)
        : "",
      work_description:
        record.work_description || "",
      parts_replaced:
        record.parts_replaced || "",
      cost: record.cost ?? "",
      odometer_reading:
        record.odometer_reading ?? "",
      remarks: record.remarks || "",
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

    if (!form.schedule_id) {
      alert("Please select a maintenance schedule.");
      return;
    }

    if (!form.vehicle_id) {
      alert("Please select a vehicle.");
      return;
    }

    if (!form.service_provider_id) {
      alert("Please select a service provider.");
      return;
    }

    if (!form.performed_by) {
      alert("Please enter the user ID who performed the maintenance.");
      return;
    }

    if (!form.service_date) {
      alert("Service date is required.");
      return;
    }

    if (!form.work_description.trim()) {
      alert("Work description is required.");
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `${API_BASE_URL}/maintenance-records/${editingId}`
        : `${API_BASE_URL}/maintenance-records`;

      const payload = {
        schedule_id: Number(form.schedule_id),
        vehicle_id: Number(form.vehicle_id),
        service_provider_id: Number(
          form.service_provider_id
        ),
        performed_by: Number(form.performed_by),
        service_date: form.service_date,
        work_description:
          form.work_description.trim(),
        parts_replaced:
          form.parts_replaced.trim() || null,
        cost: form.cost
          ? Number(form.cost)
          : 0,
        odometer_reading: form.odometer_reading
          ? Number(form.odometer_reading)
          : 0,
        remarks: form.remarks.trim() || null,
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
            "Unable to save maintenance record."
        );
      }

      alert(
        editingId
          ? "Maintenance record updated successfully."
          : "Maintenance record created successfully."
      );

      closeModal();

      await fetchRecords();
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

  const handleDelete = async (record) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this maintenance record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/maintenance-records/${record.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let message =
          "Unable to delete maintenance record.";

        try {
          const result = await response.json();
          message = result?.detail || message;
        } catch {
          // DELETE may return 204
        }

        throw new Error(message);
      }

      alert(
        "Maintenance record deleted successfully."
      );

      await fetchRecords();
    } catch (err) {
      alert(err.message);
    }
  };

  // ==========================================
  // LOOKUPS
  // ==========================================

  const getVehicle = (vehicleId) => {
    return vehicles.find(
      (vehicle) => vehicle.id === vehicleId
    );
  };

  const getProvider = (providerId) => {
    return providers.find(
      (provider) => provider.id === providerId
    );
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredRecords = records.filter((record) => {
    const vehicle = getVehicle(record.vehicle_id);
    const provider = getProvider(
      record.service_provider_id
    );

    const searchText = `
      ${record.work_description || ""}
      ${record.parts_replaced || ""}
      ${record.remarks || ""}
      ${vehicle?.registration_number || ""}
      ${vehicle?.make || ""}
      ${vehicle?.model || ""}
      ${provider?.name || ""}
    `.toLowerCase();

    return searchText.includes(
      search.toLowerCase()
    );
  });

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="records-page">

      {/* Header */}
      <div className="page-header">

        <div>
          <p className="page-eyebrow">
            FLEET MANAGEMENT
          </p>

          <h1>Maintenance Records</h1>

          <p>
            Maintain a complete history of completed
            vehicle maintenance work.
          </p>
        </div>

        <button
          className="dashboard-primary-button"
          onClick={openAddModal}
        >
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
            onChange={(e) =>
              setSearch(e.target.value)
            }
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

          <strong>
            Unable to load maintenance records
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
            Loading maintenance records...
          </h3>

          <p>
            Please wait while we fetch the latest
            maintenance history.
          </p>

        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="provider-empty">

          <div className="empty-icon">
            <ClipboardCheck size={30} />
          </div>

          <h3>
            {search
              ? "No records found"
              : "No maintenance records yet"}
          </h3>

          <p>
            {search
              ? "Try a different search term."
              : "Add your first maintenance record."}
          </p>

          {!search && (
            <button
              className="dashboard-primary-button"
              onClick={openAddModal}
            >
              <Plus size={18} />
              Add Maintenance Record
            </button>
          )}

        </div>
      ) : (
        <div className="record-grid">

          {filteredRecords.map((record) => {

            const vehicle = getVehicle(
              record.vehicle_id
            );

            const provider = getProvider(
              record.service_provider_id
            );

            return (
              <div
                className="record-card"
                key={record.id}
              >

                {/* Header */}
                <div className="record-card-header">

                  <div className="record-icon">
                    <ClipboardCheck size={22} />
                  </div>

                  <span className="record-status">
                    Completed
                  </span>

                </div>

                {/* Work */}
                <h2>
                  {record.work_description}
                </h2>

                {/* Vehicle */}
                <div className="record-detail">

                  <Truck size={16} />

                  <div>
                    <strong>Vehicle</strong>

                    <span>
                      {vehicle
                        ? `${vehicle.registration_number} - ${vehicle.make || ""} ${vehicle.model || ""}`
                        : `Vehicle #${record.vehicle_id}`}
                    </span>
                  </div>

                </div>

                {/* Provider */}
                <div className="record-detail">

                  <Building2 size={16} />

                  <div>
                    <strong>Service Provider</strong>

                    <span>
                      {provider
                        ? provider.name
                        : `Provider #${record.service_provider_id}`}
                    </span>
                  </div>

                </div>

                {/* Date */}
                <div className="record-detail">

                  <CalendarDays size={16} />

                  <div>
                    <strong>Service Date</strong>

                    <span>
                      {record.service_date
                        ? new Date(
                            record.service_date
                          ).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>

                </div>

                {/* Cost */}
                <div className="record-detail">

                  <IndianRupee size={16} />

                  <div>
                    <strong>Maintenance Cost</strong>

                    <span>
                      ₹
                      {Number(
                        record.cost || 0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                </div>

                {/* Odometer */}
                <div className="record-detail">

                  <Truck size={16} />

                  <div>
                    <strong>Odometer</strong>

                    <span>
                      {record.odometer_reading ??
                        0}{" "}
                      km
                    </span>
                  </div>

                </div>

                {/* Parts */}
                {record.parts_replaced && (
                  <div className="record-description">

                    <strong>
                      Parts Replaced
                    </strong>

                    <p>
                      {record.parts_replaced}
                    </p>

                  </div>
                )}

                {/* Remarks */}
                {record.remarks && (
                  <div className="record-description">

                    <strong>
                      Remarks
                    </strong>

                    <p>
                      {record.remarks}
                    </p>

                  </div>
                )}

                {/* Actions */}
                <div className="provider-card-actions">

                  <button
                    className="edit-button"
                    onClick={() =>
                      openEditModal(record)
                    }
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDelete(record)
                    }
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>

                </div>

                {/* ID */}
                <div className="provider-card-footer">

                  <span>
                    Record ID
                  </span>

                  <strong>
                    #{record.id}
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
                    ? "UPDATE RECORD"
                    : "NEW RECORD"}
                </p>

                <h2>
                  {editingId
                    ? "Edit Maintenance Record"
                    : "Add Maintenance Record"}
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

              {/* Schedule */}
              <div className="form-group">

                <label>
                  Maintenance Schedule *
                </label>

                <select
                  name="schedule_id"
                  value={form.schedule_id}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Schedule
                  </option>

                  {schedules.map((schedule) => (
                    <option
                      key={schedule.id}
                      value={schedule.id}
                    >
                      #{schedule.id} -{" "}
                      {schedule.maintenance_type}
                      {schedule.scheduled_date
                        ? ` (${schedule.scheduled_date.substring(
                            0,
                            10
                          )})`
                        : ""}
                    </option>
                  ))}

                </select>

              </div>

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

              {/* Performed By */}
              <div className="form-group">

                <label>
                  Performed By User ID *
                </label>

                <input
                  type="number"
                  name="performed_by"
                  value={form.performed_by}
                  onChange={handleChange}
                  placeholder="Example: 1"
                  min="1"
                  required
                />

              </div>

              {/* Date */}
              <div className="form-group">

                <label>
                  Service Date *
                </label>

                <input
                  type="date"
                  name="service_date"
                  value={form.service_date}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* Work Description */}
              <div className="form-group">

                <label>
                  Work Description *
                </label>

                <textarea
                  name="work_description"
                  value={
                    form.work_description
                  }
                  onChange={handleChange}
                  placeholder="Describe the maintenance work completed..."
                  rows="4"
                  required
                />

              </div>

              {/* Parts */}
              <div className="form-group">

                <label>
                  Parts Replaced
                </label>

                <textarea
                  name="parts_replaced"
                  value={
                    form.parts_replaced
                  }
                  onChange={handleChange}
                  placeholder="Example: Engine oil, oil filter, brake pads"
                  rows="3"
                />

              </div>

              {/* Cost + Odometer */}
              <div className="form-row">

                <div className="form-group">

                  <label>
                    Cost
                  </label>

                  <input
                    type="number"
                    name="cost"
                    value={form.cost}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
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

              {/* Remarks */}
              <div className="form-group">

                <label>
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  placeholder="Additional notes..."
                  rows="3"
                />

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
                    ? "Update Record"
                    : "Create Record"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default MaintenanceRecords;