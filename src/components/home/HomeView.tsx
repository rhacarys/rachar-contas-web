import { PartyDetailsView } from "@/components/party/PartyDetailsView";
import { PartyListView } from "@/components/party/PartyListView";
import { useJoinPartyWorkflow } from "@/hooks/useJoinPartyWorkflow";
import { usePartyStore } from "@/store/usePartyStore";

export function HomeView() {
  const { activePartyId, setActivePartyId } = usePartyStore();

  useJoinPartyWorkflow();

  if (activePartyId) {
    return <PartyDetailsView partyId={activePartyId} />;
  }

  return <PartyListView onSelectParty={(id) => setActivePartyId(id)} />;
}
