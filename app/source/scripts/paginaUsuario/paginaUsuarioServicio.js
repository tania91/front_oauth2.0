angular.module('app' )
	.service('PgnUsuarioService', ['$http', function($http){
		

		this.guardarReceta = function(model, token){
			return $http({
				method:"POST",
				url:"https://localhost:8445/recipes/save",
				data: model,
				withCredentials: false,
				headers:{
					'Accept': 'application/json ',
					'Authorization':  token,
					'Content-type': "application/json"
				}
			})
				
			
		};
	}])