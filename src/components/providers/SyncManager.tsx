import { useEffect } from "react";
import { api } from "@/api/client";
import { db } from "@/database/db";
import { type SyncPushRequest } from "@/models/Schemas";

export function SyncManager() {
  useEffect(() => {
    const processQueue = async () => {
      if (!navigator.onLine) return;

      const queueItems = await db.syncQueue.toArray();
      if (queueItems.length === 0) return;

      const parties = [...new Set(queueItems.map((item) => item.partyId))];

      for (const partyId of parties) {
        const partyItems = queueItems.filter((item) => item.partyId === partyId);

        const payload: SyncPushRequest = {
          expensesToCreate: partyItems.filter((i) => i.type === "CREATE_EXPENSE").map((i) => i.payload),
          expensesToDelete: partyItems.filter((i) => i.type === "DELETE_EXPENSE").map((i) => i.payload),
        };

        try {
          await api.post(`/parties/${partyId}/sync`, payload);
          const itemIds = partyItems.map((i) => i.id);
          await db.syncQueue.bulkDelete(itemIds);
        } catch (error) {
          console.debug(error);
        }
      }
    };

    const interval = setInterval(processQueue, 15000);
    window.addEventListener("online", processQueue);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", processQueue);
    };
  }, []);

  return null;
}
