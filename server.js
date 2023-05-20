const express = require("express")
const app = express();
const server = require("http").createServer(app);
var set = false;

let io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});


var loginUsers = [];
var disconnectedUser = "";

io.on('connection', function (socket) {
    console.log('Connection made on ' + socket.id); // eslint-disable-line no-console

    socket.on('sendmessage', function (messageData) {

            io.to(messageData.id).emit('toClient', messageData);

    });



    socket.on("setSocket", function (userid) {
        // socket.id = userid;

        const userDetails = {
            name: socket.id,
            id: userid
        }

        loginUsers.push(userDetails);

        console.log("LOGIN USERS : ");
        loginUsers.forEach(user => {
            console.log("USER : " + user.name);
            console.log("USER ID : " + user.id);
        });

        io.emit('loginusers', loginUsers);
        console.log("emitttinnngg..");
    });

    // socket.on('removeuser',function(data){

    // });

    socket.on('userLeft', function (data) {
        loginUsers = loginUsers.filter(function (user) {
            console.log(user.id + ", " + data.id);
            return user.id !== data.id;
        });
        disconnectedUser = data.id;
        console.log("REMOVING USER FROM THE SERVER...");
        io.emit("loginusers", loginUsers);
    });



    socket.on('disconnect', function () {

        console.log("DISCONNECTING....");

        console.log(disconnectedUser + " Disconnected");
        io.emit('left',disconnectedUser);

    });

});
server.listen(3000, () => console.log("server listening on port 3000"));