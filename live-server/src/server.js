import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { generateGuest } from './guest-generator.js'

const PORT = 3333

const httpServer = createServer()

const io = new Server(httpServer, {
  cors: { origin: '*' },
})

io.on('connection', (socket) => {
  console.log(`[+] client connected    id=${socket.id}`)

  const interval = setInterval(() => {
    const customer = generateGuest()
    socket.emit('new-customer', customer)
    console.log(`[>] new-customer emitted  ${customer.id} ${customer.name}`)
  }, 3000)

  socket.on('disconnect', () => {
    clearInterval(interval)
    console.log(`[-] client disconnected id=${socket.id}`)
  })
})

httpServer.listen(PORT, () => {
  console.log(`live-server running on http://localhost:${PORT}`)
})
