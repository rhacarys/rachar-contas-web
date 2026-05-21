import { type PartyRequest } from "@/models/Schemas";
import { partyService } from "@/services/partyService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PARTIES_KEYS } from "./useParties";

export function useCreateParty(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PartyRequest) => partyService.createParty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTIES_KEYS.all });
      onSuccessCallback?.();
    },
  });
}
