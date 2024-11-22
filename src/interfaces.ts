export interface QueueData {
  showFutureDateUntil: string;
  current: {
    note: string;
    hasQueue: "no" | "yes";
    subqueue: number;
    queue: number;
  };
  graphs: {
    today: {
      scheduleApprovedSince: string;
      eventDate: string;
      hoursList: [
        {
          hour: string;
          electricity: number;
          description: string;
          periodLimitValue: number;
        }
      ];
    };
  };
}
