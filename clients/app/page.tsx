/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { FC, useState } from 'react'
import { useRouter } from 'next/navigation'
import { io } from 'socket.io-client'


interface pageProps {}

const socket = io('https://draw-and-guess-0958.onrender.com')


const page: FC<pageProps> = ({}) => {
  const router = useRouter()
  const [teamId, setTeamId] = useState('');

  const generateTeamId = () => {
    // Generate a unique team ID (e.g., using UUID)
    const newTeamId = generateRandomId(); // Call the function to generate a random ID
    setTeamId(newTeamId);
    
  };

  const joinTeam = () => {
    socket.emit('team-joined', teamId);
    router.push(`/team/${teamId}`);
  };

  // Function to generate a random alphanumeric ID
  const generateRandomId = () => {
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newId = '';
    for (let i = 0; i < 8; i++) {
      newId += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
    }
    return newId;
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl mb-8">Welcome to the Drawing Game</h1>
      <img src="welcome.jpg" alt="Welcome" className="mb-8" width={400} height={400} />
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl">Team ID</h2>
        <input
          type="text"
          className="p-2 rounded-md border border-black"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          placeholder="Enter team ID or generate"
        />
        <div className="flex gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={joinTeam}
            disabled={!teamId.trim()}
          >
            Join Team
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={generateTeamId}
          >
            Generate Team ID
          </button>
        </div>
      </div>
    </div>
  )
}

export default page
