import { api } from "@/api/client";
import { type PartyResponse } from "@/models/Schemas";
import { useAuthStore } from "@/store/useAuthStore";
import { TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function useJoinPartyWorkflow() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = useAuthStore((state) => state.token);

  const joinMutation = useMutation({
    mutationFn: async (payload: { code: string; alias: string }) => {
      const { data } = await api.post<PartyResponse>("/parties/join", payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      notifications.show({
        title: "Sucesso!",
        message: "Você entrou no grupo com sucesso.",
        color: "green",
      });
      navigate(`/parties/${data.id}`);
    },
    onError: () => {
      notifications.show({
        title: "Erro ao entrar",
        message: "Verifique o código ou tente novamente mais tarde.",
        color: "red",
      });
    },
  });

  useEffect(() => {
    const urlCode = searchParams.get("joinCode");
    if (urlCode) {
      sessionStorage.setItem("pendingJoinCode", urlCode);
      setSearchParams({}, { replace: true });
    }

    const pendingCode = sessionStorage.getItem("pendingJoinCode");
    if (!pendingCode) return;

    if (!token) {
      notifications.show({
        title: "Autenticação necessária",
        message: "Faça login ou cadastre-se para entrar no grupo.",
        color: "blue",
      });
      navigate("/login");
      return;
    }

    let userAlias = "";

    modals.openConfirmModal({
      title: "Entrar no Grupo",
      closeOnConfirm: false,
      children: (
        <TextInput
          label="Como você quer ser chamado neste grupo?"
          placeholder="Seu apelido"
          required
          autoFocus
          onChange={(e) => {
            userAlias = e.target.value;
          }}
        />
      ),
      labels: { confirm: "Entrar no Grupo", cancel: "Cancelar" },
      onConfirm: () => {
        if (!userAlias.trim()) {
          notifications.show({ message: "O apelido é obrigatório", color: "red" });
          return;
        }
        sessionStorage.removeItem("pendingJoinCode");
        modals.closeAll();
        joinMutation.mutate({ code: pendingCode, alias: userAlias.trim() });
      },
      onCancel: () => {
        sessionStorage.removeItem("pendingJoinCode");
      },
    });
  }, [token, searchParams]);
}
