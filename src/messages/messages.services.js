const messageController = require('./messages.controllers')

//! Requisito 6.c. i, ii, iii - Servicios
//* conversations/:conversation_id/participants/:participant_id/messages
const getAllMessages = (req, res) => {
    const conversationId = req.params.conversation_id
    messageController.findAllMessages(conversationId)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(400).json({ message: err.message })
        })
}

const postMessage = (req, res) => {
    const participantId = req.params.participant_id
    const { message } = req.body
    messageController.createMessage({ participantId, message })
        .then(data => {
            res.status(201).json(data)
        })
        .catch(err => {
            res.status(400).json({
                message: err.message, fields: {
                    message: 'text'
                }
            })
        })
}


//! Requisito 6.d. i, ii, iii - Servicios
//* conversations/:conversation_id/participants/:participant_id/messages/:message_id
const getMessageById = (req, res) => {
    const { participant_id, message_id } = req.params
    messageController.findMessageById(participant_id, message_id)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(400).json({ message: err.message, fields: { messageId: 'UUID' } })
        })
}

const deleteMessage = (req, res) => {
    const { participant_id, message_id } = req.params
    messageController.removeMessage(participant_id, message_id)
        .then(data => {
            if (data) {
                res.status(204).json()
            } else {
                res.status(404).json({ message: 'Invalid IDs' })
            }
        })
        .catch(err => {
            res.status(400).json({ message: err.message })
        })
}

module.exports = {
    postMessage,
    getAllMessages,
    getMessageById,
    deleteMessage
}





