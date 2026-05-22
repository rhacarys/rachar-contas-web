import { useKickMember, useLeaveParty, useUpdateMyAlias } from "@/hooks/useParties";
import type { PartyBalanceResponse } from "@/models/Schemas";
import { ActionIcon, Card, Group, Text, TextInput, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";

type MemberBalanceItem = NonNullable<PartyBalanceResponse["balances"]>[number];

interface MemberBalanceRowProps {
  member: MemberBalanceItem;
  currencyCode: string;
  isCurrentUser: boolean;
  partyId: string;
  currentUserIsAdmin: boolean;
  isManageMode: boolean;
}

export function MemberBalanceRow({
  member,
  currencyCode,
  isCurrentUser,
  partyId,
  currentUserIsAdmin,
  isManageMode,
}: MemberBalanceRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [alias, setAlias] = useState(member.alias || "");

  const updateAliasMutation = useUpdateMyAlias();
  const leavePartyMutation = useLeaveParty();
  const kickMemberMutation = useKickMember();

  const isDebtor = (member.balance ?? 0) < 0;
  const isSettled = (member.balance ?? 0) === 0;

  const [prevManageMode, setPrevManageMode] = useState(isManageMode);

  if (isManageMode !== prevManageMode) {
    setPrevManageMode(isManageMode);
    if (!isManageMode) {
      setIsEditing(false);
    }
  }

  const handleSaveAlias = async () => {
    if (!alias.trim() || alias.trim().length < 2) return;
    try {
      await updateAliasMutation.mutateAsync({ partyId, data: { alias: alias.trim() } });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLeaveGroup = () => {
    modals.openConfirmModal({
      title: "Sair do grupo",
      children: <Text size="sm">Tem certeza que deseja sair deste grupo de despesas?</Text>,
      labels: { confirm: "Sair", cancel: "Voltar" },
      confirmProps: { color: "red" },
      onConfirm: () => leavePartyMutation.mutate(partyId),
    });
  };

  const handleKickMember = () => {
    if (!member.membershipId) return;
    modals.openConfirmModal({
      title: "Expulsar membro",
      children: (
        <Text size="sm">
          Tem certeza que deseja remover o participante <b>{member.alias}</b> do grupo?
        </Text>
      ),
      labels: { confirm: "Remover", cancel: "Cancelar" },
      confirmProps: { color: "red" },
      onConfirm: () => kickMemberMutation.mutate({ partyId, membershipId: member.membershipId! }),
    });
  };

  return (
    <Card withBorder p="sm" radius="md">
      <Group justify="space-between">
        <Group gap="xs">
          {isEditing && isManageMode ? (
            <Group gap="xs" wrap="nowrap">
              <TextInput
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                size="xs"
                style={{ width: 150 }}
                disabled={updateAliasMutation.isPending}
                autoFocus
              />
              <ActionIcon size="sm" color="green" onClick={handleSaveAlias} loading={updateAliasMutation.isPending}>
                <IconCheck size={14} />
              </ActionIcon>
              <ActionIcon
                size="sm"
                color="gray"
                variant="subtle"
                onClick={() => setIsEditing(false)}
                disabled={updateAliasMutation.isPending}
              >
                <IconX size={14} />
              </ActionIcon>
            </Group>
          ) : (
            <>
              <Text fw={500}>
                {member.alias} {isCurrentUser && "(Você)"}
              </Text>
              {isCurrentUser && isManageMode && (
                <ActionIcon variant="subtle" size="xs" color="gray" onClick={() => setIsEditing(true)}>
                  <IconEdit size={12} />
                </ActionIcon>
              )}
            </>
          )}
        </Group>

        <Group gap="md">
          {!isManageMode ? (
            <Text fw={700} c={isDebtor ? "red" : "green"}>
              {`${currencyCode} ${(member.balance ?? 0).toFixed(2)}`}
            </Text>
          ) : (
            <>
              {isCurrentUser && (
                <Tooltip label={isSettled ? "Sair do grupo" : "Quite seu saldo antes de sair"} position="top" withArrow>
                  <ActionIcon
                    size="md"
                    color="red"
                    variant="subtle"
                    disabled={!isSettled}
                    loading={leavePartyMutation.isPending}
                    onClick={handleLeaveGroup}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              )}

              {!isCurrentUser && currentUserIsAdmin && (
                <Tooltip
                  label={isSettled ? "Expulsar membro" : "Não é possível remover membros com pendências"}
                  position="top"
                  withArrow
                >
                  <ActionIcon
                    size="md"
                    color="red"
                    variant="subtle"
                    disabled={!isSettled}
                    loading={kickMemberMutation.isPending}
                    onClick={handleKickMember}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              )}
            </>
          )}
        </Group>
      </Group>
    </Card>
  );
}
