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

app.get("/specific_user:username", async (req, res) => {
    const user = req.params.username
    const client = new MongoClient(uri)
    try {
        await client.connect()
        const database = client.db("app-data")
        const users = database.collection("users")
        const userExist = await users.findOne({  username: user } )

        if (userExist) {
            res.status(201).send("success")
        } else {
            res.status(409).send("user not found, create an account")
            console.log(user)
        }
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
            video,
            videos:  []
        }
        const insertedUSer = await users.insertOne(data)



        res.status(201).send({userId: generatedUserId})

    } catch (error) {
        console.log(error)
    } finally {
        await client.close()
    }
})

app.put('/like:username', async (req, res) => {
    const client = new MongoClient(uri)
    const userID = req.params.username

    try {
        await client.connect()
        const database = client.db("app-data")
        const users = database.collection("users")
        const query = {user_id: userID}
        const currentLikes = await users.findOne({ user_id: userID })
        const options = { upsert: true }

        const updateDoc = {
            $set: {
                likes: currentLikes.likes + 1
            }
        }
        const result = await users.updateOne(query, updateDoc, options)
        if (result) {
            res.status(201).send(result)
        } else {
            res.status(409).send('fuck')
        }

    } finally {
        await client.close()
    }
})
app.put('/unlike:username', async (req, res) => {
    const client = new MongoClient(uri)
    const userID = req.params.username

    try {
        await client.connect()
        const database = client.db("app-data")
        const users = database.collection("users")
        const query = {user_id: userID}
        const currentLikes = await users.findOne({ user_id: userID })
        const updateDoc = {
                $set: {
                 likes: currentLikes.likes - 1
                }
         }


        const result = await users.updateOne(query, updateDoc)
        if (result) {
            res.status(201).send(result)
        } else {
            res.status(409).send('fuck')
        }

    } finally {
        await client.close()
    }
})
app.put('/liked_videos/:user_id/:video_name', async (req, res) => {
    const client = new MongoClient(uri)
    const userID = req.params.user_id
    const video = req.params.video_name
    console.log(req.params)
    console.log("hit")

    try {
        await client.connect()
        const database = client.db("app-data")
        const users = database.collection("users")
        const query = {user_id: userID}
        const updateDoc = {
            $push: {

                liked_videos: video
            }
        }
        const result = await users.updateOne(query, updateDoc)

        if (result) {
            res.status(201).send(result)
        } else {
            res.status(409).send('fuck')
        }

    } finally {
        await client.close()
    }
})

app.get('/user_videos/:user_id', async (req, res) => {
    const client = new MongoClient(uri)
    const userID = req.params.user_id

    try {
        await client.connect()
        const database = client.db("app-data")
        const users = database.collection("users")
        const user = await users.findOne({user_id: userID})



        res.send(user)

    } finally {
        await client.close()
    }
})
app.listen(PORT, () => console.log("Server is running"))