const Users = require('./users.models')
const RecoveryPasswords = require('./recoveryPasswords.models')
const Conversations = require('./conversations.models')
const Messages = require('./messages.models')
const Participants = require('./participants.models')

const initModels = () => {
    //? FK = RecoveryPasswords
    Users.hasMany(RecoveryPasswords)
    RecoveryPasswords.belongsTo(Users)

    //? users - conversations
    Users.hasMany(Conversations)
    Conversations.belongsTo(Users)

    //? usuarios - participaciones tabla pivote entre users - conversations
    Users.hasMany(Participants)
    Participants.belongsTo(Users)

    //? conversataions - participants tabla pivote entre users - conversations
    Conversations.hasMany(Participants)
    Participants.belongsTo(Conversations)

    //* Participants 1:M con Messages
    Participants.hasMany(Messages)
    Messages.belongsTo(Participants)
}

module.exports = initModels

/*
...
    //? users - messages
    Users.hasMany(Messages)
    Messages.belongsTo(Users)

    //? conversations - messages
    Conversations.hasMany(Messages)
    Messages.belongsTo(Conversations)
...
*/