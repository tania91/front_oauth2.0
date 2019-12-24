angular.module('app' )
	.service('ServicioService', ['$http', 'ConfigClientCtrl', function($http, ConfigClientCtrl){
		

		this.crearUsuario = function(model){
				return $http({
					method:"POST",
					url:"https://resourceserver.es:8445/users/save",
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
					url:"https://resourceserver.es:8445/users/findByName",
					data: model,
					withCredentials: false,
					headers:{
						'Accept': 'application/json ',
						'Content-type': "application/json"
					}
				})
					
				
			};
		this.login = function(registro){
			var cliente_id = ConfigClientCtrl.getConfig().propio.client_id;
			var client_secret = ConfigClientCtrl.getConfig().propio.client_secret;

			var model = "grant_type=password&client_id="+cliente_id+"&client_secret="+btoa(client_secret)+"&username=" + registro.usuario + "&password=" + btoa(registro.contrasenia);

			return $http({
				method:"POST",
				url:"https://resourceserver.es:8445/oauth/tokens",
				data: model,
				withCredentials: false,
				headers:{
					'Accept': 'application/json ',
					'Authorization': 'Basic ' + btoa(cliente_id+':' +client_secret),
  					'Content-type': 'application/x-www-form-urlencoded'
				}
			})
				
			
		};
		

		this.autorizacionOauth = function(){
			var cliente_id = ConfigClientCtrl.getConfig().tercero.client_id;
			var client_secret = ConfigClientCtrl.getConfig().tercero.client_secret;

			return $http({
					method:"GET",
					url:"https://authorizationserver.es:8446/oauth/authorize?response_type=code&client_id="+cliente_id+"&redirect_uri=http://www.cocinarusa.es:80/PFG/oauth2.0/app/dest/html/#!/"
					
				})
			
		};
	}])