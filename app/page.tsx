"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  // Defensive: Only render UI on client to prevent hydration errors
  const [isClient, setIsClient] = React.useState(false);
  const { data: session } = useSession();
  const [form, setForm] = React.useState({ name: '', email: '', password: '' });
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => setIsClient(true), []);
  if (!isClient) return null;

  if (session) {
    return (
      <div>
        <h2>Welcome {session.user?.name}</h2>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful!');
        setForm({ name: '', email: '', password: '' });
      } else {
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      setMessage('Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Please Login</h2>
      <button onClick={() => signIn("github")} className="bg-blue-500 px-4 py-2 rounded">Login with GitHub</button>
      <button onClick={() => signIn("google")} className="bg-red-500 px-4 py-2 rounded">Login with Google</button>
      <hr className="my-4" />
      <h3>Or Sign Up</h3>
      <form onSubmit={handleSignup} className="flex flex-col gap-2 max-w-xs">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border px-2 py-1 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border px-2 py-1 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="border px-2 py-1 rounded"
        />
        <button type="submit" className="bg-green-600 px-4 py-2 rounded text-white" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
    </div>
  );
}