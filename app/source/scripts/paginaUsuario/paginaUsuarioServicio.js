angular.module('app' )
	.service('PgnUsuarioService', ['$http', function($http){
		

		this.guardarReceta = function(model, token){
			return $http({
				method:"POST",
				url:"https://resourceserver.es:8445/recipes/save",
				data: model,
				withCredentials: false,
				headers:{
					'Accept': 'application/json ',
					'Authorization':  token,
					'Content-type': "application/json"
				}
			})
				
			
		};

		this.buscarRecetas = function(token){
			return $http({
				method:"GET",
				url:"https://resourceserver.es:8445/recipes/recipes",
				withCredentials: false,
				headers:{
					'Accept': 'application/json ',
					'Authorization':  token,
					'Content-type': "application/json"
				}
			})
				
			
		};
	}])