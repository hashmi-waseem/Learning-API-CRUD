const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/Products", {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("Success")
}).catch(()=>{
    console.log("Failed")
})

const schema = new mongoose.Schema({
    name: String,
    price: Number,
    desc: String
})

const products = new mongoose.model("Product",schema)

//CREATE
app.post("/api/v1/addProduct", async(req,res)=>{
    const prod = await products.create(req.body);
    if(!prod){
        return res.status(500).json({
            success: false,
            message: "Product Not Found!"
        })
    }
    res.status(200).json({
        success: true,
        prod
    })
})

//VIEW/READ
app.get("/api/v1/viewProduct", async(req,res)=>{
    const prod = await products.find();
    if(!prod){
        return res.status(500).json({
            success: false,
            message: "Product Not Found!"
        })
    }
    res.status(201).json({
        success: true,
        prod
    })
})

//UPDATE
app.put("/api/v1/updateProduct/:id", async(req,res)=>{
    let prod = await products.findById(req.params.id);
    if(!prod){
        return res.status(500).json({
            success: false,
            message: "Product Not Found!"
        })
    }
    prod = await products.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        useFindAndModify:false,
        runValidators: true
    })

    res.send(200).json({
        success: true,
        prod
    })
})

//DELETE
app.delete("/api/v1/deleteProduct/:id", async(req,res)=>{
    const prod = await products.findById(req.params.id)
    if(!prod){
        return res.status(500).json({
            success: false,
            message: "Product Not Found!"
        })
    }

    await prod.remove()
    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully!"
    })
})

app.listen(3000,()=>{
    console.log("Server Started")
})