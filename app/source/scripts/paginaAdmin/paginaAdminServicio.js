angular.module('app' )
	.service('PgnAdminService', ['$http', function($http){
		
	


		this.devolverUsuarios = function(token, tipoUsuario){
			var url = "";
			if(tipoUsuario != "propio"){
				url = "https://localhost:8446/admin/all/users";
			}else{
				url = "https://localhost:8445/admin/all/users"
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

		this.eliminarUsuario = function( token, tipoUsuario, id){
			var url = "";
			if(tipoUsuario == "tercero"){
				url = "https://localhost:8446/admin/delete/"+id;
			}else{
				url = "https://localhost:8445/admin/delete/"+id;
			}
			return $http({
				method:"DELETE",
				url:url,
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
				url: "https://localhost:8445/admin/all/recipe",
				withCredentials: false,
				headers:{
					'Accept': 'application/json ',
					'Authorization':  token,
					'Content-type': "application/json"
				}
			})
				
			
		};

		this.eliminarUsuarioRecetas = function(token, id){
			
			return $http({
				method:"DELETE",
				url: "https://localhost:8445/admin/delete/recipe/" + id,
				withCredentials: false,
				headers:{
					'Accept': 'application/json ',
					'Authorization':  token,
					'Content-type': "application/json"
				}
			})
				
			
		};

	}])