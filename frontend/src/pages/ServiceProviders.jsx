import { useEffect, useState } from "react";
import {
  Building2,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api/v1";

function ServiceProviders() {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    is_active: true,
  });

  // ==============================
  // LOAD SERVICE PROVIDERS
  // ==============================

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
      setError(
        err.message || "Unable to load service providers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  // ==============================
  // FORM HANDLING
  // ==============================

  const resetForm = () => {
    setForm({
      name: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
      is_active: true,
    });

    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (provider) => {
    setEditingId(provider.id);

    setForm({
      name: provider.name || "",
      contact_person: provider.contact_person || "",
      phone: provider.phone || "",
      email: provider.email || "",
      address: provider.address || "",
      is_active: provider.is_active !== false,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==============================
  // CREATE / UPDATE
  // ==============================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Provider name is required.");
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `${API_BASE_URL}/service-providers/${editingId}`
        : `${API_BASE_URL}/service-providers`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          contact_person: form.contact_person.trim() || null,
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
          address: form.address.trim() || null,
          is_active: form.is_active,
        }),
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
            "Unable to save service provider."
        );
      }

      alert(
        editingId
          ? "Service provider updated successfully."
          : "Service provider created successfully."
      );

      closeModal();

      await fetchProviders();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // DELETE
  // ==============================

  const handleDelete = async (provider) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${provider.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/service-providers/${provider.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let message = "Unable to delete service provider.";

        try {
          const result = await response.json();
          message = result?.detail || message;
        } catch {
          // DELETE may return 204 with no body
        }

        throw new Error(message);
      }

      alert("Service provider deleted successfully.");

      await fetchProviders();
    } catch (err) {
      alert(err.message);
    }
  };

  // ==============================
  // SEARCH
  // ==============================

  const filteredProviders = providers.filter((provider) => {
    const searchText = search.toLowerCase();

    return `
      ${provider.name || ""}
      ${provider.contact_person || ""}
      ${provider.email || ""}
      ${provider.phone || ""}
      ${provider.address || ""}
    `
      .toLowerCase()
      .includes(searchText);
  });

  // ==============================
  // UI
  // ==============================

  return (
    <div className="providers-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">
            FLEET MANAGEMENT
          </p>

          <h1>Service Providers</h1>

          <p>
            Manage workshops and external maintenance
            service providers.
          </p>
        </div>

        <button
          className="dashboard-primary-button"
          onClick={openAddModal}
        >
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
            onChange={(e) =>
              setSearch(e.target.value)
            }
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

          <RefreshCw
            size={28}
            className="loading-icon"
          />

          <h3>
            Loading service providers...
          </h3>

          <p>
            Please wait while we fetch the latest
            data.
          </p>

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
            <button
              className="dashboard-primary-button"
              onClick={openAddModal}
            >
              <Plus size={18} />
              Add Service Provider
            </button>
          )}

        </div>
      ) : (
        <div className="provider-grid">

          {filteredProviders.map((provider) => (
            <div
              className="provider-card"
              key={provider.id}
            >

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

                {provider.contact_person && (
                  <div>
                    <Building2 size={16} />
                    <span>
                      {provider.contact_person}
                    </span>
                  </div>
                )}

                {provider.email && (
                  <div>
                    <Mail size={16} />
                    <span>
                      {provider.email}
                    </span>
                  </div>
                )}

                {provider.phone && (
                  <div>
                    <Phone size={16} />
                    <span>
                      {provider.phone}
                    </span>
                  </div>
                )}

                {provider.address && (
                  <div>
                    <MapPin size={16} />
                    <span>
                      {provider.address}
                    </span>
                  </div>
                )}

              </div>

              {/* Actions */}
              <div className="provider-card-actions">

                <button
                  className="edit-button"
                  onClick={() =>
                    openEditModal(provider)
                  }
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    handleDelete(provider)
                  }
                >
                  <Trash2 size={15} />
                  Delete
                </button>

              </div>

              <div className="provider-card-footer">
                <span>Provider ID</span>
                <strong>#{provider.id}</strong>
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
                    ? "UPDATE PROVIDER"
                    : "NEW PROVIDER"}
                </p>

                <h2>
                  {editingId
                    ? "Edit Service Provider"
                    : "Add Service Provider"}
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

              {/* Name */}
              <div className="form-group">
                <label>
                  Provider Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: ABC Auto Service"
                  required
                />
              </div>

              {/* Contact */}
              <div className="form-group">
                <label>
                  Contact Person
                </label>

                <input
                  type="text"
                  name="contact_person"
                  value={form.contact_person}
                  onChange={handleChange}
                  placeholder="Contact person name"
                />
              </div>

              {/* Phone + Email */}
              <div className="form-row">

                <div className="form-group">
                  <label>Phone</label>

                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address"
                  />
                </div>

              </div>

              {/* Address */}
              <div className="form-group">
                <label>Address</label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Service provider address"
                  rows="3"
                />
              </div>

              {/* Active */}
              <label className="checkbox-label">

                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />

                <span>
                  Service provider is active
                </span>

              </label>

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
                    ? "Update Provider"
                    : "Create Provider"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default ServiceProviders;