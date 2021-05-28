const express = require('express')
const router = express.Router()
const Stat = require('../model/Stat')
const jwt = require('jsonwebtoken')
const User = require('../model/User')
const mongoose = require('mongoose')
const verifyToken = require('../routes/verifyToken')

router.post('/',verifyToken,async (req,res) =>{
    const {_id} = jwt.decode(req.header('auth-token'))
    const user = mongoose.Types.ObjectId(_id)

     const stat = new Stat({
        user:user,
        score:req.body.score,
        level:req.body.level
     })
     try{
         const savedScore = await stat.save()
         res.send(savedScore)
     }
     catch(err){
         res.status(400).send("Invalid Access")
     }
})


router.get('/:userId', async(req,res) =>{
    const userId = req.params.userId
    const user = await User.findOne({_id: mongoose.Types.ObjectId(userId)})
    const noOfGamesPlayed = await Stat.find({user:mongoose.Types.ObjectId(userId)}).count()
    if(noOfGamesPlayed === 0){
        return res.json({noOfGamesPlayed:0})
    }

    let averageScore = await Stat.aggregate([{ $match:{user:mongoose.Types.ObjectId(userId)}},{$group:{_id:null,averageScore:{$avg:"$score"}}}])
    averageScore = averageScore[0].averageScore
    let maxLevel = await Stat.aggregate([{$match:{user:mongoose.Types.ObjectId(userId)}},{$group:{_id:null,maxLevel:{$max:"$level"}}}])
    maxLevel = maxLevel[0].maxLevel
    res.json({noOfGamesPlayed,averageScore,maxLevel,name:user.name})
})


router.get('/', async (req,res) =>{
    const stats = await Stat.find({}).populate('user','name').sort({score:-1}).limit(10)
    res.json(stats)
})


module.exports = router