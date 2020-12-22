var myApp = angular.module("myApp",['ui.router'])
myApp.config(function($stateProvider,$urlRouterProvider){

	$urlRouterProvider.when("","/");

	$stateProvider
	.state("main",{
		url:"/",
		templateUrl:"pg.html",
		controller:"mycontroller"
	})
	.state("signup",{
		url:"/signup/:User_Token",
		templateUrl:"signup.html",
		controller:"mycontroller"
	})
	.state("cart",{
		url:"/cart",
		templateUrl:"cart.html",
		controller:"mycontroller"
	})
	.state("login",{
		url:"/login",
		templateUrl:"login.html",
		controller:"mycontroller"
	})
	.state("register",{
		url:"/register",
		templateUrl:"register.html",
		controller:"mycontroller"
	})
});

myApp.controller("mycontroller",function($scope,$http,$state,$stateParams){
	console.log("mycontroller ====>>");
	 
$scope.login =function(){


		if ($scope.mail == "" || $scope.mail == undefined) {
			usernamemsg = "Select username"
			alert('Select username: ');
		} else {
			usernamemsg = ""
		}
		if ($scope.password == "" || $scope.password == undefined) {
			passwordmsg = "Select password"
			alert('Select password: ');
		} else {
			passwordmsg = ""
		}
		if (usernamemsg == "" && passwordmsg == ""){
	$http({
		url : "/login" ,
		method :"post" ,
		headers :{"content-type":"application/json"} ,
		data : {mail:$scope.mail,password:$scope.password}
	
	}).then(function(response){
		console.log("response ===>>",response);
		if (response.data.status == true) {
		    
			$scope.User_Token =response.data.token;

			console.log('$scope.User_Token: ', $scope.User_Token);

			$state.go("signup", ({ User_Token: $scope.User_Token.token }))
          }else{
			  alert('you are not Registered user Please Register ')

			   $state.go("register")
		  }

		},function(error){
			console.log("response $$ ===>>",error);
	     
	    })
		}
   }

 
$scope.submitdata =function(){
	console.log("submitdata ==>>");
	$http({
		url : "/adduser_api" ,
		method :"post" ,
		headers :{"content-type":"application/json"} ,
		data : {name:$scope.name,emailid:$scope.emailid,password:$scope.password}
	
	}).then(function(response){
		// console.log("response ===>>",response);

		$scope.fetch()

	},function(error){
		// console.log("response $$ ===>>",response);
     
    })
}


   $scope.Upload =function(){
	var fileUpload = document.getElementById("fileUpload");
	var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
	if (regex.test(fileUpload.value.toLowerCase())) {
		if (typeof (FileReader) != "undefined") {
			var reader = new FileReader();
			reader.onload = function (e) {
				console.log(" e ====>>",e);
				var table = document.createElement("table");
				var rows = e.target.result.split("\n");
				for (var i = 0; i < rows.length; i++) {
					var cells = rows[i].split(",");
					if (cells.length > 1) {
						var row = table.insertRow(-1);
						for (var j = 0; j < cells.length; j++) {
							var cell = row.insertCell(-1);
							cell.innerHTML = cells[j];
						}
					}
				}
				var dvCSV = document.getElementById("dvCSV");
				dvCSV.innerHTML = "";
				dvCSV.appendChild(table);
			}
			reader.readAsText(fileUpload.files[0]);
		} else {
			alert("This browser does not support HTML5.");
		}
	} else {
		alert("Please upload a valid CSV file.");
	}
}
})