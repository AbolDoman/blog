const mongoose=require('mongoose');

exports.connectDb= async()=>{
    try {
        const con=await mongoose.connect(process.env.mongoURI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:true,
            useCreateIndex:true
        })

        console.log(`database is connected to ${con.connection.host}`);
    } catch (err) {
       console.log(err);
       process.exit(1) 
    }
}

