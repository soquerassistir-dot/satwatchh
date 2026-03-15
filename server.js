
const express=require("express")
const multer=require("multer")
const fs=require("fs")
const { v2:cloudinary }=require("cloudinary")

const app=express()

app.use(express.json())
app.use(express.static("public"))

cloudinary.config({
 cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
 api_key:process.env.CLOUDINARY_API_KEY,
 api_secret:process.env.CLOUDINARY_API_SECRET
})

const upload=multer({dest:"temp/"})

function loadDB(){
 if(!fs.existsSync("data.json")){
  return {users:[],videos:[],subs:{}}
 }
 return JSON.parse(fs.readFileSync("data.json"))
}

function saveDB(d){
 fs.writeFileSync("data.json",JSON.stringify(d,null,2))
}

app.post("/register",(req,res)=>{

 let db=loadDB()

 const {user,pass}=req.body

 if(db.users.find(u=>u.user==user)){
  return res.json({error:"user exists"})
 }

 db.users.push({user,pass})

 saveDB(db)

 res.json({ok:true})
})

app.post("/login",(req,res)=>{

 let db=loadDB()

 const {user,pass}=req.body

 const u=db.users.find(x=>x.user==user && x.pass==pass)

 if(!u) return res.json({error:"login failed"})

 res.json({ok:true})
})

app.post("/upload",upload.single("video"),async(req,res)=>{

 const {title,author}=req.body

 const result=await cloudinary.uploader.upload(req.file.path,{resource_type:"video"})

 let db=loadDB()

 db.videos.push({
  id:Date.now(),
  title,
  author,
  url:result.secure_url,
  thumb:result.secure_url.replace(".mp4",".jpg"),
  likes:0,
  views:0,
  comments:[]
 })

 saveDB(db)

 res.json({ok:true})
})

app.get("/videos",(req,res)=>{
 res.json(loadDB().videos)
})

app.get("/video/:id",(req,res)=>{

 let db=loadDB()

 const v=db.videos.find(x=>x.id==req.params.id)

 v.views++

 saveDB(db)

 res.json(v)
})

app.post("/like/:id",(req,res)=>{

 let db=loadDB()

 const v=db.videos.find(x=>x.id==req.params.id)

 v.likes++

 saveDB(db)

 res.json(v)
})

app.post("/comment/:id",(req,res)=>{

 let db=loadDB()

 const v=db.videos.find(x=>x.id==req.params.id)

 v.comments.push({
  user:req.body.user,
  text:req.body.text
 })

 saveDB(db)

 res.json(v)
})

app.post("/subscribe",(req,res)=>{

 let db=loadDB()

 const {user,channel}=req.body

 if(!db.subs[channel]) db.subs[channel]=[]

 if(!db.subs[channel].includes(user)){
  db.subs[channel].push(user)
 }

 saveDB(db)

 res.json({ok:true})
})

app.listen(process.env.PORT||3000,()=>{
 console.log("S@tWatch V3 rodando")
})
