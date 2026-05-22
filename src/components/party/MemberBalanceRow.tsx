import { useUpdateMyAlias } from "@/hooks/useParties";
import type { PartyBalanceResponse } from "@/models/Schemas";
import { ActionIcon, Card, Group, Text, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconEdit, IconX } from "@tabler/icons-react";
import { useState } from "react";

type MemberBalanceItem = NonNullable<PartyBalanceResponse["balances"]>[number];

interface MemberBalanceRowProps {
  member: MemberBalanceItem;
  currencyCode: string;
  isCurrentUser: boolean;
  partyId: string;
}

export function MemberBalanceRow({ member, currencyCode, isCurrentUser, partyId }: MemberBalanceRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [alias, setAlias] = useState(member.alias || "");
  const updateAliasMutation = useUpdateMyAlias();

  const isDebtor = (member.balance ?? 0) < 0;

  const handleSaveAlias = async () => {
    if (!alias.trim() || alias.trim().length < 2) {
      notifications.show({ message: "O apelido deve ter no mínimo 2 caracteres.", color: "red" });
      return;
    }
    try {
      await updateAliasMutation.mutateAsync({ partyId, data: { alias: alias.trim() } });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card withBorder p="sm" radius="md">
      <Group justify="space-between">
        <Group gap="xs">
          {isEditing ? (
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
              {isCurrentUser && (
                <ActionIcon variant="subtle" size="xs" color="gray" onClick={() => setIsEditing(true)}>
                  <IconEdit size={12} />
                </ActionIcon>
              )}
            </>
          )}
        </Group>

        <Text fw={700} c={isDebtor ? "red" : "green"}>
          {`${currencyCode} ${(member.balance ?? 0).toFixed(2)}`}
        </Text>
      </Group>
    </Card>
  );
}
