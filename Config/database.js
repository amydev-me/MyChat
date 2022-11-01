const mongoose=require('mongoose');

/**
 * Connect To the database
 */
mongoose.connect( process.env.DB_URI    )
.then(() => console.log("Database connected!"))
.catch(err => console.log(err));
