// notificationContext.js
import React, { createContext, useState, useCallback, useEffect } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState(() => {
        const savedNotifications = localStorage.getItem('notifications');
        return savedNotifications ? JSON.parse(savedNotifications) : [];
    });
    const [isPushEnabled, setIsPushEnabled] = useState(() => {
        return Notification.permission === 'granted';
    });

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = useCallback((message) => {
        setNotifications(prevNotifications => [
            ...prevNotifications,
            { message, timestamp: new Date().toISOString() }
        ]);
        if (isPushEnabled) {
            showPushNotification(message);
        }
    }, [isPushEnabled]);

    const clearNotification = useCallback((index) => {
        setNotifications(prevNotifications =>
            prevNotifications.filter((_, i) => i !== index)
        );
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const togglePushNotifications = useCallback(async () => {
        if (isPushEnabled) {
            setIsPushEnabled(false);
        } else {
            const permission = await Notification.requestPermission();
            setIsPushEnabled(permission === 'granted');
        }
    }, [isPushEnabled]);

    const showPushNotification = (message) => {
        if (!('Notification' in window)) {
            console.log('This browser does not support desktop notification');
        } else if (Notification.permission === 'granted') {
            const options = {
                body: message,
                icon: process.env.PUBLIC_URL + '/fall-alert.png'
            };
            new Notification('Fall Detection Alert', options);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            addNotification,
            clearNotification,
            clearAllNotifications,
            notificationCount: notifications.length,
            isPushEnabled,
            togglePushNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};