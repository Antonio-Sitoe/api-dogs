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
    return response.writeHead(201).end()
  }
  return response.end('Hello Ignite')
})
/*
 Rotas sao caminhos de entrada dentro da nossa API
 podemos

 Apartir das rotas podemos 
 ter acesso a recursos do backend

 Metodo e URL
 GET -> Busca uma informacao do backend
 POST -> Cria um recurso no backend
 PATCH -> Principalmente quando queremos atualizar uma informacao unica e especifica no backend,altera uma informaca muito especifica ali dentro
 PUT -> Editar e atualizar um recurso no backend, (todo recurso, uma entidade por completa) 
 DELETE -> Apagar uma ocorrencia no banco de dados

 DENTRO DO BACKEND
 podemos ter duas rotas

 GET - /users - buscar usuarios no backend
 POST - /users - criar um usuario no backend


 HTTP STATUS CODE

 Varios tipos de codigos numericos que podemos enviar ou comunicar ao frontend o estado da requisicao, tem muita importancia semantica na comunicacao entre frontend e backend.

 100 - 109 - estados informativos, 
 200 - 299 - Sucesso, 200 e um padrao e quer dizer "OK"
 300 - 399 - redirect, redirecionamento de uma rota para (301, 302)
 400 - 499 - Client Error response error, retorna um erro do cliente, quando o frontend responde errado
 500 - 599 - Quando tem um erro de servidor, sao erros inexperados, podem  existir varios erros

*/

server.listen(3333)
