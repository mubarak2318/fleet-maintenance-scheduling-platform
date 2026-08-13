import { useState } from "react";
import {
  Truck,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
  BarChart3,
  Wrench,
  LayoutDashboard,
  Building2,
  ClipboardList,
  FileText,
  Menu,
  X,
  CheckCircle2,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import ServiceProviders from "./pages/ServiceProviders";
import MaintenanceSchedules from "./pages/MaintenanceSchedules";
import MaintenanceRecords from "./pages/MaintenanceRecords";
import Login from "./pages/Login";
import Register from "./pages/Register";

/* =========================================================
   LANDING PAGE
========================================================= */

function LandingPage({ onEnter }) {
  return (
    <div className="landing-page">

      {/* ================= NAVBAR ================= */}

      <nav className="landing-nav">

        <div className="brand">
          <div className="brand-icon">
            <Truck size={22} />
          </div>

          <div>
            <div className="brand-name">FleetOps</div>
            <div className="brand-subtitle">
              Maintenance Platform
            </div>
          </div>
        </div>

        <div className="landing-links">
          <a href="#features">Features</a>
          <a href="#solutions">Solutions</a>
          <a href="#about">About</a>
        </div>

        <button
          className="nav-get-started"
          onClick={onEnter}
        >
          Get Started
          <ArrowRight size={16} />
        </button>

      </nav>


      {/* ================= HERO SECTION ================= */}

      <section className="hero-section">

        {/* LEFT CONTENT */}

        <div className="hero-left">

          <div className="hero-label">
            <span className="hero-label-dot"></span>
            SMART FLEET MANAGEMENT
          </div>

          <h1>
            Smart Fleet
            <br />
            <span>Stronger Business</span>
          </h1>

          <p className="hero-description">
            A complete fleet maintenance scheduling platform
            designed to help organizations manage vehicles,
            maintenance operations and service records from
            one centralized platform.
          </p>


          {/* FEATURE HIGHLIGHTS */}

          <div className="hero-features">

            <div className="hero-feature">

              <div className="feature-small-icon">
                <Truck size={17} />
              </div>

              <div>
                <strong>Vehicle Management</strong>
                <span>
                  Track and manage your complete fleet
                </span>
              </div>

            </div>


            <div className="hero-feature">

              <div className="feature-small-icon">
                <CalendarCheck size={17} />
              </div>

              <div>
                <strong>Maintenance Scheduling</strong>
                <span>
                  Plan and organize maintenance activities
                </span>
              </div>

            </div>


            <div className="hero-feature">

              <div className="feature-small-icon">
                <Wrench size={17} />
              </div>

              <div>
                <strong>Service & Records</strong>
                <span>
                  Maintain complete service history
                </span>
              </div>

            </div>


            <div className="hero-feature">

              <div className="feature-small-icon">
                <BarChart3 size={17} />
              </div>

              <div>
                <strong>Fleet Insights</strong>
                <span>
                  Understand fleet maintenance activity
                </span>
              </div>

            </div>

          </div>


          {/* ACTION BUTTONS */}

          <div className="hero-buttons">

            <button
              className="hero-primary-btn"
              onClick={onEnter}
            >
              Get Started
              <ArrowRight size={18} />
            </button>

            <button
              className="hero-secondary-btn"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Explore Features
            </button>

          </div>


          {/* TRUST INFORMATION */}

          <div className="trust-strip">

            <div>
              <CheckCircle2 size={17} />
              <span>Centralized Fleet Data</span>
            </div>

            <div>
              <ShieldCheck size={17} />
              <span>Reliable Records</span>
            </div>

            <div>
              <CalendarCheck size={17} />
              <span>Smart Scheduling</span>
            </div>

          </div>

        </div>


        {/* RIGHT SIDE — TRUCK IMAGE */}

        <div className="hero-right">

          <div className="hero-image-background"></div>

          <img
            src="/truck-hero.png"
            alt="Fleet truck travelling on highway"
            className="truck-image"
          />

          <div className="image-overlay"></div>


          {/* FLOATING INFORMATION CARD */}

          <div className="fleet-card">

            <div className="fleet-card-icon">
              <Truck size={19} />
            </div>

            <div>
              <span>Fleet Operations</span>
              <strong>
                Maintenance made simple
              </strong>
            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section
        id="features"
        className="landing-features"
      >

        <div className="landing-section-heading">

          <span>ONE CENTRALIZED PLATFORM</span>

          <h2>
            Everything your fleet needs.
          </h2>

          <p>
            Manage vehicles, maintenance schedules,
            service providers and maintenance records
            through one unified platform.
          </p>

        </div>


        <div className="landing-feature-grid">

          <FeatureCard
            icon={<Truck />}
            title="Vehicle Management"
            text="Maintain vehicle information, status, mileage and fleet details."
          />

          <FeatureCard
            icon={<CalendarCheck />}
            title="Maintenance Scheduling"
            text="Schedule upcoming maintenance and organize service activities."
          />

          <FeatureCard
            icon={<Building2 />}
            title="Service Providers"
            text="Manage workshops and external maintenance service providers."
          />

          <FeatureCard
            icon={<ClipboardList />}
            title="Maintenance Records"
            text="Maintain a complete history of completed maintenance activities."
          />

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section
        id="solutions"
        className="landing-cta"
      >

        <div>

          <span>
            BUILT FOR FLEET OPERATIONS
          </span>

          <h2>
            Simplify maintenance.
            Improve fleet reliability.
          </h2>

          <p>
            Bring your vehicle data, schedules and
            maintenance records together in one place.
          </p>

        </div>

        <button
          className="hero-primary-btn"
          onClick={onEnter}
        >
          Launch FleetOps
          <ArrowRight size={18} />
        </button>

      </section>


      {/* ================= FOOTER ================= */}

      <footer
        id="about"
        className="landing-footer"
      >

        <div className="brand">

          <div className="brand-icon">
            <Truck size={18} />
          </div>

          <div>
            <div className="brand-name">
              FleetOps
            </div>

            <div className="brand-subtitle">
              Maintenance Platform
            </div>
          </div>

        </div>

        <p>
          Fleet Maintenance Scheduling Platform
        </p>

      </footer>

    </div>
  );
}


/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({ icon, title, text }) {

  return (
    <div className="landing-feature-card">

      <div className="landing-feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

    </div>
  );
}


/* =========================================================
   MAIN APPLICATION
========================================================= */

function App() {

  const [authPage, setAuthPage] = useState("landing");
  const [showApp, setShowApp] = useState(false);

  const [activePage, setActivePage] =
    useState("dashboard");

  const [mobileMenu, setMobileMenu] =
    useState(false);


  /* ================= LANDING PAGE ================= */

  if (authPage === "landing" && !showApp) {
  return (
    <LandingPage
      onEnter={() => setAuthPage("login")}
    />
  );
}

if (authPage === "login" && !showApp) {
  return (
    <Login
      onLogin={() => setShowApp(true)}
      onRegister={() => setAuthPage("register")}
      onBack={() => setAuthPage("landing")}
    />
  );
}

if (authPage === "register" && !showApp) {
  return (
    <Register
      onRegister={() => setAuthPage("login")}
      onLogin={() => setAuthPage("login")}
      onBack={() => setAuthPage("landing")}
    />
  );
}


  /* ================= APPLICATION PAGES ================= */

  const pages = {

    dashboard: <Dashboard />,

    vehicles: <Vehicles />,

    providers: <ServiceProviders />,

    schedules: <MaintenanceSchedules />,

    records: <MaintenanceRecords />,

  };


  /* ================= SIDEBAR NAVIGATION ================= */

  const navigation = [

    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },

    {
      id: "vehicles",
      label: "Vehicles",
      icon: <Truck size={18} />,
    },

    {
      id: "providers",
      label: "Service Providers",
      icon: <Building2 size={18} />,
    },

    {
      id: "schedules",
      label: "Maintenance Schedules",
      icon: <CalendarCheck size={18} />,
    },

    {
      id: "records",
      label: "Maintenance Records",
      icon: <FileText size={18} />,
    },

  ];


  /* ================= APPLICATION UI ================= */

  return (

    <div className="app-shell">

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          mobileMenu ? "sidebar-open" : ""
        }`}
      >

        <div className="sidebar-brand">

          <div className="brand-icon">
            <Truck size={20} />
          </div>

          <div>
            <strong>FleetOps</strong>
            <span>
              Maintenance Platform
            </span>
          </div>

          <button
            className="close-menu"
            onClick={() =>
              setMobileMenu(false)
            }
          >
            <X size={20} />
          </button>

        </div>


        <div className="sidebar-section-title">
          MAIN MENU
        </div>


        <nav>

          {navigation.map((item) => (

            <button
              key={item.id}
              className={`sidebar-link ${
                activePage === item.id
                  ? "active"
                  : ""
              }`}
              onClick={() => {

                setActivePage(item.id);

                setMobileMenu(false);

              }}
            >

              {item.icon}

              <span>
                {item.label}
              </span>

            </button>

          ))}

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <div className="system-status">

            <span className="status-dot"></span>

            <div>

              <strong>
                System Online
              </strong>

              <span>
                All services operational
              </span>

            </div>

          </div>


          <button
            className="back-home"
            onClick={() =>
              setShowApp(false)
            }
          >
            ← Back to Home
          </button>

        </div>

      </aside>


      {/* MAIN AREA */}

      <div className="main-area">


        {/* TOP BAR */}

        <header className="topbar">

          <button
            className="menu-button"
            onClick={() =>
              setMobileMenu(true)
            }
          >
            <Menu size={21} />
          </button>


          <div className="topbar-title">

            <span>
              Fleet Management
            </span>

            <strong>

              {
                navigation.find(
                  (item) =>
                    item.id === activePage
                )?.label
              }

            </strong>

          </div>


          {/* USER */}

          <div className="user-profile">

            <div className="user-avatar">
              AU
            </div>

            <div>

              <strong>
                Admin User
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>

        </header>


        {/* PAGE CONTENT */}

        <main className="content-area">

          {pages[activePage]}

        </main>

      </div>

    </div>
  );
}


export default App;