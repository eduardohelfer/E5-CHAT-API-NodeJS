const participantController = require('./participants.controller')

//! Ruta adicional de admin - Servicio
//* conversations/:conversation_id/me  
const getMyParticipantId = (req, res) => {
  const userId = req.user.id
  const conversationId = req.params.conversation_id
  participantController.findParticipantId(userId, conversationId)
    .then(data => {
      if (data) {
        res.status(200).json(data)
      } else {
        res.status(404).json({ message: 'Invalid IDs' })
      }
    })
    .catch(err => {
      res.status(400).json({ message: err.message })
    })
}

//! Reto Opcional a. I, II, III - Servicios
//* conversations/:conversation_id/participants
const getAllParticipants = (req, res) => {
  const userId = req.user.id
  const conversationId = req.params.conversation_id
  participantController.findAllParticipants(userId, conversationId)
    .then(data => {
      if (data) {
        res.status(200).json(data)
      } else {
        res.status(404).json({ message: 'Invalid IDs' })
      }
    })
    .catch(err => {
      res.status(400).json({ message: err.message })
    })
}

const postParticipant = (req, res) => {
  const userId = req.user.id
  const { invitedUserId } = req.body
  const conversationId = req.params.conversation_id
  participantController.createParticipant(userId, { invitedUserId, conversationId })
    .then(data => {
      if (data) {
        res.status(201).json(data)
      } else {
        res.status(406).json({ message: 'Invalid IDs' })
      }
    })
    .catch(err => {
      res.status(400).json({
        message: err.message, fields: {
          invitedUserId: 'UUID'
        }
      })
    })
}

//! Reto Opcional b. I, II, III - Servicios
//* conversations/:conversation_id/participants/:user_id
const getParticipant = (req, res) => {
  const conversationId = req.params.conversation_id
  const queriedUserId = req.params.user_id
  participantController.findParticipant(conversationId, queriedUserId)
    .then(data => {
      if (data) {
        res.status(200).json(data)
      } else {
        res.status(404).json({ message: 'Invalid IDs' })
      }
    })
    .catch(err => {
      res.status(400).json({ message: err.message })
    })
}

const deleteParticipant = (req, res) => {
  const userId = req.user.id
  const conversationId = req.params.conversation_id
  const expelledUserId = req.params.user_id
  participantController.removeParticipant(userId, conversationId, expelledUserId)
    .then(data => {
      if (data) {
        res.status(204).json()
      } else {
        res.status(404).json({ message: 'Invalid IDs' })
      }
    })
    .catch(err => { res.status(400).json({ message: err.message }) })
}

module.exports = {
  getMyParticipantId,
  getAllParticipants,
  postParticipant,
  getParticipant,
  deleteParticipant
}

