'use client';

import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function SignupButton() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const res = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('✅ Signup successful:', data);
        // TODO: redirect or show success message
      } else {
        console.error('❌ Signup failed:', data.message);
      }
    } catch (err) {
      console.error('⚠️ Error during signup:', err);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 mb-12">
      {/* Username Input */}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {/* Password Input */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Submit Button */}
      <button
        onClick={handleSignup}
        className="inline-flex items-center justify-center rounded-full text-md font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 px-8 py-3.5 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transform hover:scale-105"
      >
        Get Started - It's Free
        <ChevronRight className="w-5 h-5 ml-2 transition-all duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
}
