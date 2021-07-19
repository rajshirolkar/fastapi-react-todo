# FARM stack (FastAPI React Mongo) Todo APP 

## Implemented features
### Backend - 18 endpoints in
- JWT Authentication at backend with __Login__, __Register__, __Reset Password__ endpoints.
- Create Read Update Delete __Users__
- First Admin can make other users Admin
- Create Read Update Delete __Tasks__
- __Bookmark__ - only Task __owner__ can bookmark a Task
- __Approve Task__ - only __Admin__ can approve a task
- __Complete Task__ - both __User__ and __Admin__ can complete a task

### Frontend
- Login page
- Register page
- List all Tasks
- Create a new Task
- Delete a Task
- Bookmark a todo

## Installation

### Backend
- Go into `/backend` and install `/requirements.txt`.
```sh
pip install -r requirements.txt
python -m main.py   
```
- Go to [http://127.0.0.1:8000/docs#/]

### Frontend
- Go into `/forntend` and run:
```sh
npm install
npm start
```

- Now go to [http://localhost:3000/login] and you should see a Login Page

## First Steps

### Registration
- Register a new user with [http://localhost:3000/register]
- Enter email as _pratik@velotio.com_ to register yourself as a User.
- Only an Admin can make other users as Admin. 
- So to make _pratik@velotio.com_ as Admin go to [http://127.0.0.1:8000/docs#/] and hit the endpoint `/run-after-pratik-register-to-make-first-admin` which  will convert _pratik@velotio.com_ to an Admin (Superuser).
- Now using this Admin we can PATCH other users as Admin

### Login
- Now Login at [http://localhost:3000/login] and start creating TODOs
- The blue Bookmark icon bookmarks a TODO
- The red delete icon deletes a TODO

### Config
- For backend config :  `/backend/config/__init.py__`
- For frontend config: `/frontend/src/constants/apiConstants.js`
- You can set the config variables according to your convenience
