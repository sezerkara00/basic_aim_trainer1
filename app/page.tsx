'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleStartClick = () => {
    if (username.trim()) {
      router.push(`/game?username=${encodeURIComponent(username)}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen text-black text-4xl">
      <div className="mb-6">Aim Trainer</div>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-4 px-2 py-2 border rounded-lg"
      />
      <button 
        type="button" 
        onClick={handleStartClick}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Start
      </button>
    </div>
  );
}
