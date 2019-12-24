angular.module('app' )
	.service('PgnAdminService', ['$http', function($http){
		
	


		this.devolverUsuarios = function(token, tipoUsuario){
			var url = "";
			if(tipoUsuario != "propio"){
				url = "https://authorizationserver.es:8446/admin/all/users";
			}else{
				url = "https://resourceserver.es:8445/admin/all/users"
			}
			return $http({
				method:"GET",
				url:url,
				withCredentials: false,
				headers:{
					'Accept': 'application/json ',
					'Authorization':  token,
					'Content-type': "application/json"
				}
			})
				
			
		};

		this.eliminarUsuario = function( token, id){
			
			return $http({
				method:"DELETE",
				url:"https://resourceserver.es:8445/admin/delete/"+id,
				withCredentials: false,
				headers:{
					'Accept': 'application/json ',
					'Authorization':  token,
					'Content-type': "application/json"
				}
			})
				
			
		};

		this.buscarRecetasPorId = function( token){
			
			return $http({
				method:"GET",
				url: "https://resourceserver.es:8445/admin/all/recipe",
				withCredentials: false,
				headers:{
					'Accept': 'application/json ',
					'Authorization':  token,
					'Content-type': "application/json"
				}
			})
				
			
		};

		

	}])