# todo-api
just personal project for learn node and express

1. clone this project
2. create localhost database name db_todo execute the sql db_todo.sql
3. open terminal in root project type `npm i`
4. after that type `npm start`

-for first step u can use this or see guide below

http://localhost:3000/todo/1?username=tendi&password=tendiPassword

GUIDE

CREATE
    http://localhost:3000/todo
    method : POST
    JSON RAW :
    {
        "name" : "hura hura",
        "priority" : "3",
        "location" : "Di Bandung",
        "time_start" : "20:20:20",
        "username" : "tendi",
        "password" : "tendiPassword"
    }
+++ Auth In delete and Update can be in query url or json raw data
UPDATE
    http://localhost:3000/todo/:activity_id?username=tendi&password=tendiPassword
    method : PUT
    JSON RAW :
    {
        "name" : "hura hura edited",
        "priority" : "3",
        "location" : "Di Bandung",
        "time_start" : "20:20:20",
        "username" : "tendi",
        "password" : "tendiPassword"
    }

DELETE
    http://localhost:3000/todo/:activity_id?username=tendi&password=tendiPassword
    method: DELETE

GET
    http://localhost:3000/todo?username=tendi&password=tendiPasswords
    method: GET
    desc : get all data

    http://localhost:3000/todo?priority=:(DESC || ASC)?username=tendi&password=tendiPassword
    method: GET
    desc : sorting by priority ASC or DESC
    
    http://localhost:3000/todo/:activity_id?username=tendi&password=tendiPassword
    method: GET
    desc : get single data
