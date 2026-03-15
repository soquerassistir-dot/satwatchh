
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
 if(!fs.existsSync("data.json")) return {videos:[]}
 return JSON.parse(fs.readFileSync("data.json"))
}

function saveDB(d){
 fs.writeFileSync("data.json",JSON.stringify(d,null,2))
}

app.post("/upload",upload.single("video"),async(req,res)=>{

 const title=req.body.title

 const result=await cloudinary.uploader.upload(req.file.path,{
  resource_type:"video"
 })

 let db=loadDB()

 db.videos.push({
  id:Date.now(),
  title,
  url:result.secure_url,
  thumb:result.secure_url.replace(/\.[^/.]+$/, ".jpg"),
  likes:0,
  views:0,
  comments:[]
 })

 saveDB(db)

 res.send("ok")
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

 v.comments.push({text:req.body.text})
 saveDB(db)

 res.json(v)
})

app.listen(process.env.PORT||3000,()=>{
 console.log("S@tWatch V2 rodando")
})
