const express = require('express');
const bodyParser = require('body-parser');
var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'db_todo'
});

function requestToDatabase(query, params = {}, callback){
    connection.query(query, params, function (error, results, fields) {
      if (error) throw error;
      try{
        callback(results);
      }catch(err){
        console.log(err);
      }
    });
}

const app = express();
const port = 3000;

const todoRouter = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

todoRouter.use('/', (req, res, next) => {
    req.activity = Object.assign(req.params, req.body, req.query);
    if(req.method === 'POST'){
        if(req.activity.username == undefined || req.activity.password == undefined ){
            res.send({message : 'username or password  can\'t empty'});
            return;
        }else{
            next();
        }  
    };
    requestToDatabase(`SELECT * FROM activity 
                        WHERE username = ? 
                        AND password = ?`,
                        [
                            req.activity.username,
                            req.activity.password
                        ],
                        result =>{
                            if(result.length){
                                next();
                            }else{
                                res.send({message : 'auth failed or data not found add username and password in url query or json raw data'});
                            }
                        }
                    );
});

todoRouter.route('/')
    .get((req, res) => {
        let ORDER_BY = mysql.raw(`ORDER BY priority ${req.query.priority ? req.query.priority : '' }`);

        requestToDatabase('SELECT * FROM activity WHERE username = ? AND password = ? ?', [req.activity.username, req.activity.password,ORDER_BY], (result) =>{
            res.send(result);
        });
    })
    .post((req, res) => {
        requestToDatabase('INSERT INTO activity SET ? ', req.body, result =>{
            res.send(result);
        });
    });

// Middleware
todoRouter.use('/:activity_id', (req, res, next) => {
    req.activity = Object.assign(req.params, req.body, req.query);
    requestToDatabase(`SELECT * FROM activity 
                        WHERE activity_id = ? 
                        AND username = ? 
                        AND password = ?`,
                        [
                            req.activity.activity_id,
                            req.activity.username,
                            req.activity.password
                        ],
                        result =>{
                            if(result.length){
                                next();
                            }else{
                                res.send({message : 'auth failed or data not found add username and password in url query or json raw data'});
                            }
                        }
                    );

});

todoRouter.route('/:activity_id')
    .get((req, res) =>{
        requestToDatabase('SELECT * FROM activity WHERE ?', req.params, result =>{
            res.send(result);
        });
    })
    .put((req, res) => {
        let {name, priority, location, time_start, username, password, activity_id} = req.activity;
        requestToDatabase(
            `UPDATE activity SET 
                name = ? ,
                priority = ?,
                location = ?,
                time_start = ?,
                username = ?,
                password = ?
            WHERE
                activity_id = ?
            `,
            [
                name,
                priority,
                location,
                time_start,
                username,
                password,
                activity_id
            ],
            result => res.send(result)
        );
    })
    .delete((req, res) => {
        let {activity_id} = req.params;
        requestToDatabase('DELETE FROM activity WHERE activity_id = ?', [activity_id], result => res.send(result))
    });

app.use('/todo', todoRouter);

app.listen(port, () => {
    console.log('listen on port' + port);
});