import Equipe from "../../components/admin/Equipe";
import Noticias from "../../components/admin/Noticias";
import Projetos from "../../components/admin/Projetos";
import Contatos from "../../components/admin/Contatos";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("equipe");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    // Valida o token no backend
    fetch("http://localhost:8080/api/v1/validation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ accessToken: token })
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (!data.valid) {
          localStorage.removeItem("accessToken");
          router.replace("/admin/login");
        }
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        router.replace("/admin/login");
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.replace("/home");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2rem", borderBottom: "2px solid #e0e0e0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <button
            onClick={() => setActiveTab("equipe")}
            style={{
              padding: "1rem 2rem",
              border: "none",
              background: activeTab === "equipe" ? "#2196F3" : "transparent",
              color: activeTab === "equipe" ? "white" : "#333",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              marginRight: "1rem",
              borderRadius: "4px 4px 0 0"
            }}
          >
            Equipe
          </button>
          <button
            onClick={() => setActiveTab("noticias")}
            style={{
              padding: "1rem 2rem",
              border: "none",
              background: activeTab === "noticias" ? "#2196F3" : "transparent",
              color: activeTab === "noticias" ? "white" : "#333",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              marginRight: "1rem",
              borderRadius: "4px 4px 0 0"
            }}
          >
            Notícias
          </button>
          <button
            onClick={() => setActiveTab("projetos")}
            style={{
              padding: "1rem 2rem",
              border: "none",
              background: activeTab === "projetos" ? "#2196F3" : "transparent",
              color: activeTab === "projetos" ? "white" : "#333",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              marginRight: "1rem",
              borderRadius: "4px 4px 0 0"
            }}
          >
            Projetos
          </button>
          <button
            onClick={() => setActiveTab("contatos")}
            style={{
              padding: "1rem 2rem",
              border: "none",
              background: activeTab === "contatos" ? "#2196F3" : "transparent",
              color: activeTab === "contatos" ? "white" : "#333",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              borderRadius: "4px 4px 0 0"
            }}
          >
            Contatos
          </button>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "0.75rem 1.5rem",
            border: "none",
            background: "#f44336",
            color: "white",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600",
            borderRadius: "4px",
            marginBottom: "0.5rem"
          }}
        >
          Sair
        </button>
      </div>

      {activeTab === "equipe" && <Equipe />}
      {activeTab === "noticias" && <Noticias />}
      {activeTab === "projetos" && <Projetos />}
      {activeTab === "contatos" && <Contatos />}
    </div>
  );
}