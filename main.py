from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

app = FastAPI()

# Mount static folder
app.mount("/static", StaticFiles(directory="static"), name="static")

# Mount templates folder
templates = Jinja2Templates(directory="templates")

# In-memory database
todos_db = {}
todo_id_counter = 0

@app.get("/", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/signup", response_class=HTMLResponse)
async def signup_page(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})

@app.get("/todo", response_class=HTMLResponse)
async def todo_page(request: Request):
    username = request.cookies.get("currentUser")
    if not username:
        return RedirectResponse(url="/", status_code=303)
    user_todos = todos_db.get(username, [])
    return templates.TemplateResponse("index.html", {"request": request, "todos": user_todos})

@app.post("/todos")
async def add_todo(request: Request, title: str = Form(...)):
    global todo_id_counter
    username = request.cookies.get("currentUser")

    if username:
        todo_id_counter += 1
        todo_item = {"id": todo_id_counter, "title": title, "completed": False}
        todos_db.setdefault(username, []).append(todo_item)
    return RedirectResponse(url="/todo", status_code=303)

@app.post("/todos/{todo_id}/complete")
async def complete_todo(todo_id: int, request: Request):
    username = request.cookies.get("currentUser")
    if username:
        for todo in todos_db.get(username, []):
            if todo["id"] == todo_id:
                todo["completed"] = True
                break
    return RedirectResponse(url="/todo", status_code=303)

@app.post("/todos/{todo_id}/delete")
async def delete_todo(todo_id: int, request: Request):
    username = request.cookies.get("currentUser")
    if username:
        todos_db[username] = [todo for todo in todos_db.get(username, []) if todo["id"] != todo_id]
    return RedirectResponse(url="/todo", status_code=303)
