import { useState, useEffect } from "react";

const THEME = {
  bg: "#0f1117",
  card: "#191c26",
  cardBorder: "#2a2e3a",
  accent: "#00e5a0",
  accentDim: "rgba(0,229,160,0.12)",
  accentGlow: "rgba(0,229,160,0.35)",
  text: "#e4e6ed",
  textMuted: "#6b7280",
  input: "#111318",
  inputBorder: "#2f3442",
  red: "#ff5a5a",
  blue: "#4fa3e3",
};


const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:${THEME.bg}; color:${THEME.text}; font-family:'DM Sans',sans-serif; min-height:100vh; overflow-x:hidden; }
  input, button, select, textarea { font-family:inherit; }
  input:focus, textarea:focus { outline:none; }

  .glow-dot {
    width:320px; height:320px; border-radius:50%;
    filter:blur(90px); opacity:.25; position:absolute; pointer-events:none;
  }
  .glow-green { background:${THEME.accent}; }
  .glow-blue { background:${THEME.blue}; }

  /* Nav */
  .nav {
    position:fixed; top:0; left:0; right:0; z-index:100;
    display:flex; align-items:center; justify-content:space-between;
    padding:18px 32px;
    background:rgba(15,17,23,0.75); backdrop-filter:blur(14px);
    border-bottom:1px solid ${THEME.cardBorder};
  }
  .nav-logo { font-family:'Syne',sans-serif; font-weight:800; font-size:1.35rem; letter-spacing:-.5px; }
  .nav-logo span { color:${THEME.accent}; }
  .nav-steps { display:flex; gap:6px; }
  .nav-step {
    width:28px; height:4px; border-radius:2px;
    background:${THEME.cardBorder}; transition:.3s;
  }
  .nav-step.active { background:${THEME.accent}; box-shadow:0 0 8px ${THEME.accentGlow}; }

  /* Page wrapper */
  .page-wrap {
    min-height:100vh; display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    padding:100px 20px 40px; position:relative;
  }

  /* Cards */
  .card {
    background:${THEME.card}; border:1px solid ${THEME.cardBorder};
    border-radius:20px; width:100%; max-width:440px;
    padding:40px 36px; position:relative; z-index:2;
    box-shadow:0 8px 40px rgba(0,0,0,.35);
  }
  .card-title {
    font-family:'Syne',sans-serif; font-weight:700; font-size:1.7rem;
    margin-bottom:6px; color:#fff; letter-spacing:-.5px;
  }
  .card-sub { color:${THEME.textMuted}; font-size:.88rem; margin-bottom:28px; line-height:1.5; }

  /* Inputs */
  .input-group { margin-bottom:18px; }
  .input-label { display:block; font-size:.78rem; color:${THEME.textMuted}; margin-bottom:6px; text-transform:uppercase; letter-spacing:.8px; font-weight:500; }
  .input-field {
    width:100%; padding:12px 16px; border-radius:10px;
    background:${THEME.input}; border:1px solid ${THEME.inputBorder};
    color:#fff; font-size:.92rem; transition:.25s;
  }
  .input-field:focus { border-color:${THEME.accent}; box-shadow:0 0 0 3px ${THEME.accentDim}; }
  .input-field::placeholder { color:${THEME.textMuted}; }

  /* Buttons */
  .btn-primary {
    width:100%; padding:13px; border:none; border-radius:10px;
    background:${THEME.accent}; color:#0f1117; font-weight:600; font-size:.92rem;
    cursor:pointer; transition:.25s; letter-spacing:.3px; margin-top:4px;
    position:relative; overflow:hidden;
  }
  .btn-primary:hover { filter:brightness(1.1); box-shadow:0 4px 20px ${THEME.accentGlow}; transform:translateY(-1px); }
  .btn-primary:active { transform:translateY(0); }

  .btn-ghost {
    width:100%; padding:11px; border:1px solid ${THEME.cardBorder}; border-radius:10px;
    background:transparent; color:${THEME.text}; font-size:.88rem;
    cursor:pointer; transition:.25s; margin-top:10px;
  }
  .btn-ghost:hover { border-color:${THEME.accent}; color:${THEME.accent}; }

  /* Divider */
  .divider { display:flex; align-items:center; gap:12px; margin:20px 0; }
  .divider-line { flex:1; height:1px; background:${THEME.cardBorder}; }
  .divider-text { color:${THEME.textMuted}; font-size:.75rem; text-transform:uppercase; letter-spacing:1px; }

  /* Tabs */
  .tabs { display:flex; background:${THEME.input}; border-radius:10px; padding:4px; margin-bottom:24px; }
  .tab {
    flex:1; padding:9px; border:none; background:transparent;
    color:${THEME.textMuted}; font-size:.85rem; font-weight:500;
    border-radius:7px; cursor:pointer; transition:.25s;
  }
  .tab.active { background:${THEME.card}; color:#fff; box-shadow:0 2px 8px rgba(0,0,0,.3); }

  /* Role Cards */
  .role-grid { display:flex; gap:14px; margin-bottom:24px; }
  .role-card {
    flex:1; padding:24px 18px; border-radius:14px;
    border:2px solid ${THEME.cardBorder}; background:${THEME.input};
    cursor:pointer; transition:.3s; text-align:center; position:relative;
  }
  .role-card:hover { border-color:rgba(0,229,160,.35); }
  .role-card.selected { border-color:${THEME.accent}; background:${THEME.accentDim}; box-shadow:0 0 20px ${THEME.accentDim}; }
  .role-card .role-icon { font-size:2rem; margin-bottom:10px; }
  .role-card .role-name { font-family:'Syne',sans-serif; font-weight:600; font-size:.95rem; color:#fff; margin-bottom:4px; }
  .role-card .role-desc { font-size:.76rem; color:${THEME.textMuted}; line-height:1.4; }
  .role-card.selected .role-check {
    position:absolute; top:10px; right:10px;
    width:20px; height:20px; border-radius:50%; background:${THEME.accent};
    display:flex; align-items:center; justify-content:center; font-size:.75rem; color:#0f1117; font-weight:700;
  }

  /* Profile */
  .profile-header { display:flex; align-items:center; gap:18px; margin-bottom:28px; }
  .avatar-wrap {
    width:68px; height:68px; border-radius:50%;
    background:linear-gradient(135deg,${THEME.accent},${THEME.blue});
    display:flex; align-items:center; justify-content:center;
    font-family:'Syne',sans-serif; font-weight:800; font-size:1.5rem; color:#fff;
    flex-shrink:0;
  }
  .profile-name { font-family:'Syne',sans-serif; font-weight:700; font-size:1.15rem; color:#fff; }
  .profile-role-badge {
    display:inline-block; padding:3px 10px; border-radius:20px; font-size:.72rem;
    font-weight:600; text-transform:uppercase; letter-spacing:.6px; margin-top:4px;
  }
  .badge-client { background:rgba(79,163,227,.15); color:${THEME.blue}; }
  .badge-provider { background:${THEME.accentDim}; color:${THEME.accent}; }

  .profile-section-title {
    font-family:'Syne',sans-serif; font-weight:600; font-size:.82rem;
    color:${THEME.textMuted}; text-transform:uppercase; letter-spacing:1px;
    margin-bottom:12px; margin-top:8px;
  }

  /* Skills tags */
  .skills-wrap { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:6px; }
  .skill-tag {
    display:inline-flex; align-items:center; gap:6px;
    padding:6px 12px; border-radius:20px;
    background:${THEME.accentDim}; border:1px solid rgba(0,229,160,.2);
    color:${THEME.accent}; font-size:.78rem; font-weight:500;
  }
  .skill-tag .remove { cursor:pointer; opacity:.6; font-size:.82rem; transition:.2s; }
  .skill-tag .remove:hover { opacity:1; color:${THEME.red}; }
  .skill-add-row { display:flex; gap:8px; margin-top:10px; }
  .skill-add-row .input-field { flex:1; padding:9px 14px; font-size:.82rem; }
  .skill-add-btn {
    padding:0 16px; border:none; border-radius:8px;
    background:${THEME.accent}; color:#0f1117; font-weight:600; cursor:pointer;
    font-size:.82rem; transition:.2s;
  }
  .skill-add-btn:hover { filter:brightness(1.1); }

  /* Toggle */
  .toggle-row { display:flex; align-items:center; justify-content:space-between; padding:10px 0; }
  .toggle-label { font-size:.85rem; color:${THEME.text}; }
  .toggle {
    width:44px; height:24px; border-radius:12px;
    background:${THEME.cardBorder}; position:relative; cursor:pointer; transition:.3s;
  }
  .toggle.on { background:${THEME.accent}; }
  .toggle .knob {
    width:18px; height:18px; border-radius:50%; background:#fff;
    position:absolute; top:3px; left:3px; transition:.3s; box-shadow:0 1px 3px rgba(0,0,0,.3);
  }
  .toggle.on .knob { left:23px; }

  /* Back link */
  .back-link { color:${THEME.textMuted}; font-size:.82rem; cursor:pointer; margin-bottom:20px; display:inline-flex; align-items:center; gap:5px; transition:.2s; }
  .back-link:hover { color:${THEME.accent}; }

  /* Toast */
  .toast {
    position:fixed; bottom:28px; left:50%; transform:translateX(-50%) translateY(120px);
    background:#1e2130; border:1px solid ${THEME.accent}; color:${THEME.accent};
    padding:11px 22px; border-radius:10px; font-size:.82rem; font-weight:500;
    z-index:999; transition:.35s cubic-bezier(.4,0,.2,1); white-space:nowrap;
    box-shadow:0 4px 24px rgba(0,229,160,.2);
  }
  .toast.show { transform:translateX(-50%) translateY(0); }

  /* Error */
  .error-msg { color:${THEME.red}; font-size:.75rem; margin-top:6px; min-height:16px; }

  /* Scroll */
  .card::-webkit-scrollbar { width:4px; }
  .card::-webkit-scrollbar-track { background:transparent; }
  .card::-webkit-scrollbar-thumb { background:${THEME.cardBorder}; border-radius:2px; }
`;


export default function App() {
  const [page, setPage] = useState("auth"); // auth | role | profile
  const [tab, setTab] = useState("login"); // login | register
  const [toast, setToast] = useState("");

  // Auth state
  const [authData, setAuthData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [authError, setAuthError] = useState("");

  // Role state
  const [selectedRole, setSelectedRole] = useState(null);

  // Profile state
  const [profile, setProfile] = useState({ name: "", bio: "", skills: [], available: true, website: "" });
  const [newSkill, setNewSkill] = useState("");
  useEffect(() => {
  const saved = localStorage.getItem("skillswap-user");
  if (saved) {
    const data = JSON.parse(saved);
    setProfile(data.profile);
    setSelectedRole(data.role);
    setPage("profile");
  }
}, []);


  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  // Auth handlers
  const handleAuth = () => {
    if (tab === "register") {
      if (!authData.name || !authData.email || !authData.password) {
        setAuthError("All fields are required.");
        return;
      }
      if (authData.password !== authData.confirmPassword) {
        setAuthError("Passwords do not match.");
        return;
      }
      if (authData.password.length < 6) {
        setAuthError("Password must be at least 6 characters.");
        return;
      }
      setAuthError("");
      setProfile({ ...profile, name: authData.name });
      setPage("role");
      showToast("Account created successfully ✓");
    } else {
      if (!authData.email || !authData.password) {
        setAuthError("Please enter email and password.");
        return;
      }
      setAuthError("");
      setProfile({ ...profile, name: authData.name || "User" });
      setPage("role");
      showToast("Logged in successfully ✓");
    }
  };

  const handleRoleContinue = () => {
    if (!selectedRole) return;
    setPage("profile");
    showToast(`Role set to ${selectedRole} ✓`);
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !profile.skills.includes(s) && profile.skills.length < 8) {
      setProfile({ ...profile, skills: [...profile.skills, s] });
      setNewSkill("");
    }
  };

  const removeSkill = (i) => {
    setProfile({ ...profile, skills: profile.skills.filter((_, idx) => idx !== i) });
  };

  const initials = (profile.name || "U").slice(0, 2).toUpperCase();

  return (
    <>
      <style>{globalStyle}</style>

      {}
      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>

      {}
      <nav className="nav">
        <div className="nav-logo">Skill<span>Swap</span> <span style={{ color: THEME.textMuted, fontWeight: 400, fontSize: ".75rem" }}>Lite</span></div>
        <div className="nav-steps">
          <div className={`nav-step ${page === "auth" || page === "role" || page === "profile" ? "active" : ""}`} />
          <div className={`nav-step ${page === "role" || page === "profile" ? "active" : ""}`} />
          <div className={`nav-step ${page === "profile" ? "active" : ""}`} />
        </div>
      </nav>

      {/* ========== PAGE 1: AUTH ========== */}
      {page === "auth" && (
        <div className="page-wrap">
          <div className="glow-dot glow-green" style={{ top: "10%", left: "-100px" }} />
          <div className="glow-dot glow-blue" style={{ bottom: "5%", right: "-80px" }} />
          <div className="card">
            <div className="tabs">
              <button className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setAuthError(""); }}>Login</button>
              <button className={`tab ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setAuthError(""); }}>Register</button>
            </div>

            <h1 className="card-title">{tab === "login" ? "Welcome back" : "Create account"}</h1>
            <p className="card-sub">{tab === "login" ? "Sign in to your Skill Swap workspace." : "Join the network. Trade skills, not money."}</p>

            {tab === "register" && (
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input className="input-field" placeholder="Alex Johnson" value={authData.name} onChange={(e) => setAuthData({ ...authData, name: e.target.value })} />
              </div>
            )}
            <div className="input-group">
              <label className="input-label">Email</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={authData.email} onChange={(e) => setAuthData({ ...authData, email: e.target.value })} />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input className="input-field" type="password" placeholder="••••••••" value={authData.password} onChange={(e) => setAuthData({ ...authData, password: e.target.value })} />
            </div>
            {tab === "register" && (
              <div className="input-group">
                <label className="input-label">Confirm Password</label>
                <input className="input-field" type="password" placeholder="••••••••" value={authData.confirmPassword} onChange={(e) => setAuthData({ ...authData, confirmPassword: e.target.value })} />
              </div>
            )}
            {tab === "login" && (
              <div style={{ textAlign: "right", marginBottom: "4px" }}>
                <span style={{ color: THEME.accent, fontSize: ".76rem", cursor: "pointer" }}>Forgot password?</span>
              </div>
            )}

            <div className="error-msg">{authError}</div>
            <button className="btn-primary" onClick={handleAuth}>{tab === "login" ? "Sign In" : "Create Account"}</button>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>

            <button className="btn-ghost" style={{ marginTop: 0 }}>
              <span style={{ marginRight: 6 }}>⬜</span> Continue with Google
            </button>
          </div>
        </div>
      )}
    
      {/* ========== PAGE 2: ROLE SELECTION ========== */}
      {page === "role" && (
        <div className="page-wrap">
          <div className="glow-dot glow-blue" style={{ top: "8%", right: "-60px" }} />
          <div className="glow-dot glow-green" style={{ bottom: "10%", left: "-90px" }} />
          <div className="card">
            <span className="back-link" onClick={() => setPage("auth")}>← Back</span>
            <h1 className="card-title">Pick your role</h1>
            <p className="card-sub">Choose how you want to use Skill Swap. You can always change this later.</p>

            <div className="role-grid">
              {/* Client */}
              <div className={`role-card ${selectedRole === "client" ? "selected" : ""}`} onClick={() => setSelectedRole("client")}>
                {selectedRole === "client" && <div className="role-check">✓</div>}
                <div className="role-icon">🎯</div>
                <div className="role-name">Client</div>
                <div className="role-desc">Hire skilled providers for your projects</div>
              </div>
              {/* Provider */}
              <div className={`role-card ${selectedRole === "provider" ? "selected" : ""}`} onClick={() => setSelectedRole("provider")}>
                {selectedRole === "provider" && <div className="role-check">✓</div>}
                <div className="role-icon">⚡</div>
                <div className="role-name">Provider</div>
                <div className="role-desc">Offer your skills & find clients</div>
              </div>
            </div>

            {/* Info box */}
            <div style={{ background: THEME.accentDim, border: `1px solid rgba(0,229,160,.18)`, borderRadius: 10, padding: "14px 16px", marginBottom: 22 }}>
              <div style={{ fontSize: ".78rem", color: THEME.accent, fontWeight: 600, marginBottom: 4 }}>
                {selectedRole === "client" ? "🎯 As a Client you can:" : selectedRole === "provider" ? "⚡ As a Provider you can:" : "ℹ️ What's the difference?"}
              </div>
              <div style={{ fontSize: ".76rem", color: THEME.textMuted, lineHeight: 1.6 }}>
                {selectedRole === "client"
                  ? "Post projects · Browse providers · Message & collaborate · Manage budgets"
                  : selectedRole === "provider"
                    ? "List your skills · Get matched to projects · Set availability · Grow your portfolio"
                    : "Clients post work and hire. Providers showcase skills and get hired. Both roles can swap later."}
              </div>
            </div>

            <button className="btn-primary" onClick={handleRoleContinue} style={{ opacity: selectedRole ? 1 : .45, cursor: selectedRole ? "pointer" : "not-allowed" }}>
              Continue as {selectedRole ? (selectedRole === "client" ? "Client" : "Provider") : "…"}
            </button>
          </div>
        </div>
      )}

      {/* ========== PAGE 3: PROFILE ========== */}
      {page === "profile" && (
        <div className="page-wrap">
          <div className="glow-dot glow-green" style={{ top: "12%", right: "-70px" }} />
          <div className="glow-dot glow-blue" style={{ bottom: "8%", left: "-100px" }} />
          <div className="card" style={{ maxWidth: 480, maxHeight: "calc(100vh - 140px)", overflowY: "auto" }}>
            <span className="back-link" onClick={() => setPage("role")}>← Back</span>

            {/* Avatar + Header */}
            <div className="profile-header">
              <div className="avatar-wrap">{initials}</div>
              <div>
                <div className="profile-name">{profile.name || "Your Name"}</div>
                <div className={`profile-role-badge ${selectedRole === "client" ? "badge-client" : "badge-provider"}`}>
                  {selectedRole === "client" ? "Client" : "Provider"}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="profile-section-title">Basic Info</div>
            <div className="input-group">
              <label className="input-label">Display Name</label>
              <input className="input-field" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Your name" />
            </div>
            <div className="input-group">
              <label className="input-label">Bio</label>
              <textarea className="input-field" rows={3} placeholder="Tell others about yourself…" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} style={{ resize: "none", borderRadius: 10, lineHeight: 1.5 }} />
            </div>
            <div className="input-group">
              <label className="input-label">Website</label>
              <input className="input-field" placeholder="https://yoursite.com" value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} />
            </div>

            {/* Skills */}
            <div className="profile-section-title" style={{ marginTop: 22 }}>
              {selectedRole === "provider" ? "Your Skills" : "Skills Needed"}
            </div>
            <div className="skills-wrap">
              {profile.skills.map((s, i) => (
                <div className="skill-tag" key={i}>
                  {s}
                  <span className="remove" onClick={() => removeSkill(i)}>✕</span>
                </div>
              ))}
            </div>
            <div className="skill-add-row">
              <input
                className="input-field"
                placeholder={selectedRole === "provider" ? "e.g. React, Design…" : "e.g. Backend, SEO…"}
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
              />
              <button className="skill-add-btn" onClick={addSkill}>+ Add</button>
            </div>
            <div style={{ fontSize: ".72rem", color: THEME.textMuted, marginTop: 6 }}>Press Enter or click Add. Max 8 skills.</div>

            {/* Availability */}
            <div className="profile-section-title" style={{ marginTop: 22 }}>Settings</div>
            <div className="toggle-row">
              <span className="toggle-label">Available for work</span>
              <div className={`toggle ${profile.available ? "on" : ""}`} onClick={() => setProfile({ ...profile, available: !profile.available })}>
                <div className="knob" />
              </div>
            </div>

            {/* Save */}
            <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => showToast("Profile saved ✓")}>
              Save Profile
            </button>
          </div>
        </div>
      )}
    </>
  );
}
