const { DataTypes } = require('sequelize')
const db = require('../utils/database')

const Participants = require('./participants.models')

const Messages = db.define('messages', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    participantId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            key: 'id',
            model: Participants
        }
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

module.exports = Messages

/*
...
const Conversations = require('./conversations.models')
const Users = require('./users.models')
...
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            key: 'id',
            model: Users
        }
    },
    conversationId: {
        type: DataTypes.UUID,
        allowNull: false, 
        references: {
            key: 'id',
            model: Conversations
        }
    },
*/