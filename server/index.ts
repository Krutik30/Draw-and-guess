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

  socket.on('team-joined', (teamId: string) => {
    console.log(`Socket ${socket.id} joining team ${teamId}`);
    socket.join(teamId)
  })

  // socket.on('team-check', (teamId: string) => {
  //   console.log(teamId)
  //   io.to(teamId).emit('team-check-from-server'); 
  // })

  socket.on('client-ready', (teamId: string) => {
    socket.broadcast.emit('get-canvas-state')
  })

  socket.on('canvas-state', (state, teamId: string) => {
    socket.broadcast.emit('canvas-state-from-server', state)
  })

  socket.on('draw-line', ({ prevPoint, currentPoint, color }: DrawLine, teamId: string) => {
    socket.broadcast.emit('draw-line', { prevPoint, currentPoint, color })
  })

  socket.on('clear', (teamId) => io.to(teamId).emit('clear')) 


  io.on('disconnect', (socket) => {
    console.log(`Socket ${socket.id} disconnected`)
  })
})

server.listen(3001, () => {
  console.log('✔️ Server listening on port 3001')
})
