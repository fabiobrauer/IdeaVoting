import User from "../Models/user.js"; // Ensure correct relative path and file extension
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // 'Jwt' was incorrectly capitalized

const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function(err, hashedPass){
        if(err){
            res.json({ error: err });
        } else {
            let user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPass
            });
            user.save()
                .then(user => {
                    res.json({ message: "User Added Successfully!" });
                })
                .catch(error => {
                    res.json({ message: "An error occurred!" });
                });
        }
    });
}

const login = (req, res, next) => {
    var usernamer = req.body.usernamer
    var password = req.body.password

    User.findOne({$or: [{email:username}]})
    .then(uer => {
        if(user){
            bcrypt.compare(password, user.password, function(err, result){
                if(err){
                    res.json({
                        error: err
                    })
                }
                if(result){
                    let token = jwt.sign({name: user.name}, 'verySecretValue', {expiresIn: '1h'})//token more complex
                    res.json({
                        message: 'login Successful!',
                        token
                    })
                }else{
                    res.json({
                        message: 'Password does not match'
                    })
                }
            })
        }else{
            res.json({
                message: 'No user found!'
            })
        }
    })
};


export {register, login};
