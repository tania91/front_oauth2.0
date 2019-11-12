angular.module('app' )
	.service('PgnPrincipalService', ['$http', '$window','ConfigClientCtrl', function($http, $window, ConfigClientCtrl){
		

		

		this.buscarTodasRecetas = function(){
				return $http({
					method:"GET",
					url:"https://localhost:8445/recipes/all",
					withCredentials: false
					
				})
					
				
			};
		

		this.recuperarTokenConCode = function(code){
			var cliente_id = ConfigClientCtrl.getConfig().tercero.client_id;
			var client_secret = ConfigClientCtrl.getConfig().tercero.client_secret;

			var data = "grant_type=authorization_code&redirect_uri=http://www.cocinarusa.es:8081/PFG/oauth2.0/app/dest/html/#!/&code="+ code;

			return $http({
				method:"POST",
				url:"https://localhost:8446/oauth/tokens",
				data: data,
				withCredentials: false,
				headers:{
					'Accept': 'application/json ',
					'Authorization':'Basic ' + btoa(cliente_id+':'+client_secret),
					'Content-Type':'application/x-www-form-urlencoded'
				}
				
			})
				
		};

		this.consultarRecursoConToken = function(token, flag){
			
			return $http({
				method:"GET",
				url:"https://localhost:8445/recipes/user/" + flag,
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
				var cliente_id = ConfigClientCtrl.getConfig().tercero.client_id;
				var client_secret = ConfigClientCtrl.getConfig().tercero.client_secret;
			}else{
				url = "https://localhost:8445/oauth/tokens"
				var cliente_id = ConfigClientCtrl.getConfig().propio.client_id;
				var client_secret = ConfigClientCtrl.getConfig().propio.client_secret;
			}

			var data = "grant_type=refresh_token&client_id="+cliente_id+"&client_secret="+client_secret+"&refresh_token=" + token;
	
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