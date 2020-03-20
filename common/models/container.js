module.exports = function(Container) {
    /*Container.afterRemote( 'upload', function( ctx, modelInstance, next) {    
        if (modelInstance.result.files.file.length > 0)  {
            var fileName = modelInstance.result.files.file[0].name;

            var Retinopathy = Container.app.models.Retinopathy;

            Retinopathy.predict(fileName, function(err, prediction) {
                if (err) return cb(err);

                next(prediction);        
            });
        } else
            next();
    });*/
};