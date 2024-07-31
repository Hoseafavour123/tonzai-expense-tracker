import React, { createContext, useContext, ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import * as apiClient from '../api-client'

export interface Notification {
  _id: string
  message: string
  viewed: boolean
}

interface NotificationContextType {
    notifications: Notification[] | undefined
    deleteNotification: (id: string) => void;
    markAsViewed: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient();

    const { data: notifications, refetch } = useQuery(
      'notifications', apiClient.getNotification)

      const deleteMutation = useMutation('deleteNotification', apiClient.deleteNotification, {
        onSuccess: () => {
            queryClient.invalidateQueries('notifications')
        }
      })

    const deleteNotification = (id: string)  => {
        deleteMutation.mutate(id)
    }

    const markAsViewed = () => {
        notifications?.forEach((notification) => (notification.viewed = true));
        refetch()
    }

     return (
    <NotificationContext.Provider value={{ notifications, deleteNotification, markAsViewed }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context)
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    )
  return context
}
