import { updateFollow, updateNotifReadStatus } from "@/lib/queries";
import { NotificationPayload } from "@/lib/types";
import { getNotificationDetails, minutesAgo } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

const Notification = ({
  notification,
  setOpen,
  setNotifications,
  setUnreadCount,
}: {
  notification: NotificationPayload;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setNotifications: Dispatch<SetStateAction<NotificationPayload[]>>;
  setUnreadCount: Dispatch<SetStateAction<number>>;
}) => {
  const { text, link } = getNotificationDetails(notification);

  const markRead = () => {
    setOpen(false);
    if (notification.isRead) return;
    setUnreadCount((prev) => prev - 1);
    updateNotifReadStatus(notification.id).then(() => {
      setNotifications((prev) =>
        prev.map((n) => {
          return n.id === notification.id ? { ...n, isRead: true } : n;
        })
      );
    });
  };

  const acceptFollowRequest = async () => {
    setUnreadCount((prev) => prev - 1);
    setNotifications((prev) =>
      prev.map((n) => {
        return n.id === notification.id
          ? { ...n, type: "FOLLOW", isRead: true }
          : n;
      })
    );
    await updateFollow(
      notification.id,
      notification.actorId,
      notification.recipientid
    );
  };

  return (
    <div className="border-b border-b-zinc-200 p-3 flex flex-2 gap-2 justify-between items-center text-zinc-600">
      <p className={clsx({ "font-semibold": !notification.isRead })}>{text}</p>
      <p className="flex items-center justify-end flex-1">
        <span className="mr-2 text-sm">
          {minutesAgo(notification.createdAt)}
        </span>
        {notification.type === "FOLLOW_REQUESTED" && (
          <Button
            variant="outline"
            className="mx-2"
            onClick={acceptFollowRequest}
          >
            Accept
          </Button>
        )}
        <Link href={link} className="font-semibold" onClick={markRead}>
          View
        </Link>
      </p>
    </div>
  );
};

export default Notification;
