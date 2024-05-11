const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)

import { Server, Socket } from 'socket.io'
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

type Point = { x: number; y: number }

type DrawLine = {
  prevPoint: Point | null
  currentPoint: Point
  color: string
}

io.on('connection', (socket) => {
  socket.on('client-ready', (teamId: string) => {
    io.sockets.in(teamId).emit('get-canvas-state')
  })

  socket.on('canvas-state', (state, teamId: string) => {
    io.sockets.in(teamId).emit('canvas-state-from-server', state)
  })

  socket.on('draw-line', ({ prevPoint, currentPoint, color }: DrawLine, teamId: string) => {
    io.sockets.in(teamId).emit('draw-line', { prevPoint, currentPoint, color })
  })

  socket.on('team-joined', (teamId: string) => {
    console.log(`Socket ${socket.id} joining team ${teamId}`);
    socket.join(teamId)
  })

  socket.on('clear', (teamId) => io.to(teamId).emit('clear')) 
})

server.listen(3001, () => {
  console.log('✔️ Server listening on port 3001')
})
