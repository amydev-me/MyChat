const router = require('express').Router();
const Employee = require('../Model/Employee'); 
const mongoose=require('mongoose');
const bcrypt = require('bcrypt')
const Chat = require('../Model/Chat');
const Conversation = require('../Model/Conversation');
const Participant = require('../Model/Participant');
const jwt = require('jsonwebtoken');

const isAuthenticated = require('../middleware/auth');

 
router.get('/' ,(req, res) => {
    res.render('Chat')
});

router.get('/login' ,(req, res) => {
    res.render('Login')
});

router.get("/api/whoami", isAuthenticated, async(req, res) => {
    let user = await Employee.findById(req.user.user_id);
    res.send(user)
});

router.post("/api/login", async(req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await Employee.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = await jwt.sign(
                { user_id: user._id, email }, process.env.TOKEN_KEY,{ expiresIn: "2h"}
            ); 
    
            return res.header("x-access-token", token).send({
                token
            });
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    } 
})

router.get('/logout', (req, res, next) => {
    req.session.loggedin = false;
    req.logout();
    res.redirect('/login');
})

router.post('/api/create-employee' ,isAuthenticated, async (req, res) => {
    try{
        const staff = req.body;    
        const salt = bcrypt.genSaltSync(15);
        const hash = bcrypt.hashSync(staff.password, salt);
        staff.password = hash;
        const newStaff= await new Employee(staff);

        const _newStaff = await newStaff.save();

        Employee.find().exec(function (err, items){
            res.send({
                items : items
            })
        });
    
    }catch(e){
        res.send('Error', 500)
    }
})

function getParticipantsId(participants){
    let ids = [];

    participants.forEach(e => ids.push(e._id));

    return ids;
}

async function getChatById(chat_id){
    let chat =  await Chat.find({
                    "_id" : { $in : chat_id } 
                })
                .sort({updatedAt: -1})
                .populate({ path: 'employees', model: Employee }) 
                .populate({ path: 'last_sender', model: Employee }) 
                .populate({ path: 'createdBy', model: Employee })
                .populate({ path: 'participants', model: Participant});

    return chat;
}

router.post('/api/store-conversation', isAuthenticated, async(req, res) => {
    const reqBody = req.body; 
    reqBody.sender_id = req.user.user_id;
    // reqBody.sender_id = employee_id;
    try{
        let isNewChat = false;
        const newParticipants = [];
        if(!reqBody.chat_id){ 

            const newChat= await new Chat({
                name:'-',
                is_group :false,
                employees : [ mongoose.Types.ObjectId(reqBody.sender_id),  mongoose.Types.ObjectId(reqBody.receiver_id)] 
            });
            const _newChat = await newChat.save();
            reqBody.chat_id = _newChat._id;
          
            const newParticipants =  await  Participant.insertMany([
                {
                    chat_id : mongoose.Types.ObjectId(reqBody.chat_id),
                    employee_id : mongoose.Types.ObjectId( reqBody.sender_id),
                    unread_count : 0
                },
                {
                    chat_id : mongoose.Types.ObjectId(reqBody.chat_id),
                    employee_id : mongoose.Types.ObjectId(reqBody.receiver_id),
                    unread_count : 0
                }
            ])  

            let participant_ids = await getParticipantsId(newParticipants)
            const _1 = await Chat.updateOne(
                {'_id' : mongoose.Types.ObjectId(reqBody.chat_id)},
                { $set: { participants: participant_ids}}
            );

            isNewChat = true;
        }
        const newConv= await new Conversation(reqBody);
        const _newConv = await newConv.save();

        let parcs =  await Participant.updateMany({
                        "chat_id" : { $in : reqBody.chat_id },
                        "employee_id": {$ne:  reqBody.sender_id}},
                    {
                        $inc : {'unread_count' : 1}
                    }); 

        const doc = await Chat.updateOne(
            {'_id' : mongoose.Types.ObjectId(reqBody.chat_id)},
            { 
                last_message : reqBody.message,
                last_sender :  reqBody.sender_id,
                $push: { conversations: mongoose.Types.ObjectId(_newConv._id) } }
        );
 
        let chat = await getChatById(reqBody.chat_id); 
 
        let last_conversation = await Conversation.find({ _id:_newConv._id }).populate({ path: 'sender_id', model: Employee })   

        if(!isNewChat){
            global.io.emit(`chat-id-${reqBody.chat_id}`, {
                message: last_conversation[0],
                chats :chat 
            }); 
        }else{ 
            global.io.emit(`new-group-noti-${reqBody.receiver_id}`, chat);  
        } 

        res.send({
            message: last_conversation[0],
            chats :chat 
        });
    }catch(e){
        res.status(500).send(e)
    }
}) 

router.get('/api/reset-read-count',isAuthenticated, async (req, res) => {
    let query = req.query
    let chat_id = query.chat_id;
    let employee_id = req.user.user_id;

    let parcs =  await Participant.updateMany({
            "chat_id" : { $in : reqBody.chat_id },
            "employee_id": {$ne:  reqBody.sender_id}
        },
        {
            $set:{"unread_count": 0}
        });
    
    res.send({
        conversations
    })
});

router.get('/api/get-conversations', isAuthenticated, async (req, res) => {
    let query = req.query
    let chat_id = query.chat_id;
    let employee_id = req.user.user_id;

    if(query.unread_count > 0){
        await Participant.updateOne(
            {'employee_id' : mongoose.Types.ObjectId(employee_id), 'chat_id' :mongoose.Types.ObjectId(chat_id)},
            { 
                unread_count : 0
            }
        );
    }

    let conversations = await Conversation.find({ chat_id:chat_id }).populate({ path: 'sender_id', model: Employee }) 
    
    res.send({
        conversations
    })
});

router.get('/api/get-employees', isAuthenticated, async(req,res) => {
     let employee_id = req.user.user_id;
    let employees = await Employee.find({_id : {$ne:employee_id}}).exec(function(err, data){
        res.send({
            employees : data
        });
    }) 
})

async function getChatID(employee_id){
    let schedules = await Participant.find({employee_id : employee_id});
    let collection = [];
    schedules.forEach(e => {
        collection.push(e.chat_id);
    })
    return collection;
}

router.get('/api/get-chats', isAuthenticated, async (req, res) => {
    let employee_id = req.user.user_id;
    
    let chatIds = await getChatID(employee_id);
    let chats = await getChatById(chatIds);  
    res.send({
        chats : chats 
    })  
});

function getParticipants(employees, chat_id){
    let _employees = [];
    employees.forEach(e => {
        _employees.push({
            chat_id : mongoose.Types.ObjectId(chat_id),
            employee_id : mongoose.Types.ObjectId(e),
            unread_count : 0
        })
    })
    return _employees;
}

router.post('/api/create-group',isAuthenticated, async(req, res) => {
    const reqBody = req.body; 
    reqBody.employees.push(req.user.user_id)
    try{ 
        const newChat= await new Chat({
            name:reqBody.name,
            is_group :true,
            employees : reqBody.employees,
            createdBy : mongoose.Types.ObjectId(req.user.user_id)
        });
        const _newChat = await newChat.save();
        reqBody.chat_id = _newChat._id;

        let participants =  await getParticipants(reqBody.employees, _newChat._id)       
        const newParticipants =  await  Participant.insertMany(participants) 

        let participant_ids = await getParticipantsId(newParticipants)      
        const _1 = await Chat.updateOne(
            {'_id' : mongoose.Types.ObjectId(reqBody.chat_id)},
            { $set: { participants: participant_ids}}
        );

        let chat = await getChatById(reqBody.chat_id); 

        reqBody.employees.forEach(user_id => {
            if(user_id !== req.user.user_id){
                global.io.emit(`new-group-noti-${user_id}`, chat); 
            }
        })

        res.send({
            chats :chat 
        });
    }catch(e){
        res.status(500).send(e)
    } 
})

module.exports = router;