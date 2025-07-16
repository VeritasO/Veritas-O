import { useState, useEffect } from "react";
import axios from "axios";
import { ReflectionSchema } from "../../lib/validators";
import type { ReflectionSchema as ReflectionSchemaType } from "../../lib/validators";

  const [reflections, setReflections] = useState<ReflectionSchemaType[]>([]);
  const [reflections, setReflections] = useState<ReflectionSchema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReflections();
  }, []);

  const fetchReflections = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/reflections");
      setReflections(res.data);
    } catch (err) {
      console.error("Error fetching reflections", err);
    } finally {
      setLoading(false);
    }
  };

  const createReflection = async (newReflection: { agentId: string; content: string; griefTier?: number }) => {
    // Validate before sending
    const validation = ReflectionSchema.safeParse({
      ...newReflection,
      createdAt: new Date().toISOString(),
    });
    if (!validation.success) {
      console.error("Reflection validation failed", validation.error);
      return;
    }
    try {
      const res = await axios.post("/api/reflections", validation.data);
      setReflections(prev => [res.data, ...prev]);
    } catch (err) {
      console.error("Error creating reflection", err);
    }
  };

  return {
    reflections,
    loading,
    createReflection,
  };
}
