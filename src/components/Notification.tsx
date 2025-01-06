'use client'

import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { format, isToday, isYesterday, differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';

export function Notification(props: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { notifications, markAllAsRead } = useNotifications();

  useEffect(() => {
    setUnreadCount(notifications.filter(notification => !notification.isRead).length);
  }, [notifications]);

  const handleBellClick = async () => {
    if (!isOpen) {
      await markAllAsRead();
    }
    setIsOpen(!isOpen);
  };

  const groupNotificationsByDate = () => {
    const sortedNotifications = [...notifications].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const groups: { [key: string]: typeof notifications } = {};
    
    sortedNotifications.forEach(notification => {
      let dateKey;
      const notificationDate = new Date(notification.timestamp);
      if (isToday(notificationDate)) {
        dateKey = 'Today';
      } else if (isYesterday(notificationDate)) {
        dateKey = 'Yesterday';
      } else {
        dateKey = format(notificationDate, 'dd/MM/yyyy');
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(notification);
    });
    
    return groups;
  };

  const formatNotificationMessage = (notification: typeof notifications[0]) => {
    switch (notification.type) {
      case 'TASK_MOVED':
        const fromStage = props?.stages.find((stage: { id: string }) => stage.id === notification.fromStage)?.title || 'Delete Stage';
        const toStage = props?.stages.find((stage: { id: string }) => stage.id === notification.toStage)?.title || 'Delete Stage';
        return `"${notification.taskTitle}" was moved from "${fromStage}" to "${toStage}"`;
      case 'TASK_ASSIGNED':
        return notification.message || 'New task assigned to you';
      case 'STATUS_UPDATE':
        return 'Task status updated';
      default:
        return notification.message;
    }
  };

  const getRelativeTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    const secondsAgo = differenceInSeconds(now, date);
    const minutesAgo = differenceInMinutes(now, date);
    const hoursAgo = differenceInHours(now, date);
    const daysAgo = differenceInDays(now, date);
    const monthsAgo = differenceInMonths(now, date);
    const yearsAgo = differenceInYears(now, date);

    if (secondsAgo < 30) return 'Just now';
    if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
    if (minutesAgo < 60) return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
    if (hoursAgo < 24) return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
    if (daysAgo === 1) return 'Yesterday';
    if (daysAgo < 30) return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
    if (monthsAgo < 12) return `${monthsAgo} month${monthsAgo === 1 ? '' : 's'} ago`;
    return `${yearsAgo} year${yearsAgo === 1 ? '' : 's'} ago`;
  };

  return (
    <div className="relative">
      <button 
        onClick={handleBellClick} 
        className="p-2 hover:bg-gray-100 rounded-full relative" 
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <h3 className="font-medium">Notifications</h3>
          </div>
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {Object.entries(groupNotificationsByDate()).map(([date, dateNotifications]) => (
              <div key={date} className="border-b last:border-b-0">
                <div className="px-4 py-2 bg-gray-50">
                  <h4 className="font-semibold text-sm text-gray-600">{date}</h4>
                </div>
                {dateNotifications.map((notification) => (
                  <div key={notification.id} className="p-4 hover:bg-gray-50">
                    <p className="text-sm">{formatNotificationMessage(notification)}</p>
                    <span className="text-xs text-gray-500">
                      {getRelativeTime(notification.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

