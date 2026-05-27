import { HomeView } from "@/components/home/HomeView";
import { useAuthStore } from "@/store/useAuthStore";
import { usePartyStore } from "@/store/usePartyStore";
import { ActionIcon, AppShell, Group, Menu, Title } from "@mantine/core";
import { IconHome, IconLogout, IconUserCircle } from "@tabler/icons-react";

export function Home() {
  const logout = useAuthStore((state) => state.logout);
  const { activePartyId, setActivePartyId } = usePartyStore();

  const handleLogout = () => {
    setActivePartyId(null);
    logout();
  };

  return (
    <AppShell header={{ height: 60 }} padding="md">
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

      <AppShell.Main bg="dark.6" style={{ minHeight: "100vh" }}>
        <HomeView />
      </AppShell.Main>
    </AppShell>
  );
}
