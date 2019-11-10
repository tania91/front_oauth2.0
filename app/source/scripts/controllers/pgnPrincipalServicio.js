angular.module('app' )
	.service('PgnPrincipalService', ['$http', '$window', function($http, $window, $rootScope){
		

		

		this.buscarTodasRecetas = function(){
				return $http({
					method:"GET",
					url:"https://localhost:8445/recipes/all",
					withCredentials: false
					
				})
					
				
			};
		

		this.recuperarTokenConCode = function(code){
				var data = "grant_type=authorization_code&redirect_uri=http://www.cocinarusa.es:8081/PFG/oauth2.0/app/dest/html/&code="+ code;
	
				return $http({
					method:"POST",
					url:"https://localhost:8446/oauth/tokens",
					data: data,
					withCredentials: false,
					headers:{
						'Accept': 'application/json ',
						'Authorization':'Basic ' + btoa('oaut2-client:secret'),
						'Content-Type':'application/x-www-form-urlencoded'
					}
					
				})
					
			};

		this.consultarRecursoConToken = function(token){
			
			return $http({
				method:"GET",
				url:"https://localhost:8445/recipes/user",
				withCredentials: false,
				headers:{
					'Authorization': token
				}
				
			});
			
		}

		this.refreshToken = function(token, code){
			var url = "";
			if(code != undefined){
				url = "https://localhost:8446/oauth/tokens";
			}else{
				url = "https://localhost:8445/oauth/tokens"
			}

			var data = "grant_type=refresh_token&&client_id=oaut2-client&client_secret=secret&refresh_token=" + token;
	
				return $http({
					method:"POST",
					url:url,
					data:data,
					withCredentials: false,
					headers:{
						'Accept': 'application/json ',
						'Content-Type':'application/x-www-form-urlencoded'
					}
					
				})
		}	

		this.buscarUsuarioConToken = function(token, code, tipoConeccion){

			var url = "";
			if(code != undefined || tipoConeccion == "CONSSO"){
				url = "https://localhost:8446/users/user";
			}else{
				url = "https://localhost:8445/users/user"
			}
			
			return $http({
				method:"GET",
				url:url,
				withCredentials: false,
				headers:{
					'Authorization': token
				}
			})
			
				
					
				
			};

		
		
	}])