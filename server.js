var io = require("socket.io")(5000);
var users = [];
var unplayedusers = [];


io.on("connection",function(socket){
	
	socket.playingWith = -1;
	users.push(socket);
	socket.on('getUser',function(data){
		console.log("user want to play");
		if(unplayedusers.length == 0){
			unplayedusers.push(socket);
		}else{
			
			var player = unplayedusers.pop();
			//console.log(player.playingWith);
			var index1 = users.indexOf(player);
			var index2 = users.indexOf(socket);
			player.playingWith = index2; 
			socket.playingWith = index1; 
			socket.emit('playerFound',0);
			player.emit('playerFound',1);

		}
	});

	socket.on('number',function(data){
		if(socket.playingWith !=-1)
			users[socket.playingWith].emit('number',data);
	});


	socket.on('win',function(data){
		users[users[users.indexOf(socket)].playingWith].emit('win',{});
		users[socket.playingWith].playingWith = -1;
		socket.playingWith = -1; 
		
	});

	socket.on('disconnect',function(){
		
		if(socket.playingWith == -1){
			unplayedusers.pop();
			users.splice(users.indexOf(socket),1);

		}else{		
			
			users[socket.playingWith].emit('disconnect1',{});
			users[socket.playingWith].playingWith = -1;
			users.splice(users.indexOf(socket),1);

		}
		
	});
});