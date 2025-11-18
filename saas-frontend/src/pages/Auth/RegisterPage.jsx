import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "client",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await register(form);

      if (form.role === "entreprise") {
        navigate("/entreprise/dashboard");
      } else {
        navigate("/client/dashboard");
      }
    } catch (err) {
      console.log(err);
      setError("Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <h2 className="mb-4 text-center">Inscription</h2>

          {error && <Alert type="danger">{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Input
              label="Nom d'utilisateur"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Mot de passe"
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <Select
              label="Rôle"
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              options={[
                { value: "client", label: "Client" },
                { value: "entreprise", label: "Entreprise" },
              ]}
            />

            <div className="d-grid mt-3">
              <Button type="submit">Créer le compte</Button>
            </div>
          </form>

          <p className="mt-3 text-center">
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
