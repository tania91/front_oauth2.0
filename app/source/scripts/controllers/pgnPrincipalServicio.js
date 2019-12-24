angular.module('app' )
	.service('PgnPrincipalService', ['$http', '$window','ConfigClientCtrl', function($http, $window, ConfigClientCtrl){
		

		

		this.buscarTodasRecetas = function(){
				return $http({
					method:"GET",
					url:"https://resourceserver.es:8445/recipes/all"
					
				})
					
				
			};
		

		this.recuperarTokenConCode = function(code){
			var cliente_id = ConfigClientCtrl.getConfig().tercero.client_id;
			var client_secret = ConfigClientCtrl.getConfig().tercero.client_secret;

			var data = "grant_type=authorization_code&redirect_uri=http://www.cocinarusa.es:80/PFG/oauth2.0/app/dest/html/#!/&code="+ code;

			return $http({
				method:"POST",
				url:"https://authorizationserver.es:8446/oauth/tokens",
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
				url:"https://resourceserver.es:8445/recipes/user/" + flag,
				withCredentials: false,
				headers:{
					'Authorization': token
				}
				
			});
			
		}

		this.refreshToken = function(token, code){
			var url = "";
			

			if(code != undefined){
				url = "https://authorizationserver.es:8446/oauth/tokens";
				var cliente_id = ConfigClientCtrl.getConfig().tercero.client_id;
				var client_secret = ConfigClientCtrl.getConfig().tercero.client_secret;
			}else{
				url = "https://resourceserver.es:8445/oauth/tokens"
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
			if(code != undefined ){
				url = "https://authorizationserver.es:8446/users/user";
			}else{
				url = "https://resourceserver.es:8445/users/user"
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

		this.logout = function(token, code, tipoConeccion){
			var cliente_id = ConfigClientCtrl.getConfig().propio.client_id;
			var client_secret = ConfigClientCtrl.getConfig().propio.client_secret;

			var model = "token="+token+"&token_type_hint=access_token";

			var url = "";
			if(code != undefined || tipoConeccion == "CONSSO"){
				url = "https://authorizationserver.es:8446/oauth/tokens/revoke";
			}else{
				url = "https://resourceserver.es:8445/oauth/tokens/revoke"
			}

			return $http({
				method:"POST",
				url:url,
				data: model,
				withCredentials: false,
				headers:{
					'Accept': 'application/json ',
					'Authorization': 'Basic ' + btoa(cliente_id+':' +client_secret),
  					'Content-type': 'application/x-www-form-urlencoded'
				}
			})
				
			
		};

		
		
	}])