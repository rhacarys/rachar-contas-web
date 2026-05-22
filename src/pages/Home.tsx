import { PartyDetailsView } from "@/components/party/PartyDetailsView";
import { PartyListView } from "@/components/party/PartyListView";
import { useAuthStore } from "@/store/useAuthStore";
import { usePartyStore } from "@/store/usePartyStore";
import { ActionIcon, AppShell, Burger, Group, Menu, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHome, IconLogout, IconUserCircle } from "@tabler/icons-react";

export function Home() {
  const logout = useAuthStore((state) => state.logout);
  const { activePartyId, setActivePartyId } = usePartyStore();
  const [opened, { toggle }] = useDisclosure();

  const handleLogout = () => {
    setActivePartyId(null);
    logout();
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            {activePartyId && (
              <ActionIcon variant="subtle" size="lg" onClick={() => setActivePartyId(null)}>
                <IconHome size={20} />
              </ActionIcon>
            )}

            <Title order={3} style={{ cursor: "pointer" }} onClick={() => setActivePartyId(null)}>
              Rachar Contas
            </Title>
          </Group>

          <Menu position="bottom-end" shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="xl" radius="xl">
                <IconUserCircle size={28} stroke={1.5} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item color="red" leftSection={<IconLogout size={16} />} onClick={handleLogout}>
                Sair do sistema
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Main bg="gray.0" style={{ minHeight: "100vh" }}>
        {activePartyId ? (
          <PartyDetailsView partyId={activePartyId} />
        ) : (
          <PartyListView onSelectParty={(id) => setActivePartyId(id)} />
        )}
      </AppShell.Main>
    </AppShell>
  );
}
