Modificaciones a CHAT-API sobre el avance del dia miércoles 14/12/2022:
----------------------------------------------------------------------

A partir del punto 4 del encargo se modificó el diseño de la base de datos en cuanto a las relaciones en del modelo:

initModels.js
-------------
//* Comentar o eliminar las dos relaciones de Messages

    // users - messages          //* X
    // Users.hasMany(Messages)   //* X
    // Messages.belongsTo(Users) //* X

    // conversations - messages          //* X
    // Conversations.hasMany(Messages)   //* X
    // Messages.belongsTo(Conversations) //* X

//* Añadir una única relación
...
    //* Participants 1:M con Messages
    Participants.hasMany(Messages)
    Messages.belongsTo(Participants)
...

El resultado es una estructura con la tabla "participants" en posición central con tres ramificaciones correspondientes a "users", "conversations" y "messages"

En el punto 5 del encargo se conservar las condiciones planteadas pero generalmente mediando en ellas la tabla de "partipantes"
    1. Un usuario tiene muchas conversaciones 
    2. Un usuario es participante de muchas conversaciones
        (usuario 1:M participantes M:1 conversaciones)
    3. Un usuario envia muchos mensajes
        (usuario 1:M participantes 1:M mensajes)
    4. Una conversacion tiene muchos participantes
    5. Una conversacion tiene muchos mensajes
        (conversación 1:M participantes 1:M mensajes)
Este cambio conlleva varias ventajas por cuanto se puede conservar la consistencia de datos con menos esfuerzo ya que la única acreditación requerida para enviar y recibir mensajes está en la tabla "participants".  Al incorporar participants_id en las rutas principales, todas las transacciones quedan validadas respecto de su usuario y conversación asociados.
Por otraparte, esto le imprime más importancia a la tabla "participants" y por ello en las consultas se ha procurado que su clave primaria "participants_id" solo sea reportada al propio usuario logueado con el auth de 'token' o en consultas restringidas a usuarios con el rol de 'admin'.  (Ruta adicional conversations/admin, servicio getAllConversations, controlador findAllConversations)
Así mismo, una ruta adicional (conversations/:conversation_id/me) sirve para informar al usuario logueado cuál es el "participan_id" necesario para participar de una conversación.

Las rutas qudan como sigue:

6.a. i, ii, iii
Ruta con la lista de conversaciones en las que participa el usuario logueado & crea conversaciones nuevas
http://localhost:9000/api/v1/conversations
GET ruta protegida token - login

Ruta adicional de admin
Ruta solo para adminsitradores que enlista todas las conversaciones existentes
http://localhost:9000/api/v1/conversations/admin
GET ruta protegida token - login y restringido a usuarios con rol de 'admin'

6.b. i, ii, iii
Ruta con información de una conversación de en específico. Modificar y borrar conversaciones está restringido a usuarios admin
http://localhost:9000/api/v1/conversations/:conversation_id 
GET ruta protegida token - login
GET ruta protegida token - login y restringido a usuarios con rol de 'admin'
DELETE ruta protegida token - login y restringido a usuarios con rol de 'admin'

Ruta adicional de admin
Ruta que acredita al participante de una conversación y entrea el participant_id correspondiente
http://localhost:9000/api/v1/conversations/:conversation_id/me  
GET ruta protegida token - login

Reto Opcional a. I, II, III
Ruta que entrega la lista de participantes de una conversación solo si el usuario que la requirere es uno de ellos.  La misma restricción se aplica para agregar participantes.
http://localhost:9000/api/v1/conversations/:conversation_id/participants
GET ruta protegida token - login 
POST ruta protegida token - login

Reto Opcional b. I, II, III
Ruta de un participante en específico.  Solo el dueño (owner) de una conversación puede expulsar a un participante
http://localhost:9000/api/v1/conversations/:conversation_id/participants/:user_id
GET ruta protegida token - login
DELETE ruta protegida token - login y cuyo servicio está restringido al usuario registrado como dueño (owner) de la conversación.

6.c. i, ii, iii
Ruta de mensajes solo accede el usuario logueado y además, la ruta ha de incluir la propia participant_id
http://localhost:9000/api/v1/conversations/:conversation_id/participants/:participant_id/messages
GET ruta protegida token - login
POST ruta protegida token - login

6.d. i, ii, iii
Ruta de un mensaje en particular
http://localhost:9000/api/v1/conversations/:conversation_id/participants/:participant_id/messages/:message_id
GET ruta protegida token - login
DELETE ruta protegida token - login

