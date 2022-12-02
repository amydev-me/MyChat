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

router.post('/api/store-conversation', isAuthenticated, async(req, res) => {
    const reqBody = req.body; 
    reqBody.sender_id = req.user.user_id;
    // reqBody.sender_id = employee_id;
    try{
        if(!reqBody.chat_id){
            const newChat= await new Chat({
                name:'-',
                is_group :false,
                employees : [ reqBody.sender_id, reqBody.receiver_id]
            });
            const _newChat = await newChat.save();
            reqBody.chat_id = _newChat._id;
          
            const insertMany =  await  Participant.insertMany([
                {
                    chat_id : mongoose.Types.ObjectId(reqBody.chat_id),
                    employee_id : mongoose.Types.ObjectId( reqBody.sender_id)
                },
                {
                    chat_id : mongoose.Types.ObjectId(reqBody.chat_id),
                    employee_id : mongoose.Types.ObjectId(reqBody.receiver_id)
                }
            ])
            
        }
        const newConv= await new Conversation(reqBody);
        const _newConv = await newConv.save();

        const doc = await Chat.updateOne(
            {'_id' : mongoose.Types.ObjectId(reqBody.chat_id)},
            { 
                last_message : reqBody.message,
                last_sender :  reqBody.sender_id,
                $push: { conversations: mongoose.Types.ObjectId(_newConv._id) } }
        );
 
        let chat = await Chat.find({
            "_id" : { $in : reqBody.chat_id } 
        })
        .populate({ path: 'employees', model: Employee,  match: { _id: {$ne:  reqBody.sender_id}} }) 
        .populate({ path: 'last_sender', model: Employee }) 
   
        global.io.emit(`chat-id-${reqBody.chat_id}`, _newConv); 


        res.send({
            message: _newConv,
            chats :chat 
        });
    }catch(e){
        res.status(500).send('Error')
    }
}) 

router.get('/api/get-conversations', async (req, res) => {
    let query = req.query
    let chat_id = query.chat_id;

    let conversations = await Conversation.find({ chat_id:chat_id })
    
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
     
    let _tmp = await Chat.find({
        "_id" : { $in : chatIds } 
    })
    .sort({updatedAt: -1})
    .populate({ path: 'employees', model: Employee,  match: { _id: {$ne: employee_id}} }) 
    .populate({ path: 'last_sender', model: Employee }) 
    .exec(function (err, data) {
        res.send({
            chats : data 
        })
    }); 
});

function getEmployees(employees, chat_id){
    let _employees = [];
    employees.forEach(e => {
        _employees.push({
            chat_id : mongoose.Types.ObjectId(chat_id),
            employee_id : mongoose.Types.ObjectId(e)
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
            employees : reqBody.employees
        });
        const _newChat = await newChat.save();
        reqBody.chat_id = _newChat._id;
        let employees =  await getEmployees(reqBody.employees, _newChat._id)
       
        const insertMany =  await  Participant.insertMany(employees) 

        let chat = await Chat.find({
            "_id" : { $in : reqBody.chat_id } 
        })
        .populate({ path: 'employees', model: Employee,  match: { _id: {$ne: req.user.user_id }} }) 
        .populate({ path: 'last_sender', model: Employee });

        reqBody.employees.forEach(user_id => {
            if(user_id !== req.user.user_id){
                global.io.emit(`new-group-noti-${user_id}`, chat); 
            }
        })

        res.send({
            chats :chat 
        });
    }catch(e){
        res.status(200).send('Error')
    } 
})

module.exports = router;