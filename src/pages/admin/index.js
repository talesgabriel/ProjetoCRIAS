import Equipe from "../../components/Equipe";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminPanel() {
  const router = useRouter();

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

  return (
    <>
      <Equipe />
    </>
  );
}