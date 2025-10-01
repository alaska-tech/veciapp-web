// src/services/mockChangesApi.ts

type Change = {
  id: number;
  vendorId: string;
  entityType: "store" | "product";
  action: "create" | "update";
  entityId?: string;
  payload: any;
  status: "pending" | "approved" | "rejected";
};

export const mockChangesApi = {
  async getChanges(status?: string): Promise<Change[]> {
    const data = localStorage.getItem("changes");
    let changes: Change[] = data ? JSON.parse(data) : [];
    if (status) {
      changes = changes.filter((c) => c.status === status);
    }
    return changes;
  },

  async createChange(change: Omit<Change, "id" | "status">): Promise<Change> {
    const data = localStorage.getItem("changes");
    const changes: Change[] = data ? JSON.parse(data) : [];

    const newChange: Change = {
      ...change,
      id: Date.now(),
      status: "pending",
    };

    localStorage.setItem("changes", JSON.stringify([...changes, newChange]));
    return newChange;
  },

  async updateChangeStatus(
    id: number,
    status: "approved" | "rejected"
  ): Promise<void> {
    const data = localStorage.getItem("changes");
    let changes: Change[] = data ? JSON.parse(data) : [];

    changes = changes.map((c) =>
      c.id === id ? { ...c, status } : c
    );

    localStorage.setItem("changes", JSON.stringify(changes));
  },
};