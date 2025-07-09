import { useState, useEffect } from "react";
import { fetchProductHuntTools } from "@/lib/productHunt";
import type { ProductHuntTool } from "@/lib/productHunt";

interface UseProductHuntToolsResult {
  tools: ProductHuntTool[];
  isLoading: boolean;
  error: Error | null;
}

export function useProductHuntTools(): UseProductHuntToolsResult {
  const [tools, setTools] = useState<ProductHuntTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchProductHuntTools();
        setTools(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch tools")
        );
        setTools([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, []); // Empty dependency array means this runs once on mount

  return { tools, isLoading, error };
}

// Example usage:
// const { tools, isLoading, error } = useProductHuntTools();
