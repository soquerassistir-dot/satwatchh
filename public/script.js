
function showUser(){

let u=localStorage.getItem("user")

let area=document.getElementById("userArea")

if(!u){

area.innerHTML=`
<input id="u" placeholder="user">
<input id="p" type="password" placeholder="pass">
<button onclick="login()">Login</button>
<button onclick="register()">Register</button>
`

}else{

area.innerHTML="Logado como "+u

}

}

async function register(){

let user=u.value
let pass=p.value

await fetch("/register",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({user,pass})
})

alert("registrado")

}

async function login(){

let user=u.value
let pass=p.value

let r=await fetch("/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({user,pass})
})

let j=await r.json()

if(j.ok){

localStorage.setItem("user",user)

location.reload()

}else{

alert("login errado")

}

}

async function upload(){

let file=document.getElementById("video").files[0]
let title=document.getElementById("title").value
let author=localStorage.getItem("user")||"anon"

let f=new FormData()

f.append("video",file)
f.append("title",title)
f.append("author",author)

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
<small>${v.author}</small>
`

d.onclick=()=>{

location="video.html?id="+v.id

}

grid.appendChild(d)

})

}

showUser()
load()
