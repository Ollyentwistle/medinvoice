import { fetchUser } from "@/utils/supabase/funcs";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useUser() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 5 * 60 * 1000, // 5 mins
    retry: false,
  });

  return query;
}

// export const useUser = () => {
//   const queryClient = useQueryClient();

//   const query = useQuery({
//     queryKey: ["auth", "user"],
//     queryFn: async () => {
//       const supabase = await createClient();
//       const { data, error } = await supabase.auth.getUser();
//       console.log(data, "<<<<<");
//       if (!data.user || error) return null;
//       return data.user;
//     },
//     staleTime: 5 * 60 * 1000, // 5 minutes cache
//   });

//   useEffect(() => {
//     const supabase = createClient();

//     const { data: listener } = supabase.auth.onAuthStateChange(() => {
//       queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
//     });

//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, [queryClient]);

//   return query;
// };
