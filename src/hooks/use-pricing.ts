import useSWR from "swr";
import { useSupabase } from "./use-supabase";

const usePricing = () => {
  const supabase = useSupabase();
  const fetcher = async (fn: string) => supabase.functions.invoke(fn);

  const { data, isLoading } = useSWR("get_pricing", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data,
    isLoading,
  };
};

export default usePricing;
