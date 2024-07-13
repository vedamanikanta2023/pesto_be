import Joi from "joi";

export const validateEditTodo = async (req, res, next) => {
    try {
        console.log("nddjd")
        if (!req.body ||  Object.keys(req.body).length === 0) {
            return  res.send({status:404,message:'INVALID-REQUEST'});
        }
        const payload = req.body;
        console.log(payload, "payload");
        
        const schema = Joi.object().keys({
            _id:Joi.string().required(),
            status: Joi.string().required(),
            description: Joi.string().required(),
            title:Joi.string().required()
        });

        const { error } = schema.validate(payload);
        console.log('error',error,'*********error*****');
        if (error === null || error === undefined) {
            next();
        } else {
            return res.send({status:404,message:'REQUIRED-FIELDS-ARE-MISSING'});
        }
    } catch (err) {
        console.log('err',err);
        res.send({status:404,message:'SOME-THING-WENT-WRONG, in catch'});
        // res.error(req, res, err, 'SOME-THING-WENT-WRONG');
    }
}

export const validateAddTodo = async (req, res, next) => {
    try {
        console.log("nddjd")
        if (!req.body ||  Object.keys(req.body).length === 0) {
            return  res.send({status:404,message:'INVALID-REQUEST'});
        }
        const payload = req.body;
        
        const schema = Joi.object().keys({
            status: Joi.string().required(),
            description: Joi.string().required(),
            title:Joi.string().required()
        });

        const { error } = schema.validate(payload);
        if (error === null || error === undefined) {
            next();
        } else {
            return res.send({status:404,message:'REQUIRED-FIELDS-ARE-MISSING'});
        }
    } catch (err) {
        console.log('err',err);
        res.send({status:404,message:'SOME-THING-WENT-WRONG, in catch'});
        // res.error(req, res, err, 'SOME-THING-WENT-WRONG');
    }
}

export const validateDeleteTodo = async (req, res, next) => {
    try {
        console.log("nddjd")
        if (!req.body ||  Object.keys(req.body).length === 0) {
            return  res.send({status:404,message:'INVALID-REQUEST'});
        }
        const payload = req.body;
        
        const schema = Joi.object().keys({
            id:Joi.string().required()
        });

        const { error } = schema.validate(payload);
        if (error === null || error === undefined) {
            next();
        } else {
            return res.send({status:404,message:'REQUIRED-FIELDS-ARE-MISSING'});
        }
    } catch (err) {
        console.log('err',err);
        res.send({status:404,message:'SOME-THING-WENT-WRONG, in catch'});
        // res.error(req, res, err, 'SOME-THING-WENT-WRONG');
    }
}
