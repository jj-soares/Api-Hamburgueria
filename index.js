const { request, response } = require('express')
const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())



const newClient = []


const idStatusCheck = (request, response, next) => {

    const { id } = request.params

    const index = newClient.findIndex(user => user.id === id)


    if (index < 0) {
        return response.status(404).json({ message: "User not found" })
    }

    request.orderIndex = index

    request.orderId = id


    next()

}

const requisiteMethod = (request, response, next) => {

    const method = request.method

    const url = request.url

    console.log(`Metodo de requisição: ${method}. URL da requisição http://localhost:300${url}`)

    next()

}



app.get('/order', requisiteMethod,(request, response) => {
    // caminho para mostrar os usuarios cadastrados 
    return response.json(newClient)
})


app.post('/order', requisiteMethod, (request, response) => {
    // caminho para incluir um novo usuario
    const { order, clientName, price, status } = request.body

    const user = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    newClient.push(user)

    return response.status(201).json(user)
})

app.put('/order/:id', idStatusCheck, requisiteMethod,(request, response) => {
    // caminho para Atualizar o pedido dos clientes 
    const { order, clientName, price } = request.body

    const id = request.orderId

    const index = request.orderIndex

    const uptadeUser = { id, order, clientName, price }

    newClient[index] = uptadeUser

    return response.json(uptadeUser)

})

app.delete('/order/:id', idStatusCheck, requisiteMethod,(request, response) => {
    // caminho para Deletar um pedido do usuario 

    const index = request.orderIndex

    newClient.splice(index, 1)

    return response.status(204).json()

})


app.get('/order/:id', idStatusCheck, requisiteMethod, (request, response) => {
    // caminho para mostrar os usuarios cadastrados 

    const index = request.orderIndex

    const order = newClient[index]

    return response.json(order)
})

app.patch('/order/:id', idStatusCheck, requisiteMethod, (request, response) => {
    
    const {id} = request.params

    const index = newClient.findIndex(user => user.id === id)

    newClient[index].status = "Pronto"

    return response.json(newClient[index])
})








app.listen(port, () => {
    console.log(`🚀 Server starded on port ${port}`)
})

