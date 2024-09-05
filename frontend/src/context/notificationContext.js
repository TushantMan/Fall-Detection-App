import React, { createContext, useState, useCallback, useEffect } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState(() => {
        const savedNotifications = localStorage.getItem('notifications');
        return savedNotifications ? JSON.parse(savedNotifications) : [];
    });

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = useCallback((message) => {
        setNotifications(prevNotifications => [
            ...prevNotifications,
            { message, timestamp: new Date().toISOString() }
        ]);
    }, []);

    const clearNotification = useCallback((index) => {
        setNotifications(prevNotifications => 
            prevNotifications.filter((_, i) => i !== index)
        );
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            addNotification, 
            clearNotification, 
            clearAllNotifications,
            notificationCount: notifications.length
        }}>
            {children}
        </NotificationContext.Provider>
    );
};