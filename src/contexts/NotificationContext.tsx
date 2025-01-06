'use client'

import {  toast } from 'react-toastify';
import { APIService } from '../services/apiService';
import type { NotificationType } from '../types/types';
import { createContext, useContext, useState, useEffect } from 'react';

interface NotificationContextType {
  markAllAsRead: () => void;
  notifications: Array<NotificationType>;
  addNotification: (notification: Omit<NotificationType, 'id' | 'timestamp'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationType[]>([])  
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const NotificationResponse = await APIService.getNotifications();
        if (NotificationResponse.ok) {
          const notificationData = await NotificationResponse.json();
          setNotifications(notificationData?.data?.notifications);
          return;
        }
        
        setNotifications([]);
      } catch (error: any) {
        toast.warning('Error', error);
        console.error('Error fetching stages and tasks:', error);
      }
    };

    fetchNotifications();
  }, []);
  
  const addNotification = async (notification: Omit<NotificationType, 'id' | 'timestamp'>) => {
    try {
      const response = await APIService.createNotification({ ...notification, timestamp: new Date() });
      if (response.ok) {
        const notificationData = await response.json();
        setNotifications(prev => [notificationData?.data?.notification, ...prev]);
      };
    } catch (error: any) {
      toast.error('Error', error);
      console.error('Error adding notification:', error);
    }
  };


  const markAllAsRead = async () => {
    try {
      const NotificationResponse = await APIService.updateNotification();
      if (NotificationResponse.ok) {
        const notificationData = await NotificationResponse.json();
        setNotifications(notificationData?.data?.notifications);
        return;
      }
      
      setNotifications([]);
    } catch (error: any) {
      toast.warning('Error', error);
      console.error('Error fetching stages and tasks:', error);
    }
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }

  return context
}
