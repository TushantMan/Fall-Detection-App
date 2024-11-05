import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../components/login';  // Adjust path based on your file structure
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';

// Mock firebase/auth module
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),  // Mocking the signInWithEmailAndPassword function
}));

// Mock toast notifications
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../components/signInWithGoogle', () => () => <div>Google SignIn Component</div>);

describe('Login Component', () => {
  
  beforeEach(() => {
    // Clear mocks before each test
    signInWithEmailAndPassword.mockClear();
    toast.success.mockClear();
    toast.error.mockClear();
  });

  it('renders the login form correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Check for form elements
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login now')).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Google SignIn Component')).toBeInTheDocument();
  });

  it('updates email and password input fields', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Get input elements
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    // Simulate typing in the input fields
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Check that the input values have been updated
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('calls handleSubmit and shows success toast on valid login', async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { email: 'test@example.com' },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    
    // Simulate form submission
    fireEvent.click(screen.getByText('Login now'));

    // Ensure signInWithEmailAndPassword is called
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password123');
    
    // Wait for the success toast to be called
    await screen.findByText(/User logged in Successfully/i);
    expect(toast.success).toHaveBeenCalledWith('User logged in Successfully', { position: 'top-center' });
  });

  it('shows an error toast on login failure', async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    
    // Simulate form submission
    fireEvent.click(screen.getByText('Login now'));

    // Ensure signInWithEmailAndPassword is called
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password123');
    
    // Wait for the error toast to be called
    await screen.findByText(/Invalid credentials/i);
    expect(toast.error).toHaveBeenCalledWith('Invalid credentials', { position: 'bottom-center' });
  });

  it('navigates to the main page when clicking "Go to Main Page"', () => {
    const mockNavigate = jest.fn();
    render(
      <BrowserRouter>
        <Login navigate={mockNavigate} />
      </BrowserRouter>
    );

    // Simulate button click
    fireEvent.click(screen.getByText('Go to Main Page'));

    // Check if navigation is triggered
    expect(mockNavigate).toHaveBeenCalledWith('/landing-page');
  });
});
