angular.module('app' )
	.service('ServicioService', ['$http', function($http){
		

		this.crearUsuario = function(model){
				return $http({
					method:"POST",
					url:"https://localhost:8445/users/save",
					data: model,
					withCredentials: false,
					headers:{
						'Accept': 'application/json ',
						'Content-type': "application/json"
					}
				})
					
				
			};
			this.buscarPorNombre = function(model){
				return $http({
					method:"POST",
					url:"https://localhost:8445/users/findByName",
					data: model,
					withCredentials: false,
					headers:{
						'Accept': 'application/json ',
						'Content-type': "application/json"
					}
				})
					
				
			};
		this.login = function(registro){
				var model = "grant_type=password&client_id=oaut2-client&client_secret=secret&username=" + registro.usuario + "&password=" + btoa(registro.contrasenia);

				return $http({
					method:"POST",
					url:"https://localhost:8445/oauth/tokens",
					data: model,
					withCredentials: false,
					headers:{
						'Accept': 'application/json ',
						'Authorization': 'Basic ' + btoa('oaut2-client:secret'),
      					'Content-type': 'application/x-www-form-urlencoded'
					}
				})
					
				
			};

		/*this.logout = function(token){
			return $http({
					method:"GET",
					url:"https://localhost:8445/oauth/logout",
					withCredentials: false,
					headers:{
						'Authorization': token
					}
					
				})
		}*/
		

		this.autorizacionOauth = function(){
			return $http({
					method:"GET",
					url:"https://localhost:8446/oauth/authorize?response_type=code&client_id=oaut2-client&redirect_uri=http://www.cocinarusa.es:8081/PFG/oauth2.0/app/dest/html/"
					
				})
			
		};
	}])