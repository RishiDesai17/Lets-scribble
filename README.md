# Lets-scribble
An online multiplayer pictionary game driven by WebSockets.

### Setup Instructions:

#### Install dependencies:
```
npm install
cd react-client
npm install
```

#### For running in Development Mode:
- <b>Backend (runs on port 3001 by default):</b>
```
npm run dev
```

- <b> Frontend:</b>
```
cd react-client
npm start
```

#### For running in Production Mode:
- Runs on port 3001 by default.
```
cd react-client
npm run build
cd ..
npm start
```

#### Make sure you have a redis instance running on your machine.

#### Also, create a .env file in the root of the project with the following content:
```
REDIS_HOST = YOUR_REDIS_HOST_URL
REDIS_PORT = YOUR_REDIS_PORT
REDIS_PASSWORD = YOUR_REDIS_PASSWORD
```
- You can also add a PORT key if you wish to run the application on a different port than default.
- If running in development mode, you do not need to provide REDIS_HOST and REDIS_PORT. REDIS_PASSWORD also not required if no password has been set.

<br />

<p float="left" align="center">
  <img src="https://user-images.githubusercontent.com/51089917/115602599-bfe75800-a2fc-11eb-8a10-e29411a9244d.png" width="85%" />
  <!-- lobby image: "https://user-images.githubusercontent.com/51089917/115603198-7ea37800-a2fd-11eb-9497-d324cc7063a1.png" -->
  <img src="https://user-images.githubusercontent.com/51089917/115605471-2de14e80-a300-11eb-9b74-699f39ce339a.png" width="85%" />

</p>
