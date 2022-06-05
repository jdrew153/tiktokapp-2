const PORT = 8000

const express = require("express")
const { MongoClient } = require("mongodb")
const cors = require("cors")
const password = encodeURIComponent("Katlyn@29")
const uri = `mongodb+srv://jdrew153:${password}@cluster0.hnboe.mongodb.net/Cluster0?retryWrites=true&w=majority`
const bcrypt = require('bcrypt')
const { v4: uuidv4 }= require('uuid')
const jwt = require('jsonwebtoken');
const axios = require("axios");



const app = express()

app.use(express.json())
app.use(cors())



app.get("/users", async (req,res) => {
    const client = new MongoClient(uri)
    console.log('users was hit')
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
            res.status(201).send(userExist)
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
            videos:  [],
            followed_users: []
        }
        const insertedUSer = await users.insertOne(data)



        res.status(201).send({userId: generatedUserId})

    } catch (error) {
        console.log(error)
    } finally {
        await client.close()
    }
})

//liking a video and adding it to the logged in users liked video array
app.put('/like/:username/:video_id/:likedusername', async (req, res) => {
    const client = new MongoClient(uri)
    const username = req.params.username
    const videoID = parseFloat(req.params.video_id)
    const likedusername = req.params.likedusername

    try {
        await client.connect()
        const database = client.db("app-data")
        const users = database.collection("users")
        const query = {username: likedusername}
        const user = await users.findOne(query)


        const likesArray = await users.findOne({
            username: likedusername,
            videos: {
                $elemMatch: {
                    video_id: videoID
                }
            }
        })

        const numLikes = []

        if (!(likesArray === null)) {
            likesArray.videos.forEach((user) => {

                if (user.video_id === videoID) {
                    const numberLikes = user.likes
                    numLikes.push(numberLikes)
                }
            })
        } else {
            console.log('likes array empty ypu fucked up')
        }




    // add logic so that a user cannot keep liking a post if its in the users liked video array

        const loggedInUser = await users.findOne({ username : username })

        if (loggedInUser.liked_videos.find(video => video.video_id === videoID)) {

            res.send('already liked')
            console.log('already liked')


        } else {
            const retLiked = await users.findOneAndUpdate(query,{

                $set : {
                    "videos.$[video].likes": numLikes[0] + 1
                }
                }, {
                arrayFilters: [{
                    "video.video_id" : videoID
                }]
                }
            )
            const likedVideoStruct = {
                "video_id" : videoID,
                "username" : likedusername
            }


            const addedLike = await users.findOneAndUpdate({username: username}, {
              $push: {
                liked_videos: likedVideoStruct
                }
            })
            console.log('liked')
            console.log(likedVideoStruct)
            // adding logic to send a notification to the video owner that you liked their video
            let today = new Date();
            let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            let dateTime = date+' '+time;

            const userWhoLiked = await users.findOne({username: username})
            const likedVideoSource = await users.findOne({ username: likedusername })
            const likedVideoSourceArray = []
            likedVideoSource.videos.forEach((video) => {
                if (video.video_id === videoID) {
                    likedVideoSourceArray.push(video.source)
                }
                })
            const notificationForFollowerStruct = {
                "notification_id" : Math.random() * 10000000,
                "type" : "liked video notification",
                "username" : username,
                "time_stamp" : dateTime,
                "acknowledged" : false,
                "avatar": userWhoLiked.profile_pic_url,
                "liked_video_source" : likedVideoSourceArray[0]
            }
            const notificationForFollowedUser = await users.findOneAndUpdate({ username: likedusername},
                {$push : {
                        notifications:  notificationForFollowerStruct
                    }
                })
            res.send(retLiked.value)
        }

    } finally {
        await client.close()
    }
})
app.put('/unlike/:username/:video_id/:likedusername', async (req, res) => {
    const client = new MongoClient(uri)
    const username = req.params.username
    const videoID = parseFloat(req.params.video_id)
    const likedusername = req.params.likedusername

    console.log('unliked')

    try {
        await client.connect()
        const database = client.db("app-data")
        const users = database.collection("users")
        const query = {username: username}
        const user = await users.findOne(query)

        const likesArray = await users.findOne({
            username: likedusername,
            videos: {
                $elemMatch: {
                    video_id: videoID
                }
            }
        })

        const numLikes = []

        likesArray.videos.forEach((user) => {

            if (user.video_id === videoID) {
                const numberLikes = user.likes
                numLikes.push(numberLikes)
            }
        })





        if (numLikes[0] > 0) {
            const retUnLiked = await users.findOneAndUpdate({
                username: likedusername,
                videos: {
                    $elemMatch: {video_id: videoID}
                }
            }, {
                $set: {
                    "videos.$.likes": numLikes[0] - 1
                }
            })
            res.send(retUnLiked)
        } else {
            res.send('nope')
        }

        //remove the video_id from the users liked videos array

        const removedFromLikedVideosArray = await users.findOneAndUpdate(
            {username : username},
            {
                $pull: {
                    liked_videos: videoID
                }
            }
            )
    } finally {
        await client.close()
    }
})
app.put('/liked_videos/:user_id/:video_id', async (req, res) => {
    const client = new MongoClient(uri)
    const userID = req.params.user_id
    const videoID = req.params.video_id
    console.log(req.params)
    console.log("hit")

    try {
        await client.connect()
        const database = client.db("app-data")
        const users = database.collection("users")
        const query = {user_id: userID}
        const updateDoc = {
            $push: {

                liked_videos: videoID
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
app.get('/liked-videos/:username', async (req,res) =>{
    const client = new MongoClient(uri)
    const username = req.params.username
    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')
        const query = {
            username: username
        }

        const retLikedVideos = await users.findOne(query)
        if (retLikedVideos === null ) {
            res.send([""])
        } else {
            res.send(retLikedVideos.liked_videos)
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

app.get('/largevideo/:user_id', async (req, res) => {
    const client = new MongoClient(uri)
    const userID = req.params.user_id
    const video_id = req.params.video_id

    try {
        await client.connect()
        const database = client.db("app-data")
        const users = database.collection("users")
        const user = await users.findOne({user_id: userID})
        const video_array = user.videos

        res.send(video_array)

    } finally {
        await client.close()
    }
})

app.get('/get-all-comments', async (req,res) => {
    const client = new MongoClient(uri)
    const videoID = req.params.video_id

    try {
        await client.connect()
        const database = client.db("app-data")
        const comments = database.collection("comments")

        const returnedComments = await comments.find().toArray()
        res.send(returnedComments)
    } finally {
        await client.close()
    }
})

app.get ('/retrievecomment/:video_id', async (req,res) => {
    const client = new MongoClient(uri)
    const videoID = req.params.video_id

    try {
        await client.connect()
        const database = client.db("app-data")
        const comments = database.collection("comments")

        const comments_array =  await comments.findOne({video_id: videoID})

        res.send(comments_array)
    } finally {
        await client.close()
    }
})
app.put('/comment/:user_id/:video_id', async (req,res) => {
    const client = new MongoClient(uri)
    const videoID = req.params.video_id
    const video_id = parseFloat(videoID)
    const user_id = req.params.user_id
    const { postUsername, postComment, profile_pic} = req.body

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;


    try {
        await client.connect()
        const database = client.db("app-data")
        const comments = database.collection("comments")
        const query = {video_id: videoID}


        const commentDataStruct = {
            comment_id: Math.random(),
            username: postUsername,
            profile_pic: profile_pic,
            comment: postComment,
            time_stamp: dateTime,
            likes: 0
        }



        const UpdateDoc = {
            $push: {
                comments: commentDataStruct
            }
        }

        //updating the comments count in the users collection
        const users = database.collection('users')

        const currentComments = await users.findOne({
            user_id: user_id,
            videos: {
                $elemMatch: {
                    video_id: video_id
                }
            }
        })

        const numComments = []

        currentComments.videos.forEach((video) => {
            if (video.video_id === video_id) {
                numComments.push(video.comments)
            }
        })


        const updateCommentCount = await users.findOneAndUpdate({
            user_id: user_id
        }, {
            $set: {
                "videos.$[video].comments": numComments[0] + 1
            }
        }, {arrayFilters: [{
            "video.video_id": video_id
        }]})




        const insertedComment = await comments.updateOne(query, UpdateDoc)
        console.log("posted comment")

        //logic for notifying the owner of the video that you commented on their video
        const userWhoLiked = await users.findOne({username: postUsername})
        const likedVideoSource = await users.findOne({ user_id: user_id })
        const likedVideoSourceArray = []
        likedVideoSource.videos.forEach((video) => {
            if (video.video_id == videoID) {
                likedVideoSourceArray.push(video.source)
            }
        })
        console.log(likedVideoSourceArray)
        const notificationForFollowerStruct = {
            "notification_id" : Math.random() * 10000000,
            "type" : "commented notification",
            "username" : postUsername,
            "time_stamp" : dateTime,
            "acknowledged" : false,
            "avatar": userWhoLiked.profile_pic_url,
            "liked_video_source" : likedVideoSourceArray[0],
            "comment": postComment
        }
        const notificationForFollowedUser = await users.findOneAndUpdate({ user_id: user_id},
            {$push : {
                    notifications:  notificationForFollowerStruct
                }
            })
        res.send(insertedComment)





    } finally {
        await client.close()
    }
})

app.put('/writecomment/:video_id', async (req,res) => {
    const client = new MongoClient(uri)
    const videoID = req.params.video_id
    const { postUsername, firstComment, profile_pic} = req.body

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;

    try {
        await client.connect()
        const database = client.db("app-data")
        const comments = database.collection("comments")


        const commentDataStruct = {
            comment_id: Math.random(),
            username: postUsername,
            profile_pic: profile_pic,
            comment: firstComment,
            time_stamp: dateTime,
            likes: 0
        }

        const createDoc = {

            video_id: videoID,
            comments: [
                commentDataStruct
            ]

        }
        const postedComment = await comments.insertOne(createDoc)
        res.send(postedComment)


    } finally {
        await  client.close()
    }
})

app.delete('/deletecomment/:video_id/:comment_id/:user_id', async (req,res) => {
    const client = new MongoClient(uri)
    const videoID = req.params.video_id
    const video_id = parseFloat(videoID)
    const user_id = req.params.user_id
    const { comment_id } = req.body
    console.log('hit')
    try {
        await client.connect()
        const database = client.db("app-data")
        const comments = database.collection("comments")
        const query = {video_id: videoID}

        const options = {
            upsert: true
        }

        const response = await comments.findOneAndUpdate(query,
            {
                $pull: {
                    comments: {
                        comment_id: comment_id
                    }
                }
            })

        const users = database.collection('users')

        const currentComments = await users.findOne({
            user_id: user_id,
            videos: {
                $elemMatch: {
                    video_id: video_id
                }
            }
        })

        const numComments = []

        currentComments.videos.forEach((video) => {
            if (video.video_id === video_id) {
                numComments.push(video.comments)
            }
        })


        const updateCommentCount = await users.findOneAndUpdate({
            user_id: user_id
        }, {
            $set: {
                "videos.$[video].comments": numComments[0] - 1
            }
        }, {arrayFilters: [{
                "video.video_id": video_id
            }]})




        res.send(response)


    } finally {
        await client.close()
    }
})

app.put('/like_comment/:video_id/:comment_id', async (req,res) => {
    const client = new MongoClient(uri)
    const videoID = req.params.video_id
    const commentId = parseFloat(req.params.comment_id)

    try {
        await client.connect()
        const database = client.db('app-data')
        const comments = database.collection('comments')
        const query = {video_id: videoID}

        const comment_array = await comments.findOne({
            video_id: videoID,
            comments: {
                $elemMatch: {
                    comment_id: commentId
                }
            }
        })

        const currentLikes = []

        comment_array.comments.forEach(comment => {

            if (comment.comment_id == commentId) {
                const numlikes = comment.likes
                currentLikes.push(numlikes)
            }
        })

        const response = await comments.findOneAndUpdate(query, {

            $set: {"comments.$[comment].likes": currentLikes[0] + 1}
        }, {arrayFilters: [{"comment.comment_id": commentId}]})



        res.send(response)


    } finally {
        await client.close()
    }
})

app.put('/add-a-follower/:username/:user_id', async (req,res) => {
    const client = new MongoClient(uri)
    const username = req.params.username
    const userID = req.params.user_id
    console.log('you better hit only once')
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;



    try {
        await client.connect()
        const database = client.db("app-data")
        const users = database.collection('users')
        const query = { username: username }

        const currentFollowers = await users.findOne(query).followed_users




        const addedFollower = await users.findOneAndUpdate(query,

            {
                $push: {
                    followed_users: {
                        user_id: userID
                    }
                }
            })
        const userWhoLiked = await users.findOne({username: username})
        const notificationForFollowerStruct = {
            "notification_id" : Math.random() * 10000000,
            "type" : "followed notification",
            "username" : username,
            "time_stamp" : dateTime,
            "acknowledged" : false,
            "avatar": userWhoLiked.profile_pic_url
        }
        const notificationForFollowedUser = await users.findOneAndUpdate({ user_id: userID},
            {$push : {
                notifications:  notificationForFollowerStruct
            }
            })
        res.send(addedFollower)






    } catch (error) {
        console.log(error)
    }

    finally {
        await client.close()
    }
})
app.put('/acknowledgeNotification/:username/:notification_id', async (req,res) => {
    const client = new MongoClient(uri)
    const username = req.params.username
    const notification_id = parseFloat(req.params.notification_id)

    console.log('acknowledged')

    try {
        await client.connect()
        const database = client.db("app-data")
        const users = database.collection("users")

        const acknowledgedNotification = await users.findOneAndUpdate({ username: username },
            {
                $set: {
                    "notifications.$[x].acknowledged": true
                }
        }, {
            arrayFilters: [{"x.notification_id": notification_id }]
            })

    } finally {
        await client.close()
    }

})

app.put('/unfollow-a-user/:username/:user_id', async (req,res) => {
    const client = new MongoClient(uri)
    const username = req.params.username
    const userId = req.params.user_id
    console.log('deleted a follower')

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')
        const query = {username: username}

        const deletedFollower = await users.findOneAndUpdate(query, {
            $pull: {
                followed_users: {
                    user_id: userId
                }
            }
        })

        res.send(deletedFollower)
    } finally {
        await client.close()
    }
})

app.get('/get-followers/:username', async (req,res) => {
    const client = new MongoClient(uri)
    const username = req.params.username
    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')
        const query = { username: username }

        const followers = await users.findOne(query)
        const followed_users = followers?.followed_users

        if (followed_users === null) {
            res.send('follow some users :)')
        } else {
            res.send(followers?.followed_users)

        }
    } finally {
        await client.close()
    }
})
app.get('/get-all-followers/:username', async (req,res) => {
    const client = new MongoClient(uri)
    const username = req.params.username
    try {

        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')



        const specific_user = await users.findOne({
            username: username
        })

        const followed_users = []

        const followed_users_array = specific_user.followed_users

        for (let i=0; i < followed_users_array.length; i++) {
            followed_users.push(followed_users_array[i].user_id)
        }
        const followed_user_videos = []



        for (let j =0; j < followed_users.length; j++) {
            const users = database.collection('users')
            const query = {user_id : followed_users[j] }

            const ret_users = await users.findOne(query)

            followed_user_videos.push(ret_users)


        }

        const randVideosArray = []



        res.send(followed_user_videos)

    } finally {
        await client.close()
    }

})

app.put('/upload-video/:username', async (req,res) => {
    const client = new MongoClient(uri)
    const username = req.params.username
    console.log('uploaded a video')

    const { videoCaption, videoSource } = req.body

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')
        const query = { username: username }

        let today = new Date();

        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();


        const UpdateVideoArray = {

            $push: {
                videos: {
                    video_id: Math.random(),
                    source: videoSource,
                    caption: videoCaption,
                    likes: 0,
                    upload_time: date,
                    comments: 0,
                    views: 0
                }
            }
        }

        const AddedVideo = await users.findOneAndUpdate(query, UpdateVideoArray)
        res.send(AddedVideo)
        console.log(AddedVideo)



    } finally {
        await client.close()
    }
})

//clearing notifications of a user going to come back to this... don't want to end up deleting a document

//getting the source for each users liked videos from their liked array
app.get('/users-liked-videos/:user_id', async (req,res) => {
    const client = new MongoClient(uri)
    const userID = req.params.user_id


    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const retUser = await users.findOne({ user_id: userID })

        const usersLikedVideoIds = []

        retUser.liked_videos.forEach((video) => {
          usersLikedVideoIds.push({
              "video_id": video.video_id,
              "username" : video.username
          })
        })

        //const VideoSource = await users.findOne({username: usersLikedVideoIds[0].username })

        const videoSourcesArray = []


        for (const video of usersLikedVideoIds) {

            let VideoSource = await users.findOne({ username: video.username })
            for (let i =0; i < VideoSource.videos.length; i++) {
                let checkValue = VideoSource.videos[i]

                if (checkValue.video_id === video.video_id) {
                    videoSourcesArray.push({
                        "source" : checkValue.source,
                        "caption" : checkValue.caption
                    })
                }
            }

        }
        console.log(videoSourcesArray)

        res.send(videoSourcesArray)


    } finally {
        await client.close()
    }

})

app.put('/increment-view-count/:username/:video_id', async (req,res) => {
    const client = new MongoClient(uri)
    const username = req.params.username
    const videoID = parseFloat(req.params.video_id)
    console.log('hit')
    console.log(username)

    try {
        await client.connect()
        const database = client.db("app-data")
        const users = database.collection('users')
        //going to need to get the current views so that one can be added, similar to liking a video
        const viewsArray = await users.findOne({
            username: username,
            videos: {
                $elemMatch: {
                    video_id: videoID
                }
            }
        })

        const numViews = []

        viewsArray.videos.forEach((user) => {

            if (user.video_id === videoID) {
                const numberViews = user.views
                numViews.push(numberViews)
            }
        })

        //updating the current count of views
        const updatedViewCount = await users.findOneAndUpdate(
            {
                username: username
            }, {
                $set: {
                    "videos.$[x].views": numViews[0] + 1
                }
            }, {
                arrayFilters: [{
                    "x.video_id": videoID
                }]
            }

        )
        res.send(updatedViewCount)

    } finally {
        await client.close()
    }

})

//// messaging other users -- may be limited at first just to text, but we will add video sharing as it comes
//will use react-query with this as a test before refactoring the whole project with react-query

app.get('/get-messages/:username', async (req, res) => {
    const client = new MongoClient(uri)
    const username = req.params.username
    console.log('getting all messages')
    try {
        await client.connect()
        const database = client.db('app-data')
        const messages = database.collection('messages')

        const retMessages = await messages.findOne({ username: username})

        res.send(retMessages)


    } finally {
        await client.close()
    }

})

app.get('/specific-sent-user-messages/:username/:sentusername', async (req, res) => {
    const client = new MongoClient(uri)
    const username = req.params.username
    const sentusername = req.params.sentusername


    try {
        await client.connect()
        const database = client.db('app-data')
        const messages = database.collection('messages')
        const specific_user_messages = await messages.findOne({username: username})
        const users_messages_array = []
        specific_user_messages.conversations.forEach((message) => {
            if (message.sender_username === sentusername) {
                users_messages_array.push({

                    "sender_username": message.sender_username,
                    "profile_pic_url": message.profile_pic_url,
                    "messages": message.messages

                })
            }
        })
        res.send(users_messages_array)
    } finally {
        await client.close()
    }
})

//setting up posting messages functionality
app.put('/send-a-message/:username/:sender_username', async (req,res) => {
    const client = new MongoClient(uri)
    const username = req.params.username
    const senderusername = req.params.sender_username
    const {profile_pic_url, message, selectedUserToMessageProfilePic} = req.body

    try {
        await client.connect()
        const database = client.db('app-data')
        const messages = database.collection('messages')

        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date+' '+time;


        const messageDataStructForExistingConversation = {
                "sender_username": username,
                "profile_pic_url": profile_pic_url,
                "message": message,
                "time_stamp": dateTime,
                "likes": 0,
                "read": false
            }

            const newMessageDataStruct = {
            "username": username,
                "conversations": [
                    {
                        "sender_username": senderusername,
                        "profile_pic_url": profile_pic_url,
                        "messages": [
                            {
                                "sender_username": senderusername,
                                "profile_pic_url": profile_pic_url,
                                "message": message,
                                "time_stamp": dateTime,
                                "likes": 0,
                                "read": false
                            }
                        ]

                    }
                ]
            }

            const newConversationDataStruct = {
                "sender_username": senderusername,
                "profile_pic_url": selectedUserToMessageProfilePic,
                "messages": [
                    {
                        "sender_username": username,
                        "profile_pic_url": profile_pic_url,
                        "message": message,
                        "time_stamp": dateTime,
                        "likes": 0,
                        "read": false
                    }
                ]
            }


        const retUser = await messages.findOne({username:username})

        const existingConversation= await messages.findOne({
            username: username,
            conversations: {
                $elemMatch: {
                    sender_username: senderusername
                }
            }
        })

        /// handling of the user who sent the message
        if (retUser === null) {

            const newMessage = await messages.insertOne(newMessageDataStruct)
            res.send(newMessage)
            console.log('new user message')

        } else if (!(existingConversation === null)) {
            const updateMessage = await messages.findOneAndUpdate({
                username: username,
                conversations: {
                    $elemMatch: {
                        sender_username: senderusername
                    }
                }

            }, {
                $push: {
                    "conversations.$.messages": messageDataStructForExistingConversation
                }
            })
            console.log('updating existing conversation')
            res.send(updateMessage)
        } else {
            const createNewConversation = await messages.findOneAndUpdate({
                username: username
            }, { $push: {
                    conversations: newConversationDataStruct
                }
            })
            console.log('created new conversation')
            res.send(createNewConversation)
        }
        //handling of the user who is going to receive the message -- basically just reverse logic of the user sending???
        const receivingMessageDataStructForExistingConversation = {
            "sender_username": username,
            "profile_pic_url": profile_pic_url,
            "message": message,
            "time_stamp": dateTime,
            "likes": 0,
            "read": false
        }

        const newReceivingMessageDataStruct = {
            "username": senderusername,
            "conversations": [
                {
                    "sender_username": username,
                    "profile_pic_url": profile_pic_url,
                    "messages": [
                        {
                            "sender_username": username,
                            "profile_pic_url": profile_pic_url,
                            "message": message,
                            "time_stamp": dateTime,
                            "likes": 0,
                            "read": false
                        }
                    ]

                }
            ]
        }

        const newReceivingConversationDataStruct = {
            "sender_username": username,
            "profile_pic_url": profile_pic_url,
            "messages": [
                {
                    "sender_username": username,
                    "profile_pic_url": profile_pic_url,
                    "message": message,
                    "time_stamp": dateTime,
                    "likes": 0,
                    "read": false
                }
            ]
        }

        const retReceivingUser = await messages.findOne({username:senderusername})

        const existingReceivingUserConversation= await messages.findOne({
            username: senderusername,
            conversations: {
                $elemMatch: {
                    sender_username: username
                }
            }
        })
        if (retReceivingUser === null) {

            const newMessage = await messages.insertOne(newReceivingMessageDataStruct)
            res.send(newMessage)
            console.log('new receiving message')

        } else if (!(existingReceivingUserConversation === null)) {
            const updateMessage = await messages.findOneAndUpdate({
                username: senderusername,
                conversations: {
                    $elemMatch: {
                        sender_username: username
                    }
                }

            }, {
                $push: {
                    "conversations.$.messages": receivingMessageDataStructForExistingConversation
                }
            })
            console.log('updating existing conversation')
            res.send(updateMessage)
        } else {
            const createNewConversation = await messages.findOneAndUpdate({
                username: senderusername
            }, { $push: {
                    conversations: newReceivingConversationDataStruct
                }
            })
            console.log('created new receiving conversation')
            res.send(createNewConversation)
        }


        const users = database.collection('users')

        const userReceivedMessage = await users.findOne({username: username})
        const notificationForFollowerStruct = {
            "notification_id" : Math.random() * 10000000,
            "type" : "message notification",
            "username" : username,
            "time_stamp" : dateTime,
            "acknowledged" : false,
            "avatar": userReceivedMessage.profile_pic_url
        }
        const notificationForFollowedUser = await users.findOneAndUpdate({ username: username},
            {$push : {
                    notifications:  notificationForFollowerStruct
                }
            })



    } finally {
        await client.close()
    }
})



app.listen(PORT, () => console.log("Server is running"))