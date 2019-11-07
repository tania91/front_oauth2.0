angular.module('app' )
	.service('PgnUsuarioService', ['$http', function($http){
		
		/*this.buscarRecetas = function(token, link){
			return $http({
				method:"GET",
				url:"https://localhost:8444/gestionarReceta/api/buscar/auth",
				headers:{
					Authorization:  token,
					Link: link
				}
				
			})
				
			
		};*/

		this.validarConexion = function(token){
				
			return $http({
				method:"GET",
				url:"https://localhost:8445/conection/",
				withCredentials: false,
				headers:{
					'Authorization':  token
				}
			})
				
			
		};

		/*this.revalidarConexion = function(token){
				
			return $http({
				method:"POST",
				url:"https://localhost:8443/gestionarToken/verificacion/refreshToken",
				headers:{
					Authorization: 'Refresh ' + token
				}
			})
				
			
		};*/

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