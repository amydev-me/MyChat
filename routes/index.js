const router = require('express').Router();
const Employee = require('../Model/Employee'); 
const mongoose=require('mongoose');
// const isAuth = require('../middleware/auth').isAuth;
const bcrypt = require('bcrypt')
// const passport = require('passport')
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

router.post("/api/login", async(req, res) => {
     // Our login logic starts here
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
    
            //   res.status(200).json(token);
            return res.header("x-access-token", token).send({
                user,
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

router.post('/api/create-employee' , async (req, res) => {
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



router.post('/api/store-conversation', async(req, res) => {
    const reqBody = req.body; 
    
    try{

        if(!reqBody.chat_id){
            const newChat= await new Chat({
                name:'-',
                is_group :false
            });
            const _newChat = await newChat.save();
            reqBody.chat_id = _newChat._id;
          
            const insertMany =  await  Participant.insertMany([
                {
                    chat_id : mongoose.Types.ObjectId(reqBody.chat_id),
                    employee_id : mongoose.Types.ObjectId(reqBody.sender_id)
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
                $push: { conversations: mongoose.Types.ObjectId(_newConv._id) } }
        );

        res.send(_newConv)
    
    }catch(e){
        res.status(500).send('Error')
    }

})

async function getChatID(employee_id){
    let schedules = await Participant.find({employee_id : employee_id});
    let collection = [];
    schedules.forEach(e => {
        collection.push(e.chat_id);
    })
    return collection;
}


router.get('/api/get-conversations', async (req, res) => {
    let query = req.query
    let chat_id = query.chat_id;

    let conversations = await Conversation.find({chat_id:chat_id})
    
    res.send({
        conversations
    })
});

router.get('/api/get-participant', isAuthenticated, async (req, res) => {
    let employee_id = '636127fde35da5b6e8a4e3e9';
    let chatIds = await getChatID(employee_id);
 
    let participants = await Participant.find({
        "chat_id" : { $in : chatIds },
        "employee_id" : { $ne : employee_id}
    })
    .populate({ path: 'employee_id', model: Employee })
    .populate({path:'chat_id', model: Chat})
    .exec(function (err, data) {
        res.send({
            participants : data
        })
    });

    
    // res.send({
    //     participants
    // })
});

module.exports = router;