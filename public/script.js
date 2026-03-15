
async function upload(){

let file=document.getElementById("video").files[0]
let title=document.getElementById("title").value

let f=new FormData()

f.append("video",file)
f.append("title",title)

await fetch("/upload",{method:"POST",body:f})

load()
}

async function load(){

let res=await fetch("/videos")
let videos=await res.json()

let grid=document.getElementById("videos")
grid.innerHTML=""

videos.forEach(v=>{

let d=document.createElement("div")
d.className="card"

d.innerHTML=`
<img src="${v.thumb}">
<p>${v.title}</p>
`

d.onclick=()=>{
location="video.html?id="+v.id
}

grid.appendChild(d)

})
}

load()
