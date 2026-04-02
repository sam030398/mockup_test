import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NY_REDC_REGIONS, REGION_NAME_BY_ID } from "../mock/regions";

const isMatch = (input: string, expected: string): boolean => {
  const normalizedInput = input.trim().toLowerCase();
  const normalizedExpected = expected.trim().toLowerCase();
  return normalizedInput === normalizedExpected;
};

const isEmailUser = (email: string, expectedUserName: string): boolean => {
  const normalized = email.trim().toLowerCase();
  return normalized.startsWith(`${expectedUserName.toLowerCase()}@`);
};

const resolveUserAccess = (name: string, email: string) => {
  if (isMatch(name, "vijay") || isEmailUser(email, "vijay")) {
    return {
      displayName: "Vijay",
      role: "super_admin" as const,
      assignedRegionIds: NY_REDC_REGIONS.map((region) => region.id),
    };
  }

  if (isMatch(name, "ajith") || isEmailUser(email, "ajith")) {
    return {
      displayName: "Ajith",
      role: "data_owner" as const,
      assignedRegionIds: ["long_island"],
    };
  }

  return null;
};

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("vijay@ny.gov");
  const [name, setName] = useState("Vijay");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const resolvedAccess = resolveUserAccess(name, email);

  if (user) {
    return <Navigate to="/dashboard/map" replace />;
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resolvedAccess) {
      setLoginError("Only Vijay and Ajith are allowed in this mock. Use their name/email to sign in.");
      return;
    }

    setLoginError("");
    login({
      email,
      name: resolvedAccess.displayName,
      role: resolvedAccess.role,
      provider: "firebase",
      assignedRegionIds: resolvedAccess.assignedRegionIds,
    });
    navigate("/dashboard/map");
  };

  return (
    <div className="login-page">
      <section className="card login-card">
        <h2>State Emissions Portal</h2>
        <p className="muted">Mock secure sign-in for role-based access</p>
        <p className="muted">
          Allowed users: <strong>Vijay</strong> (Super Admin) and <strong>Ajith</strong> (Long Island Data Owner).
        </p>
        <p className="muted">
          Resolved Access:{" "}
          <strong>
            {resolvedAccess ? (resolvedAccess.role === "super_admin" ? "Super Admin" : "Data Owner") : "Unknown User"}
          </strong>{" "}
          | Assigned Region:{" "}
          <strong>
            {resolvedAccess
              ? resolvedAccess.role === "super_admin"
                ? "All NY Councils"
                : REGION_NAME_BY_ID[resolvedAccess.assignedRegionIds[0]]
              : "Not assigned"}
          </strong>
        </p>

        <form onSubmit={onSubmit} className="form-grid">
          <label>
            Name
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setLoginError("");
              }}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setLoginError("");
              }}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError("");
              }}
              minLength={6}
              required
            />
          </label>

          {loginError && <p className="error-text">{loginError}</p>}

          <button type="submit" className="button primary">
            Sign in
          </button>
        </form>
      </section>
    </div>
  );
}
