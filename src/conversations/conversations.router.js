const router = require('express').Router()
const conversationServices = require('./conversations.services')
const participantServices = require('../participants/participants.services')
const messageServices = require('../messages/messages.services')
const passportJWT = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
// const participantValidate = require('../middlewares/participantValidate.middleware')

//! Requisito 6.a. i, ii, iii
//* Ruta con la lista de conversaciones en las que participa el usuario logueado & crea conversaciones nuevas
//* conversations
router.route('/')
    .get(passportJWT.authenticate('jwt', { session: false }), conversationServices.getMyConversations)
    .post(passportJWT.authenticate('jwt', { session: false }), conversationServices.postConversation)

//! Ruta adicional de admin
//* Ruta solo para adminsitradores que enlista todas las conversaciones existentes
//* conversations/admin
router.route('/admin')
    .get(passportJWT.authenticate('jwt', { session: false }), roleMiddleware, conversationServices.getAllConversations)

//! Requisito 6.b. i, ii, iii
//* Ruta con información de una conversación de en específico. Modificar y borrar conversaciones está restringido a usuarios admin
//* conversations/:conversation_id  
router.route('/:conversation_id')
    .get(passportJWT.authenticate('jwt', { session: false }), conversationServices.getConversationById)
    .patch(passportJWT.authenticate('jwt', { session: false }), roleMiddleware, conversationServices.patchConversation)
    .delete(passportJWT.authenticate('jwt', { session: false }), roleMiddleware, conversationServices.deleteConvesation)

//! Ruta adicional de admin
//* Ruta que acredita al participante de una conversación y entrea el participant_id correspondiente
//* conversations/:conversation_id/me  
router.route('/:conversation_id/me')
    .get(passportJWT.authenticate('jwt', { session: false }), participantServices.getMyParticipantId)

//! Reto Opcional a. I, II, III
//* Ruta que entrega la lista de participantes de una conversación solo si el usuario que la requirere es uno de ellos 
//* conversations/:conversation_id/participants
router.route('/:conversation_id/participants')
    .get(passportJWT.authenticate('jwt', { session: false }), participantServices.getAllParticipants)
    .post(passportJWT.authenticate('jwt', { session: false }), participantServices.postParticipant)

//! Reto Opcional b. I, II, III
//* Ruta de un participante en específico.  Solo el dueño (owner) de una conversación puede expulsar a un participante
//* conversations/:conversation_id/participants/:user_id
router.route('/:conversation_id/participants/:user_id')
    .get(passportJWT.authenticate('jwt', { session: false }), participantServices.getParticipant)
    .delete(passportJWT.authenticate('jwt', { session: false }), participantServices.deleteParticipant)

//! Requisito 6.c. i, ii, iii
//* Ruta de mensajes solo accede el usuario logueado y además, la ruta ha de incluir la propia participant_id
//* conversations/:conversation_id/participants/:participant_id/messages
router.route('/:conversation_id/participants/:participant_id/messages')
    .get(passportJWT.authenticate('jwt', { session: false }), messageServices.getAllMessages)
    .post(passportJWT.authenticate('jwt', { session: false }), messageServices.postMessage)

//! Requisito 6.d. i, ii, iii
//* Ruta de un mensaje en particular
//* conversations/:conversation_id/participants/:participant_id/messages/:message_id
router.route('/:conversation_id/participants/:participant_id/messages/:message_id')
    .get(passportJWT.authenticate('jwt', { session: false }), messageServices.getMessageById)
    .delete(passportJWT.authenticate('jwt', { session: false }), messageServices.deleteMessage)
//*

module.exports = router

//* Ruta Sustituida por '/:conversation_id/:participant_id/messages'
/*
router.route('/:conversation_id/messages')
    .post(passportJWT.authenticate('jwt', { session: false }), participantValidate, messageServices.postMessage)
*/
