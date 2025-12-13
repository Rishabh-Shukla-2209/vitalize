"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";
import { useUser } from "@clerk/nextjs";
import { Cursor, NotificationPayload } from "@/lib/types";
import Icons from "../icons/appIcons";
import {
  getNotifications,
  getUnreadNotificationCount,
} from "@/lib/actions/user";
import Notification from "./Notification";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { getNotificationDetails, handleAppError } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

export function NotificationsList() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [cursor, setCursor] = useState<Cursor>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications(null);
        if (res && res.length > 0) {
          setNotifications(res);
          setCursor({
            createdAt: res[res.length - 1].createdAt,
            id: res[res.length - 1].id,
          });
        }
        if (res && res.length === 20) setHasMore(true);
      } catch (err) {
        handleAppError(err);
      }
    };

    const fetchUnreadCount = async () => {
      try {
        const res = await getUnreadNotificationCount();
        setUnreadCount(res!);
      } catch (err) {
        handleAppError(err);
      }
    };

    if (!user) return;

    fetchNotifications();
    fetchUnreadCount();

    const channelName = `private-user-${user.id}`;
    const channel = pusherClient.subscribe(channelName);

    channel.bind("notification:new", (payload: NotificationPayload) => {
      setNotifications((prev) => [payload, ...prev]);
      setUnreadCount((prev) => prev + 1);
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
    try {
      const res = await getNotifications(cursor);
      setNotifications((prev) => [...prev, ...res!]);
      setCursor({
        createdAt: res![res!.length - 1].createdAt,
        id: res![res!.length - 1].id,
      });
      if (res!.length === 20) setHasMore(true);
      else setHasMore(false);
      setLoading(false);
    } catch (err) {
      handleAppError(err);
    }
  };

  return (
    <div className="relative">
      <Icons.bell
        fill="white"
        className="cursor-pointer text-gray-500 dark:text-white hover:text-gray-900"
        onClick={() => setOpen((prev) => !prev)}
      />{" "}
      {unreadCount > 0 && (
        <Badge variant="secondary" className="absolute -top-3 -right-3 -z-1">
          {unreadCount}
        </Badge>
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "200%" }}
            animate={{ x: 0 }}
            exit={{ x: "200%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={clsx(
              // MOBILE FIRST (full screen drawer)
              "fixed inset-0 h-full max-w-full bg-zinc-50 dark:bg-sage-400 p-4 z-50 overflow-y-auto",

              // DESKTOP (md+) OVERRIDE → absolute small panel
              "md:absolute md:top-12 md:right-1 md:inset-auto md:w-auto md:h-auto md:min-w-80 md:max-h-125 md:rounded-md md:p-1 md:shadow-xl",
            )}
          >
            <div>
              <div className="flex justify-between p-2 border-b border-b-zinc-400 dark:border-sage-700">
                <h3>Notifications</h3>
                <Icons.uncheck
                  onClick={() => setOpen(false)}
                  className="cursor-pointer"
                />
              </div>
              {notifications.length > 0 ? (
                <>
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
                          className="text-primary cursor-pointer py-2"
                          onClick={loadMoreNotifications}
                        >
                          See more...
                        </span>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="p-4">No notifications to show</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
