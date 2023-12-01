# GitHub Auth on your web app, made easy.
# How to set it up :D

1. Get a client ID and a client secret from GitHub. If you don't know how to do that, please look it up.
2. Put it in .env (you'll have to set up .env support yourself) or Secrets (Replit), the client ID goes in `GH_CLIENT_ID` and the client secret goes in `GH_CLIENT_SECRET`
3. Put in this code after defining imports but before your routes. No, this code isn't obfuscated; it's minified, and you can unminify it or ask me for a normal version which I might give if I have it.

```js
const axios = require('axios')
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.get("/grab",((e,s)=>{e.cookies.accesstoken?axios.get("https://api.github.com/user",{headers:{Authorization:"Bearer "+e.cookies.accesstoken.split("=")[1]}}).then((e=>{s.send(e.data)})).catch((e=>{e.response&&401===e.response.status?s.json({error:"not authorized"}):(console.error(e),s.send("error: "+e))})):s.json({error:"not authorized"})})),app.get("/success",((e,s)=>{s.send("\n   <html>\n     <body>\n       <script>\n         window.close();\n       <\/script>\n     </body>\n   </html>\n ")})),app.get("/auth/github/callback",((e,s)=>{axios.post(`https://github.com/login/oauth/access_token?client_id=${process.env.GH_CLIENT_ID}&client_secret=${process.env.GH_CLIENT_SECRET}&code=${e.query.code}`).then((function(o){let n=(o.data+"").split("&")[0];e.cookies.accesstoken&&s.clearCookie("accesstoken"),s.cookie("accesstoken",n,{maxAge:3456e5,httpOnly:!0}),s.send("<html>\n     <body>\n       <script>\n         window.close();\n       <\/script>\n     </body>\n   </html>")})).catch((function(e){e.response?s.send(e.response.data+"\n"+e.response.status+"\n"+e.response.headers):e.request?s.send(e.request):s.send("Error",e.message),console.log(e.config)}))}));
```

(this uses axios and cookie-parser)

4. You're done for the backend :)
5. Note that you get information from GitHub by sending a GET request to /grab from the frontend. You'll get `{"error":"not authorized"}` if the user isn't authenticated but you'll get something like this if the user is authenticated:
   
```json

{"login":"DoxrGitHub","id":132623420,"node_id":"U_kgDOB-esPA","avatar_url":"https://avatars.githubusercontent.com/u/132623420?v=4","gravatar_id":"","url":"https://api.github.com/users/DoxrGitHub","html_url":"https://github.com/DoxrGitHub","followers_url":"https://api.github.com/users/DoxrGitHub/followers","following_url":"https://api.github.com/users/DoxrGitHub/following{/other_user}","gists_url":"https://api.github.com/users/DoxrGitHub/gists{/gist_id}","starred_url":"https://api.github.com/users/DoxrGitHub/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/DoxrGitHub/subscriptions","organizations_url":"https://api.github.com/users/DoxrGitHub/orgs","repos_url":"https://api.github.com/users/DoxrGitHub/repos","events_url":"https://api.github.com/users/DoxrGitHub/events{/privacy}","received_events_url":"https://api.github.com/users/DoxrGitHub/received_events","type":"User","site_admin":false,"name":null,"company":null,"blog":"","location":null,"email":null,"hireable":null,"bio":null,"twitter_username":null,"public_repos":39,"public_gists":0,"followers":1,"following":3,"created_at":"2023-05-04T22:50:32Z","updated_at":"2023-11-16T14:51:58Z"}
```

6. Set this variable with the client ID in the frontend before doing anything.
   
```js
let GH_CLIENT_ID = 'id_goes_here'
```

7. I made opening the login window like this:
   
```js
 let loginWindow = null;
 function openWindow() {
  if (loginWindow && !loginWindow.closed) {
    return;
  }
  var width = window.screen.width * 0.2;
  var height = window.screen.height * 0.5;
  var left = (window.screen.width / 2) - (width / 2);
  var top = (window.screen.height / 2) - (height / 2);
  loginWindow = window.open("https://github.com/login/oauth/authorize?client_id=" + GH_CLIENT_ID, "", `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, width=${width}, height=${height}, top=${top}, left=${left}`);
 }
 var checkClosedInterval = setInterval(function() {
  if (loginWindow && loginWindow.closed) {
    clearInterval(checkClosedInterval);
    window.location.reload();
  }
 }, 1000);
```

8. Here's how I made the fetch request:

```js
async function fetchData() {
  let change = document.getElementById('change');
  try {
    const response = await fetch('/grab');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    change.innerHTML = JSON.stringify(data);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

// fetchData();
```
Note that this displays the results to a div with the id `change` as an example but you *should* modify this to match your use case.

9. Enjoy GitHub Auth in your Node.js app :D

> Yes, there are more secure ways to do this, but this is made for beginners while trying to keep work to put it in low.

I have a live demo at https://github-oauth-callback-test.doxr.repl.co/
