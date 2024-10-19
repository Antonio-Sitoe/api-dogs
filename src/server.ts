import fastify from 'fastify'

const app = fastify()

app.get('/users', () => {
  return 'e'
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('server running in http://localhost:3333')
  })
