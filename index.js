const express = require('express')
const path = require('path')

const app = express();

app.use(express.static(path.join(process.cwd(), 'public')));
app.get('/', (req, res) => {
   res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

/* gh auth start 
------------------
*/
const axios = require('axios')
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.get("/grab",((e,s)=>{e.cookies.accesstoken?axios.get("https://api.github.com/user",{headers:{Authorization:"Bearer "+e.cookies.accesstoken.split("=")[1]}}).then((e=>{s.send(e.data)})).catch((e=>{e.response&&401===e.response.status?s.json({error:"not authorized"}):(console.error(e),s.send("error: "+e))})):s.json({error:"not authorized"})})),app.get("/success",((e,s)=>{s.send("\n   <html>\n     <body>\n       <script>\n         window.close();\n       <\/script>\n     </body>\n   </html>\n ")})),app.get("/auth/github/callback",((e,s)=>{axios.post(`https://github.com/login/oauth/access_token?client_id=${process.env.GH_CLIENT_ID}&client_secret=${process.env.GH_CLIENT_SECRET}&code=${e.query.code}`).then((function(o){let n=(o.data+"").split("&")[0];e.cookies.accesstoken&&s.clearCookie("accesstoken"),s.cookie("accesstoken",n,{maxAge:3456e5,httpOnly:!0}),s.send("<html>\n     <body>\n       <script>\n         window.close();\n       <\/script>\n     </body>\n   </html>")})).catch((function(e){e.response?s.send(e.response.data+"\n"+e.response.status+"\n"+e.response.headers):e.request?s.send(e.request):s.send("Error",e.message),console.log(e.config)}))}));

// GH AUTH COMPLETED

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
