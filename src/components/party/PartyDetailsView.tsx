import { usePartyBalances, useSyncParty, useUserParties } from "@/hooks/useParties";
import { type ExpenseResponse } from "@/models/Schemas";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ActionIcon,
  Alert,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconSettings, IconShare, IconUsers } from "@tabler/icons-react";
import { useState } from "react";
import { EditPartyDrawer } from "./EditPartyDrawer";
import { ExpenseDrawer } from "./ExpenseDrawer";
import { MemberBalanceRow } from "./MemberBalanceRow";
import { PartyExpensesList } from "./PartyExpensesList";

export function PartyDetailsView({ partyId }: { partyId: string }) {
  const { data: parties } = useUserParties();
  const { data: balanceData, isLoading, error } = usePartyBalances(partyId);
  useSyncParty(partyId);

  const user = useAuthStore((state) => state.user);
  const currentUserId = user?.id || "uuid-do-nathaniel";

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [adminDrawerOpened, { open: openAdminDrawer, close: closeAdminDrawer }] = useDisclosure(false);
  const [expenseToEdit, setExpenseToEdit] = useState<ExpenseResponse | null>(null);
  const [isManageMode, setIsManageMode] = useState(false);

  const currentParty = parties?.find((p) => p.id === partyId);

  const currentUserMember = balanceData?.balances?.find((m) => m.userId === currentUserId);
  const isAdmin = currentUserMember?.role === "ADMIN";

  const handleOpenNew = () => {
    setExpenseToEdit(null);
    openDrawer();
  };

  const handleOpenEdit = (expense: ExpenseResponse) => {
    setExpenseToEdit(expense);
    openDrawer();
  };

  const handleShareGroupLink = async () => {
    if (!currentParty?.code) return;
    const inviteLink = `${window.location.origin}?joinCode=${currentParty.code}`;
    const shareData = {
      title: `Entre no grupo ${currentParty.name}`,
      text: `Participe do meu grupo de despesas compartilhadas e vamos Rachar as Contas!`,
      url: inviteLink,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Compartilhamento cancelado:", err);
      }
    } else {
      await navigator.clipboard.writeText(inviteLink);
      notifications.show({
        title: "Link de convite copiado!",
        message: "O link com o código de acesso foi copiado para a sua área de transferência.",
        color: "green",
      });
    }
  };

  if (isLoading) return <Loader mt="xl" mx="auto" display="block" />;
  if (error) return <Alert color="red">Erro ao carregar dados do grupo.</Alert>;

  return (
    <Container py="xl" size="sm">
      <Stack gap="xs" mb="xl">
        <Group justify="end" gap="xs" mt="-lg">
          <Tooltip label="Compartilhar Link de Convite" position="top" withArrow>
            <ActionIcon variant="light" color="blue" radius="md" size="md" onClick={handleShareGroupLink}>
              <IconShare size={16} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Gerenciar Membros" position="top" withArrow>
            <ActionIcon
              variant={isManageMode ? "filled" : "light"}
              color={isManageMode ? "indigo" : "gray"}
              radius="md"
              size="md"
              onClick={() => setIsManageMode(!isManageMode)}
            >
              <IconUsers size={16} />
            </ActionIcon>
          </Tooltip>

          {isAdmin && (
            <ActionIcon variant="subtle" color="gray" size="md" onClick={openAdminDrawer}>
              <IconSettings size={22} />
            </ActionIcon>
          )}
        </Group>

        <Stack gap={4}>
          <Title order={2}>{currentParty?.name || "Grupo"}</Title>
          <Text size="sm" c="dimmed">
            {currentParty?.description || "Sem descrição informada."}
          </Text>
        </Stack>
      </Stack>

      <Stack gap="sm" mb="xl">
        {balanceData?.balances?.map((member) => (
          <MemberBalanceRow
            key={member.membershipId}
            member={member}
            partyId={partyId}
            currencyCode={currentParty?.currencyCode || "BRL"}
            isCurrentUser={member.userId === currentUserId}
            currentUserIsAdmin={isAdmin}
            isManageMode={isManageMode}
          />
        ))}
      </Stack>

      <Divider my="xl" />

      <Group justify="space-between" mb="md">
        <Title order={4}>Histórico</Title>
        <Button size="xs" onClick={handleOpenNew}>
          + Novo Registro
        </Button>
      </Group>
      <PartyExpensesList partyId={partyId} onEdit={handleOpenEdit} />
      <ExpenseDrawer partyId={partyId} opened={drawerOpened} onClose={closeDrawer} expenseToEdit={expenseToEdit} />

      {currentParty && isAdmin && (
        <EditPartyDrawer party={currentParty} opened={adminDrawerOpened} onClose={closeAdminDrawer} />
      )}
    </Container>
  );
}
