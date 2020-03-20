'use strict';

const exec = require('child_process').exec;
const fs = require('fs');

module.exports = function(Retinopathy) {
    Retinopathy.predict = function(imageName, cb) {    
        const labelImageDir = './trained-model/label_image.py';
        const outputGraphDir = './trained-model/output_graph.pb';
        const outputLabelsDir = './trained-model/output_labels.txt';
        const imageDir = Retinopathy.app.datasources['storage'].settings.root + '/temp/' + imageName;

        var command = 'python3 ' + labelImageDir + ' --graph=' + outputGraphDir + ' --labels=' + outputLabelsDir + ' --input_layer=Placeholder --output_layer=final_result --image=' + imageDir;

        exec(command, (err, stdout, stderr) => {
            if (err) return cb(err);

            cb(null, parsePrediction(stdout));
            console.log('Retinopathy Prediction stderr: ' + stderr);

            // delete predicted image
            fs.unlink(imageDir, err => {
                if (err) return cb(err);
            });
        });
    }

    // Parse string prediction into json
    function parsePrediction(stdout) {
        const outputResult = stdout;

        // transform outputResult
        const splittedResult = outputResult.split('\n');

        // generation json
        let predictionJson = {};
        
        splittedResult.forEach(data => {
            if (data !== '') {
                const splittedData = data.split(' ');
                predictionJson[splittedData[0]] = Number(splittedData[splittedData.length - 1]);
            }
        });

        return predictionJson;
    }

    Retinopathy.remoteMethod(
        'predict',
        {
            description: 'Retinopathy prediction',
            accepts: {arg: 'imageName', type: 'string', required: true},
            returns: {arg: 'prediction', type: 'object'},
            http: {verb: 'get'}
        }
    );
};