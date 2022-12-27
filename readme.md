# Webased - Chat Application (My Chat) [CS50X - Havard University]

## Requirement
- Install [NodeJS](https://nodejs.org/en/) Latest Version or Update Latest Version
- [How to install MongoDb on Window](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
- [VisualStudioCode](https://code.visualstudio.com/) 

## Database Connection

```
# Can Change Connection in ./config/database.js
# Can connect with another mongodb server, Default connection alredy setup in ./config/database.js
mongoose.connect("mongodb+srv://USERNAME:PASSWORD@cluster0.ogfnn.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority")
```
## Install Dependencies

- Open terminal (Ctrl + Shitft + `)
- Type command in terminal
```
$ npm install
```

## Run Dev
```
# serve with hot reload at localhost:3000
$ npm start
``` 
