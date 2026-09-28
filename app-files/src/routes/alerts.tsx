import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SessionGate } from "@/components/guard";
import { AppShell } from "@/components/shell";
import { Card, Empty, PageTitle, Screen } from "@/components/ui";
import { formatDateTime } from "@/lib/dates";
import { getNotifications, markNotificationsRead } from "@/lib/fns/profile";
import type { AppNotification } from "@/lib/types";

export const Route = createFileRoute("/alerts")({ component: AlertsRoute });

function AlertsRoute() {
  return (
    <SessionGate>
      {() => <AlertsPage />}
    </SessionGate>
  );
}

function AlertsPage() {
  const [items, setItems] = useState<AppNotification[] | null>(null);

  useEffect(() => {
    getNotifications()
      .then((rows) => {
        setItems(rows);
        void markNotificationsRead();
      })
      .catch(() => setItems([]));
  }, []);

  return (
    <AppShell>
      <Screen>
        <PageTitle kicker="Inbox" title="Notifications" />
        {!items ? <p className="text-sm text-moss">Loading…</p> : null}
        {items && items.length === 0 ? (
          <Empty title="Quiet for now" body="Reminders, payouts, and staff notes will show up here." />
        ) : null}
        <div className="space-y-3">
          {items?.map((n) => {
            const inner = (
              <Card className={n.readAt ? "opacity-80" : ""}>
                <p className="font-semibold">{n.title}</p>
                <p className="mt-1 text-sm text-moss">{n.body}</p>
                <p className="mt-2 text-xs text-sage">{formatDateTime(n.createdAt)}</p>
              </Card>
            );
            return n.href ? (
              <a key={n.id} href={n.href}>
                {inner}
              </a>
            ) : (
              <div key={n.id}>{inner}</div>
            );
          })}
        </div>
      </Screen>
    </AppShell>
  );
}
