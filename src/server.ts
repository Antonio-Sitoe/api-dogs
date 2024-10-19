import fastify from 'fastify'

const app = fastify()

app.get('/', () => {
  return 'Hello world'
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('server running in http://localhost:3333')
  })
