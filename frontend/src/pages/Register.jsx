import { useState } from "react";
import {
  Truck,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

function Register({
  onRegister,
  onLogin,
  onBack,
}) {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );

      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Registration failed."
        );
      }

      onRegister();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-left">

        <button
          className="auth-back"
          onClick={onBack}
        >
          ← Back to FleetOps
        </button>

        <div className="auth-brand">

          <div className="brand-icon">
            <Truck size={22} />
          </div>

          <div>
            <strong>FleetOps</strong>
            <span>Maintenance Platform</span>
          </div>

        </div>

        <div className="auth-content">

          <span className="auth-label">
            JOIN FLEETOPS
          </span>

          <h1>
            Take control of
            <span> your fleet.</span>
          </h1>

          <p>
            Create your FleetOps account and
            start managing vehicles, maintenance
            and service operations efficiently.
          </p>


          <div className="register-benefits">

            <div>
              <CheckCircle2 size={18} />
              Vehicle management
            </div>

            <div>
              <CheckCircle2 size={18} />
              Maintenance scheduling
            </div>

            <div>
              <CheckCircle2 size={18} />
              Centralized service records
            </div>

          </div>

        </div>

      </div>


      <div className="auth-right">

        <div className="auth-card">

          <div className="auth-card-header">

            <h2>
              Create account
            </h2>

            <p>
              Register to access FleetOps.
            </p>

          </div>


          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          <form onSubmit={handleRegister}>

            <label>
              Full name
            </label>

            <div className="auth-input">

              <User size={18} />

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />

            </div>


            <label>
              Email address
            </label>

            <div className="auth-input">

              <Mail size={18} />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />

            </div>


            <label>
              Password
            </label>

            <div className="auth-input">

              <Lock size={18} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>


            <label>
              Confirm password
            </label>

            <div className="auth-input">

              <Lock size={18} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                required
              />

            </div>


            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading
                ? "Creating account..."
                : "Create Account"}

              {!loading && (
                <ArrowRight size={18} />
              )}

            </button>

          </form>


          <div className="auth-switch">

            <span>
              Already have an account?
            </span>

            <button onClick={onLogin}>
              Sign in
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;