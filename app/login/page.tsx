"use client";

/*
 * Login page for the admin interface.  This simple page prompts for a
 * username and password and stores an auth flag in localStorage when
 * credentials match preset values.  Upon successful login the user is
 * redirected to the admin editor.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // We rely on middleware Basic Auth to protect /admin. Redirect there
  // — the browser will prompt for credentials configured via env.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // direct navigation to /admin triggers Basic Auth prompt
      window.location.href = '/admin';
    }
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Fallback: redirect to /admin which will prompt for credentials
    if (typeof window !== 'undefined') window.location.href = '/admin';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
  <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold">Continue to Admin</button>
        </form>
      </div>
    </div>
  );
}