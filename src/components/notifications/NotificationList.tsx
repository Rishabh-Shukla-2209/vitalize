"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";
import { useUser } from "@clerk/nextjs";
import { Cursor, NotificationPayload } from "@/lib/types";
import Icons from "../icons/appIcons";
import { getNotifications, getUnreadNotificationCount } from "@/lib/queries";
import Notification from "./Notification";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { getNotificationDetails } from "@/lib/utils";
import { Badge } from "../ui/badge";

export function NotificationsList() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [cursor, setCursor] = useState<Cursor>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async (userId: string) => {
      const res = await getNotifications(userId, null);
      if (res.length > 0) {
        setNotifications(res);
        setCursor({
          createdAt: res[res.length - 1].createdAt,
          id: res[res.length - 1].id,
        });
      }
      if (res.length === 20) setHasMore(true);
    };

    const fetchUnreadCount = async (userId: string) => {
      const res = await getUnreadNotificationCount(userId);
      setUnreadCount(res);
    };

    if (!user) return;

    fetchNotifications(user.id);
    fetchUnreadCount(user.id);

    const channelName = `private-user-${user.id}`;
    const channel = pusherClient.subscribe(channelName);

    channel.bind("notification:new", (payload: NotificationPayload) => {
      setNotifications((prev) => [payload, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast("New Notification", {
        description: getNotificationDetails(payload).text,
        action: {
          label: "View",
          onClick: () => setOpen(true),
        },
      });
    });

    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [user]);

  const loadMoreNotifications = async () => {
    setLoading(true);
    const res = await getNotifications(user!.id, cursor);
    setNotifications((prev) => [...prev, ...res]);
    setCursor({
      createdAt: res[res.length - 1].createdAt,
      id: res[res.length - 1].id,
    });
    if (res.length === 20) setHasMore(true);
    else setHasMore(false);
    setLoading(false);
  };

  return (
    <div className="relative">
      <Icons.bell
        className="cursor-pointer text-gray-500 hover:text-gray-900"
        onClick={() => setOpen((prev) => !prev)}
        fill="white"
      />
      {unreadCount > 0 && (
        <Badge variant="secondary" className="absolute -top-3 -right-3 -z-1">
          {unreadCount}
        </Badge>
      )}
      {open && (
        <div className="absolute top-12 right-1 min-w-80 max-h-125 overflow-scroll border-2 border-zinc-200 p-1 text-sm bg-zinc-50 rounded-md">
          {notifications.length > 0 ? (
            <div>
              <h3 className="p-2 border-b border-b-zinc-400">
                Notifications
              </h3>
              {notifications.map((n) => (
                <Notification
                  key={n.id}
                  notification={n}
                  setOpen={setOpen}
                  setNotifications={setNotifications}
                  setUnreadCount={setUnreadCount}
                />
              ))}
              {hasMore && (
                <div className="flex-center">
                  {loading ? (
                    <Spinner />
                  ) : (
                    <span
                      className="text-red-500 cursor-pointer py-2"
                      onClick={loadMoreNotifications}
                    >
                      See more...
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p>No notifications to show</p>
          )}
        </div>
      )}
    </div>
  );
}
