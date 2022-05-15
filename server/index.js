const PORT = 8000

const express = require("express")
const { MongoClient } = require("mongodb")
const cors = require("cors")
const password = encodeURIComponent("Katlyn@29")
const uri = `mongodb+srv://jdrew153:${password}@cluster0.hnboe.mongodb.net/Cluster0?retryWrites=true&w=majority`
const bcrypt = require('bcrypt')
const { v4: uuidv4 }= require('uuid')
const jwt = require('jsonwebtoken');


const app = express()

app.use(express.json())
app.use(cors())

app.get("/users", async (req,res) => {
    const client = new MongoClient(uri)
    try {
        await client.connect()
        const database = client.db("app-data")
        const users = database.collection("users")
        const returnedUsers = await users.find().toArray()
        res.send(returnedUsers)
    } finally {
         await client.close()
    }
})

app.post('/signup', async (req,res) => {
    const client = new MongoClient(uri)
    const { username, email, password, profile_pic_url, video}  = req.body
    const generatedUserId = uuidv4()
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        await client.connect()
        const database = client.db("app-data")
        const users = database.collection("users")
        const existingUser = await users.findOne({ email })

        if (existingUser) {
            return res.status(409).send("User already exists")
        }

        const sanitizedEmail = email.toLowerCase()

        const data = {
            user_id: generatedUserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword,
            username,
            profile_pic_url,
            video

        }
        const insertedUSer = await users.insertOne(data)



        res.status(201).send({userId: generatedUserId})

    } catch (error) {
        console.log(error)
    } finally {
        await client.close()
    }
})

app.listen(PORT, () => console.log("Server is running"))