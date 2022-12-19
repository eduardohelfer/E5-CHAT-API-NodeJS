const Messages = require('../models/messages.models')
const Users = require('../models/users.models')
const Participants = require('../models/participants.models')

const uuid = require('uuid')

//! Requisito 6.c. i, ii, iii - Controladores
//* conversations/:conversation_id/participants/:participant_id/messages
const findAllMessages = async (conversationId) => {
    //* Reunir la lista de los participantId en la Conversation
    const participants = await Participants.findAll({
        where: {
            conversationId: conversationId
        },
        attributes: ['id']
    })

    //* Convertir la lista en un Array de participantId
    const participantsArray = participants.map(dat => (dat.id))

    //* Consultar todos los mensajes en orden de tiempo según createdAt
    const data = await Messages.findAll({
        where: {
            participantId: participantsArray
        },
        attributes: ['id', 'message', 'createdAt'],
        order: [
            ['createdAt', 'ASC']
        ],
        include: [{
            model: Participants,
            attributes: ['userId'],
            include: [{
                model: Users,
                attributes: ['firstName', 'lastName']
            }]
        }]
    })
    return data
}

const createMessage = async (obj) => {
    const data = await Messages.create({
        id: uuid.v4(),
        participantId: obj.participantId,
        message: obj.message
    })
    return data
}

//! Requisito 6.d. i, ii, iii - Controladores
//* conversations/:conversation_id/participants/:participant_id/messages/:message_id
const findMessageById = async (participant_id, message_id) => {
    //* Mostrar un mensaje en particular
    const data = await Messages.findOne({
        where: {
            id: message_id,
            participantId: participant_id
        },
        attributes: ['id', 'message', 'createdAt']
    })
    return data
}

const removeMessage = async (participant_id, message_id) => {
    //* Eliminar un mensaje en particular
    const data = await Messages.destroy({
        where: {
            id: message_id,
            participantId: participant_id
        }
    })
    return data
}

module.exports = {
    createMessage,
    findAllMessages,
    findMessageById,
    removeMessage
}

