var uuid = require('node-uuid');

module.exports = function(Camera) {
	Camera.observe('before save', function addId(ctx, next) {
		if (ctx.instance && !ctx.instance.id) {
			ctx.instance.id = uuid.v1();
		}
		next();
	});


    Camera.prototype.toJSON = function() {
        var camera = this.toObject(false, true, false);
        if(camera.pos) {
            camera.pos = camera.pos;
        }
        return camera;
    };

};
