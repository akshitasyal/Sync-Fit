import { useState, useEffect } from "react";
import { IUser } from "@/types/user";

export function useProfile() {
  const [profile, setProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile");
      if (res.ok) {
        const body = await res.json();
        setProfile(body.data);
      } else {
         throw new Error("Failed to fetch profile");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<IUser>) => {
    try {
      setUpdating(true);
      setError("");
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "Update failed");
      }
      const result = await res.json();
      setProfile(result.data);
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    updating,
    error,
    fetchProfile,
    updateProfile,
    setError,
  };
}
