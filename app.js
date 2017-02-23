var app = angular.module("bingo",[]);
var socket= io.connect("http://192.168.0.5:5000");
//var socket = io.connect("http://nodejs-webytoz.rhcloud.com");
app.controller('mainCtrl', ['$scope', function ($scope) {
	
	$scope.same = {
		show:1,
		message : "Waiting for Player..",
		linear: [],
		matrix:[],
		turn:0,
		message1:"click on Play now to start playing"
	};
  
 

 
   
   /*
   * Get player from the server 
   *
   */
   socket.on('playerFound',function(data){
   	
   	$scope.same.turn = data;
   	if($scope.same.turn){
   		$scope.same.message  = "your turn";
   	}
   	else
   		$scope.same.message = "wait for your turn ";
   	$scope.$digest();
   });

  /* When user hit the any number 
  *
  **/
  socket.on('number',function(data){
  	 console.log(data);
		    var t = $scope.same.linear.indexOf(data);
			var i = Math.floor(t/5);
			var j = t%5;
			$scope.same.matrix[i][j] =0;
			var temp = checkBingo($scope.same.matrix);
			 if(temp>=5){
			 	socket.emit('win',{});
			 	$scope.same.show = 1; 
			 	$scope.same.message1 = "You won ";
			 }
			 $scope.same.turn = 1; 
			 $scope.same.message = "your turn";
			 $scope.$digest();
  });


/* when other player win  or user disconnect
*
*
*/
socket.on('win',function(data){
	$scope.same.message1 = "Other player won "; 
	$scope.same.show = 1;
	$scope.$digest();
});

socket.on('disconnect1',function(data){
	$scope.same.message1 = "Player disconnected.  Play with another one";
	$scope.same.show = 2; 
	
		$scope.$digest();

});
	 /* getPlayer function();
 	*
 	*
 	*/
 	function getPlayer(){
 		socket.emit('getUser',{});
 		
 	}


	/*
	* make the random matrix for bingo 
	*
	*
	*
	*/
	 $scope.same.makeMatrix = function(){
     for(var i =0 ;i <25; i++){
        var x = Math.floor((Math.random() * 25) + 1);
        while($scope.same.linear.indexOf(x) != -1){
        	x = Math.floor((Math.random() * 25) + 1);
        }
        $scope.same.linear[i] = x;

     }
     
	 var k = 0; 
	 
	
	for(var i = 0; i<5; i++)
		$scope.same.matrix[i] = [];

	for(var i = 0; i<5; i++)
		for(var j=0;j<5; j++){
			$scope.same.matrix[i][j] = $scope.same.linear[k++];
		}
	}
/***********  function ends ******************/
	$scope.same.willtoplay = function(){
		$scope.same.turn = 0; 
		$scope.same.linear = [];
		getPlayer();
		$scope.same.makeMatrix();
		$scope.same.show = 2; 
		$scope.same.message = "waiting for player..";
	}

	

	$scope.same.numClick = function(value){
		//e.classList.add("crossed");
		if($scope.same.turn){
			$scope.same.turn = 0;
			var t = $scope.same.linear.indexOf(value);
			var i = Math.floor(t/5);
			var j = t%5;
			$scope.same.matrix[i][j] =0;
			var temp = checkBingo($scope.same.matrix);
			 if(temp>=5){

			 	socket.emit('win',{});
			 	$scope.same.show = 1; 
			 	$scope.same.message1 = "You won";
			 }else{
			 	socket.emit('number',value);
			 }
			$scope.same.message = "wait for your turn";
			
	}
		
	}

	

	
}]);

function checkBingo(m){
	var num = 0; 
	for(var i=0; i<5; i++){
        if(!(m[i][0] || m[i][1] || m[i][2] || m[i][3] || m[i][4]))
        	num++;
        if(!(m[0][i] || m[1][i] || m[2][i] || m[3][i] || m[4][i]))
        	num++;
	}

	if(!(m[0][0] || m[1][1] || m[2][2] || m[3][3] || m[4][4]))
        	num++;
        if(!(m[4][0] || m[3][1] || m[2][2] || m[1][3] || m[0][4]))
        	num++;

     return num;    
}

