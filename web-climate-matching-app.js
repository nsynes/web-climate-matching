const fs = require('fs');
const express = require('express');
const path = require('path')
const {spawn} = require('child_process')
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.get('/testAPI', function(req, res, next) {

    let outputFolder = Date.now();

    //let batchText = '#!/bin/bash\n' +
    //                'source ~/anaconda2/etc/profile.d/conda.sh\n' +
    //                'conda activate climmatch\n' +
    //                'python ./climate_matching/climate-match-tool.py -lon '+req.query.lon+' -lat '+req.query.lat+' -o '+
    //                './climate_matching/outputs/'+outputFolder+' -config ./climate_matching/online_config.txt'
    let batchText = 'call conda activate climmatch\n' +
                    'python climate_matching/climate-match-tool.py -lon '+req.query.lon+' -lat '+req.query.lat+' -o '+
                    'climate_matching/outputs/'+outputFolder+' -config climate_matching/online_config.txt'

    //var batchPath = `./climate_matching/batch/${outputFolder}.sh`;
    var batchPath = path.join(__dirname, `climate_matching/batch/${outputFolder}.bat`);

    fs.writeFile(batchPath, batchText, (err) => {

        if (err) {
            throw err;
        }

        function runScript(){
            //return spawn('bash', [batchPath]);
            return spawn(batchPath, []);
         }

         const subprocess = runScript()
         // print output of script
         subprocess.stdout.on('data', (data) => {
            console.log(`data: ${data}`);
         });
         subprocess.stderr.on('data', (data) => {
            console.log(`error: ${data}`);
         });

         subprocess.on('exit', function (code, signal) {
            console.log('child process exited with ' +
                        `code ${code} and signal ${signal}`);
            const geojsonPath = path.join(__dirname, 'climate_matching', 'outputs', `${outputFolder}`, 'map.geojson')

            fs.access(geojsonPath, fs.F_OK, (err) => {
                if (err) {
                    //console.error(err)
                    res.sendStatus(404)
                } else {
                    //file exists
                    res.sendFile(geojsonPath)
                }
            })
          });

          /*
         subprocess.stderr.on('close', () => {
            console.log("Closed");
            const geojsonPath = path.join(__dirname, 'climate_matching', 'outputs', `${outputFolder}`, 'map.geojson')

            fs.access(geojsonPath, fs.F_OK, (err) => {
                if (err) {
                    //console.error(err)
                    res.sendStatus(404)
                } else {
                    //file exists
                    res.sendFile(geojsonPath)
                }
            })
         });
         */
    });


});

app.listen(7005);
