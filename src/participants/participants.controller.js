const uuid = require('uuid')

const Conversations = require('../models/conversations.models')
const Participants = require('../models/participants.models')
const Users = require('../models/users.models')

//! Ruta adicional de admin - Controlador
//* conversations/:conversation_id/me 
const findParticipantId = async (user_id, conversation_id) => {
    const data = await Participants.findOne({
        where: {
            userId: user_id,
            conversationId: conversation_id
        },
        attributes: ['id']
    })
    return data
}

//! Reto Opcional a. I, II, III - Servicios
//* conversations/:conversation_id/participants
const findAllParticipants = async (userId, conversationId) => {
    //* Verifica que el usuario que consulta la lista está incluido y es un participante
    const checkUserId = await Participants.findOne({
        where: {
            userId: userId,
            conversationId: conversationId
        }
    })
    if (checkUserId) {    //* Solo si es un participante tendrá acceso a la lista
        const data = await Participants.findAll({
            where: {
                conversationId: conversationId
            },
            attributes: ['userId'],
            include: {
                model: Users,
                attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt'] }
            }
        })
        return data
    }
    return null   //* Si el userId no está incluido se negará el acceso a la información
}

const createParticipant = async (userId, obj) => {
    //* Verifica que el usuario que ordena agregar un participante y es, a su vez, un participante de la conversación
    const userIsParticipant = await Participants.findOne({
        where: {
            userId: userId,
            conversationId: obj.conversationId
        }
    })
    //* Verifica que el usuario candidato a participar no se encuentra aún incorporado a la conversación
    const invitedIsUser = await Users.findOne({
        where: {
            id: obj.invitedUserId
        }
    })
    const invitedIsParticipant = await Participants.findOne({
        where: {
            userId: obj.invitedUserId,
            conversationId: obj.conversationId
        }
    })
    if (userIsParticipant && invitedIsUser && !invitedIsParticipant) {
        const data = await Participants.create({
            id: uuid.v4(),
            userId: obj.invitedUserId,
            conversationId: obj.conversationId
        })
        return data
    }
    return null //* No se cumplen las condiciones necesarias para agregar al usuario invitado como participante
}

//! Reto Opcional b. I, II, III - Controladores
//* conversations/:conversation_id/participants/:user_id
const findParticipant = async (conversationId, queriedUserId) => {
    const data = await Participants.findOne({
        where: {
            userId: queriedUserId,
            conversationId: conversationId
        },
        attributes: {
            exclude: ['id']
        },
        include: {
            model: Users,
            attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt'] }
        }
    })
    return data
}

const removeParticipant = async (userId, conversationId, expelledUserId) => {
    //* Verifica que el usuario que ordena eliminar un participante es el dueño de la conversación
    const conversation = await Conversations.findOne({
        where: {
            id: conversationId,
        }
    })
    if (conversation.userId === userId) {
        //* Verifica que el usuario a ser expulsado es un participante de la conversación y encuentra su participantId
        const expelled = await Participants.findOne({
            where: {
                userId: expelledUserId,
                conversationId: conversationId
            },
            attributes: ['id']
        })
        if (expelled) {
            const expelledParticipantId = expelled.id
            const data = await Participants.destroy({
                where: {
                    id: expelledParticipantId
                }
            })
            return data
        }
    }
    return null //* No se cumplen las condiciones necesarias para elimenar al participante de la conversación
}

module.exports = {
    //  findParticipantConversations
    findParticipantId,
    findAllParticipants,
    createParticipant,
    findParticipant,
    removeParticipant
}


//* Esta función se dejó de emplear junto con el middleware participantValidate
/*
const findParticipantConversations = async (userId, conversationId) => {
    const data = await Participants.findOne({
        where: {
            userId: userId,
            conversationId: conversationId
        },
    })
    return data
}
*/