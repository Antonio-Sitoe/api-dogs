import http from 'node:http'
// CommonJs => require

const users = []

const server = http.createServer((request, response) => {
  const { method, url } = request
  console.log('Server is running', method, url)

  if (method === 'GET' && url === '/users') {
    return response
      .setHeader('Content-type', 'application/json')
      .end(JSON.stringify(users))
  }
  if (method === 'POST' && url === '/users') {
    users.push({
      id: 1,
      name: 'John Doe',
      email: 'jonhdoe@ex.com',
    })
    return response.end('Criacao de usuario')
  }
  return response.end('Hello Ignite')
})
/*
 Rotas sao caminhos de entrada dentro da nossa API
 Metodo e URL
 GET -> Busca uma informacao do backend
 POST -> Cria um recurso no backend
 PATCH -> Principalmente quando queremos atualizar uma informacao unica e especifica no backend
 PUT -> Editar e atualizar um recurso no backend
 DELETE -> Apagar uma ocorrencia no banco de dados
*/

server.listen(3333)

console.log('ssssssss')
