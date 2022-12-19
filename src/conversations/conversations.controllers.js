const uuid = require('uuid')

const Conversations = require('../models/conversations.models')
const Participants = require('../models/participants.models')
const Users = require('../models/users.models')

//! Requisito 6.a. i, ii, iii - Controladores
//* conversations
const findMyConversations = async (userId) => {
    const data = await Participants.findAll({
        where: {
            userId: userId
        },
        attributes: ['conversationId', 'id'],
        include: {
            model: Conversations,
            attributes: ['title'],
            include: {
                model: Participants,
                attributes: ['userId'],
                include: {
                    model: Users,
                    attributes: ['firstName', 'lastName']
                }
            }
        }
    })
    return data
}

const createConversation = async (obj) => {
    const newConversation = await Conversations.create({
        id: uuid.v4(),
        title: obj.title,
        imgUrl: obj.imgUrl,
        userId: obj.ownerId //? Creador de la conversacion (owner)
    })
    const participant1 = await Participants.create({
        id: uuid.v4(),
        userId: obj.ownerId, //? este es el owner que viene desde el token
        conversationId: newConversation.id
    })
    const participant2 = await Participants.create({
        id: uuid.v4(),
        userId: obj.participantId, //? Este es el otro usuario que viene desde el body
        conversationId: newConversation.id
    })

    return {
        newConversation,
        participant1,
        participant2
    }
}

//! Ruta adicional de admin - Controlador
//* conversations/admin
const findAllConversations = async () => {
    const data = await Conversations.findAll({
        include: {
            model: Participants,
            include: {
                model: Users
            }
        }
    })
    return data
}

//! Requisito 6.b. i, ii, iii - Controladores
//* conversations/:conversation_id  
const findConversationById = async (id) => {
    const data = await Conversations.findOne({
        where: {
            id: id
        },
        include: {
            model: Participants,
            attributes: {
                exclude: ['id', 'conversationId', 'createdAt', 'updatedAt']
            },
            include: {
                model: Users,
                attributes: {
                    exclude: ['id', 'password', 'createdAt', 'updatedAt']
                }
            }
        }


    })
    return data
}

const updateConversation = async (id, obj) => {
    const data = await Conversations.update(obj, {
        where: {
            id: id
        }
    })
    return data[0] //? array
    //?  [1] Se edito algo correctamente (si encontro el id)
    //? [0] No se edito nada (porque no encontro el id)
}

const removeConversation = async (id) => {
    const data = await Conversations.destroy({
        where: {
            id: id
        }
    })
    return data
}

module.exports = {
    findMyConversations,
    createConversation,
    findAllConversations,
    findConversationById,
    updateConversation,
    removeConversation
}
