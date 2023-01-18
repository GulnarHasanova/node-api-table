const express = require("express")
const cors=require("cors")
const bodyParser=require("body-parser")
const dotenv = require("dotenv")
const mongoose = require("mongoose")


dotenv.config()

const {Schema}=mongoose;

const productSchema=new Schema(

  {
    name:{type:String,required:true},
    price:{type:Number,required:true},
    count:{type:Number,required:true}

  },
  {timestamps:true}

)


const Products = mongoose.model("products",productSchema)


const app = express()





app.use(cors())
app.use(bodyParser.json())




app.get("/",(req,res)=>{
 res.send("<h1>Admin Panel</h1>")
})


//Get all pro
app.get("/products",(req,res)=>{
    Products.find({},(err,docs)=>{
        if(!err){
            res.send(docs)
        }
        else{
            res.status(404).json({message:err})
        }
    })
   })


//get pro id-le
app.get("/products/:id",(req,res)=>{
    const {id}=req.params
    Products.findById(id,(err,doc)=>{
        if(!err){
            if(doc){
                res.send(doc)
            }
            else{
                res.status(404).json({message:"NOT FOUND"})
            }
        }
        else{
            res.status(500).json({message:err})
        }
    })
  
   })

   //delete 


   app.delete("/products/:id",(req,res)=>{

    const {id}=req.params
    Products.findByIdAndDelete(id,(err)=>{
        if(!err){
            res.send("Deleted data")
            
        }else{
            res.status(404).json({message:err})
        }
    })
})





   //create 

   app.post("/products",(req,res)=>{
    const product=new Products({
       name:req.body.name,
        price:req.body.price,
        count:req.body.count
       
    })
    product.save()
    res.send({message:"Product Created"})
})






   //put
   app.put("/products/:id",(req,res)=>{
    const {id}=req.params

    Products.findByIdAndUpdate(id,req.body,(err,doc)=>{
        if(!err){
            res.status(200)
        }
        else{
            res.status(404).json({message:err})
        }
    })
    res.send({message:"Successfully Updated"})
})



const PORT = process.env.PORT
const url = process.env.CONNECTION_URL.replace("<password>",process.env.PASSWORD)
mongoose.set('strictQuery', true);
mongoose.connect(url,(err)=>{
    if(!err){
    console.log("DB connect");
        app.listen(PORT,()=>{
            console.log("Server start");
        })
    }
})
  

