import express = require('express');
import { PythonShell } from 'python-shell';
import cors from 'cors';
import multer from 'multer';

const app: express.Application = express();
const upload = multer({ dest: 'tmp/'});


app.get('/', function (req, res) {
    PythonShell.run('hello.py', {}, (err, results) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log("Results: %j", results)
    });
    res.send('Hello World!');
});

app.post('/infer',upload.single('dataset'), async (req, res) => {
    let result;
    res.set('Content-Type', 'application/json');
    try {
        let data = req.file;
        PythonShell.run('/mnt/d/repos/tfstart/scripts/infer_image.py',{args: [data.filename]}, (err,results) => {
            if(err) {
                console.log(err);
                throw err;
            }
            result = results;
        });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
    res.send(result);
});

app.use(cors())

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
