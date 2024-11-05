import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, ThemeContext } from '../context/themeContext';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock document.documentElement.classList
const classListMock = {
  add: jest.fn(),
  remove: jest.fn(),
  toggle: jest.fn(),
  contains: jest.fn((cls) => cls === 'light-mode'),
};

Object.defineProperty(document.documentElement, 'classList', {
  value: classListMock,
});

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    localStorageMock.clear();
    classListMock.add.mockClear();
    classListMock.remove.mockClear();
    classListMock.toggle.mockClear();
    classListMock.contains.mockClear();
  });

  it('should default to dark mode when no saved theme is found in localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {({ isDarkMode }) => <div>Current mode: {isDarkMode ? 'Dark' : 'Light'}</div>}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    // Verify dark mode is default
    expect(screen.getByText(/Current mode: Dark/i)).toBeInTheDocument();
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', JSON.stringify(true)); // Dark mode is saved in localStorage
  });

  it('should apply light mode if saved in localStorage', () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(false)); // Set saved theme to light mode

    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {({ isDarkMode }) => <div>Current mode: {isDarkMode ? 'Dark' : 'Light'}</div>}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    // Verify light mode is applied
    expect(screen.getByText(/Current mode: Light/i)).toBeInTheDocument();
    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
  });

  it('should toggle theme between dark and light modes', () => {
    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {({ isDarkMode, toggleTheme }) => (
            <div>
              <div>Current mode: {isDarkMode ? 'Dark' : 'Light'}</div>
              <button onClick={toggleTheme}>Toggle Theme</button>
            </div>
          )}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    // Initially in dark mode
    expect(screen.getByText(/Current mode: Dark/i)).toBeInTheDocument();

    // Click to toggle to light mode
    fireEvent.click(screen.getByText(/Toggle Theme/i));
    expect(screen.getByText(/Current mode: Light/i)).toBeInTheDocument();
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', JSON.stringify(false));

    // Click again to toggle back to dark mode
    fireEvent.click(screen.getByText(/Toggle Theme/i));
    expect(screen.getByText(/Current mode: Dark/i)).toBeInTheDocument();
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', JSON.stringify(true));
  });

  it('should add or remove the "light-mode" class from the document based on theme', () => {
    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {({ toggleTheme }) => <button onClick={toggleTheme}>Toggle Theme</button>}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    // Initially in dark mode, "light-mode" should not be added
    expect(classListMock.toggle).toHaveBeenCalledWith('light-mode', false);

    // Toggle to light mode
    fireEvent.click(screen.getByText(/Toggle Theme/i));
    expect(classListMock.toggle).toHaveBeenCalledWith('light-mode', true);

    // Toggle back to dark mode
    fireEvent.click(screen.getByText(/Toggle Theme/i));
    expect(classListMock.toggle).toHaveBeenCalledWith('light-mode', false);
  });
});


