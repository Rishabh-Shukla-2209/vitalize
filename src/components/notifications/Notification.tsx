import { NotificationPayload } from "@/lib/types";
import {
  getNotificationDetails,
  handleAppError,
  minutesAgo,
} from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { updateNotifReadStatus, updateFollow } from "@/lib/actions/user";

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
    updateNotifReadStatus(notification.id)
      .then(() => {
        setNotifications((prev) =>
          prev.map((n) => {
            return n.id === notification.id ? { ...n, isRead: true } : n;
          })
        );
      })
      .catch((err) => {
        handleAppError(err);
        setNotifications((prev) =>
          prev.map((n) => {
            return n.id === notification.id ? { ...n, isRead: false } : n;
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
    try {
      await updateFollow(notification.id, notification.recipientid);
    } catch (error) {
      handleAppError(error);
      setNotifications((prev) =>
        prev.map((n) => {
          return n.id === notification.id
            ? { ...n, type: "FOLLOW_REQUESTED", isRead: false }
            : n;
        })
      );
    }
  };

  return (
    <div className="border-b border-b-zinc-200 dark:border-b-sage-700 p-3 flex flex-col flex-2 gap-2 text-zinc-600">
      <p className={clsx({ "font-semibold": !notification.isRead })}>{text}</p>
      <p className="flex items-center">
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
