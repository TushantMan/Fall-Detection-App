import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../components/dashboard'; // Adjust path based on your project structure
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { NotificationContext } from '../context/notificationContext';
import { ThemeContext } from '../context/themeContext';

// Mock external dependencies
jest.mock('axios');

// Mock the Notification Context and Theme Context
const mockAddNotification = jest.fn();
const mockNotificationContext = {
  addNotification: mockAddNotification,
  notificationCount: 2
};

const mockThemeContext = {
  isDarkMode: false
};

describe('Dashboard Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <NotificationContext.Provider value={mockNotificationContext}>
          <ThemeContext.Provider value={mockThemeContext}>
            <Dashboard />
          </ThemeContext.Provider>
        </NotificationContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('fetches and displays devices', async () => {
    const mockDevices = [
      { id: 'device1', name: 'Device 1' },
      { id: 'device2', name: 'Device 2' },
    ];

    // Mock the axios get call for devices
    axios.get.mockResolvedValueOnce({ data: mockDevices });

    render(
      <BrowserRouter>
        <NotificationContext.Provider value={mockNotificationContext}>
          <ThemeContext.Provider value={mockThemeContext}>
            <Dashboard />
          </ThemeContext.Provider>
        </NotificationContext.Provider>
      </BrowserRouter>
    );

    // Wait for devices to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('Device 1')).toBeInTheDocument();
      expect(screen.getByText('Device 2')).toBeInTheDocument();
    });
  });

  it('handles sidebar toggle', () => {
    render(
      <BrowserRouter>
        <NotificationContext.Provider value={mockNotificationContext}>
          <ThemeContext.Provider value={mockThemeContext}>
            <Dashboard />
          </ThemeContext.Provider>
        </NotificationContext.Provider>
      </BrowserRouter>
    );

    // Sidebar is initially closed
    expect(screen.queryByText('Search')).not.toBeVisible();

    // Click the hamburger menu to open sidebar
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));

    // Sidebar should be visible now
    expect(screen.getByText('Search')).toBeVisible();
  });

  it('triggers notification when a new fall is detected', async () => {
    const mockLatestDataPoint = { id: 'data1', value: 7, area: 'Room 101' };
    const mockSelectedDevice = { id: 'device1', name: 'Device 1' };

    // Mock the axios get call for fetching the latest data point
    axios.get.mockResolvedValueOnce({ data: mockLatestDataPoint });

    render(
      <BrowserRouter>
        <NotificationContext.Provider value={mockNotificationContext}>
          <ThemeContext.Provider value={mockThemeContext}>
            <Dashboard />
          </ThemeContext.Provider>
        </NotificationContext.Provider>
      </BrowserRouter>
    );

    // Simulate a new data point being fetched and processed
    await waitFor(() => {
      expect(mockAddNotification).toHaveBeenCalledWith(
        'New fall detected by Device 1 in Room 101',
        mockLatestDataPoint
      );
    });
  });

  it('applies dark mode based on ThemeContext', () => {
    const mockDarkThemeContext = {
      isDarkMode: true
    };

    render(
      <BrowserRouter>
        <NotificationContext.Provider value={mockNotificationContext}>
          <ThemeContext.Provider value={mockDarkThemeContext}>
            <Dashboard />
          </ThemeContext.Provider>
        </NotificationContext.Provider>
      </BrowserRouter>
    );

    // Check if dark mode class is applied
    expect(screen.getByRole('heading', { name: /dashboard/i }).closest('div')).toHaveClass('dark-mode');
  });
});
