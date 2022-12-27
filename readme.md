# Webased - Chat Application (My Chat) 
#### Video Demo :
#### Demo : https://mychatapp.herokuapp.com/
#### Description
The chat application has been designed for office use, and has been used for a variety of purposes such as networking, collaborating on projects, or staying in touch with employees. This application allows users to communicate with one another in real time through text-based messages. The chat application may have features such as the ability to create and join group chat rooms, the ability to send and receive private messages, and the ability to send and receive files such as images and documents. The application may be accessed through a web-based interface. It may also have features such as the ability to customize user profiles and access a list of previous chats.

#### Folder Structure

> Folder structure options and naming conventions for software projects
```
MyChat
├── Config                   # Include all config files  
|   ├── database.js
├── middleware               # Authentication and validation
|   └── auth.js
├── Model                    # Mongoose Schema
|   ├── Employee.js		
|   ├── Chat.js
|   └── Participant.js
|   └── Conversation.js
├── node_modules		     # NodeJS Libraries
├── public                   # Include Public Files Css, js, images...
|   ├── css
|   |   ├── signin.css
|   |   └── style.css
|   |   └── chat.css
|   ├── images
|   └── js 
|   |   ├── Login.js 
|   |   ├── Chat.js 
|   |   ├── socket.io.js
├── routes                    # Route Files
|   └── index.js
├── views                     # Admin and Employee Views
|   ├── Login.ejs
|   ├── Chat.ejs    
|   └── Admin.ejs
├── .gitignore
├── package.json
├── app.js
├── .env				# Environment Variables
└── readme.md
```

#### Requirement
- Install [NodeJS](https://nodejs.org/en/) Latest Version or Update Latest Version
- [How to install MongoDb on Window](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
- [VisualStudioCode](https://code.visualstudio.com/) 

#### Database Connection 
```
# Can Change Connection in ./config/database.js
# Can connect with another mongodb server, Default connection alredy setup in ./config/database.js
mongoose.connect("mongodb+srv://USERNAME:PASSWORD@cluster0.ogfnn.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority")
```
#### Install Dependencies

- Open terminal (Ctrl + Shitft + `)
- Type command in terminal
```
$ npm install
```

#### Run Dev
```
# serve with hot reload at localhost:3000
$ npm start
``` 
