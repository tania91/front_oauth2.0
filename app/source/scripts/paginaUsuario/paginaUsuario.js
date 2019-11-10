angular.module('app' )
	.controller('UsuarioCtrl',['$scope',  'LiteralesCtrl', '$rootScope', '$window', '$routeParams', 'PgnPrincipalService', 'PgnUsuarioService', '$location', '$q',
		function($scope,  LiteralesCtrl, $rootScope, $window, $routeParams, PgnPrincipalService, PgnUsuarioService, $location, $q){

			
			$scope.listadoRecetas = [];
			$scope.literales = [];
			
			
			$scope.miReceta = false;
			$scope.currentPage = 0;
	      	$scope.pageSize = 6;
	     	$scope.pages = [];

			
			$rootScope.mensajeError = "";
			$rootScope.show = false;
			$rootScope.estadoDevolverRecetas = "";


			if(sessionStorage.tipoLogin == "SINSSO" || sessionStorage.tipoLogin == "CONSSO"){
				$rootScope.estadoVerificar = "OK";
			}else{
				$rootScope.estadoVerificar = "";
			}
			

			function inicioUsuario(){
				$window.scrollTo(0, 0);
				$scope.literales = LiteralesCtrl.getLiterales();
				if(sessionStorage.succes == "OK"){
					$rootScope.datosUsuario = true;
				}
				
				PgnPrincipalService.consultarRecursoConToken(sessionStorage.token)
					.then(function(respuesta){
						$rootScope.estadoDevolverRecetas = "HAYDATOS";
				    	$rootScope.estadoVerificar = "OK";
						$scope.listadoRecetas = respuesta.data;
						

						if($scope.listadoRecetas.length == 0){
							$rootScope.estadoDevolverRecetas = "WARNING";
						}

						for(i = 0 ; i < $scope.listadoRecetas.length; i++){
							$scope.listadoRecetas[i].posicion = i+1;
						}

						$scope.usuario = sessionStorage.sub;  
						
					}, function(error){
						tratarError(error);
					})


	
			}


			function tratarError(error){
				if(error.data.status == parseInt($scope.literales.status.forbiden, 10)){
					//Si es error 403 devuelve el usuario no esta autorizado
					$rootScope.datosUsuario = false;
					$rootScope.estadoEntrar = "";
					$rootScope.estadoDevolverRecetas = "";
					$rootScope.estadoVerificarRecetas = "";
					sessionStorage.clear()
					//$rootScope.estadoVerificar = "ERROR";
					sessionStorage.error = "ERRORROL";
					$location.url('/cocinaRusa/login');	
				}else if(error.data.status == parseInt($scope.literales.status.unauthorized, 10)){
					//Si es error 401
					var token = sessionStorage.refreshToken.substring(7);
					PgnPrincipalService.refreshToken(token, sessionStorage.code)
						.then(function(respuesta){
							sessionStorage.token = respuesta.headers("Authorization");
							sessionStorage.refreshToken = respuesta.headers("Refreshtoken");
							guardarDatosUsuario(sessionStorage.token);
							inicioUsuario();
						}, function(error){
							if(error.data.message.indexOf("JWT expired") != 1){
								//Si es por tiempo
								$rootScope.mensajeErrorAutorizacion = "Su sesion se ha expirado";
							}else{
								//Si es por otra causa devuelve que usuario npo esta autorizado
								$rootScope.mensajeErrorAutorizacion = "Ustes no esta autorizado";
							}
							sessionStorage.clear();
							$rootScope.estadoEntrar = "ERRORROL"
							$rootScope.estadoDevolverRecetas = "ERROR";
							//$rootScope.estadoVerificar = "ERROR";
							sessionStorage.error = "ERRORROL";
							$rootScope.show = true;
							$location.url('/cocinaRusa/login');
						});
				}else{
					$rootScope.estadoDevolverRecetas = "ERROR";
					$rootScope.estadoVerificar = "OK";
				}

			}

			$scope.aniadirReceta = function(){

				$location.url('/cocinaRusa/crearMiReceta');
			}

			$rootScope.entrarPagina = function(receta){

				$rootScope.recetaUsuarioAux = receta;

				var nombre = receta.nombreReceta;

				while(nombre.indexOf(" ") != -1){
					nombre = nombre.replace(" ", "_");
				}

				$location.url('/cocinaRusa/miReceta/'+receta.id_receta.toString() +'/'+nombre);
			}

			$scope.verMisRecetas = function(){
				
				$location.url('/cocinaRusa/misRecetas');
			}

			

			$scope.configPages = function() {
		        $scope.pages.length = 0;
		        var ini = $scope.currentPage - 4;
		        var fin = $scope.currentPage + 5;
		        if (ini < 1) {
		          ini = 1;
		          if (Math.ceil($scope.listadoRecetas.length / $scope.pageSize) > 10)
		            fin = 10;
		          else
		            fin = Math.ceil($scope.listadoRecetas.length / $scope.pageSize);
		        } else {
		          if (ini >= Math.ceil($scope.listadoRecetas.length / $scope.pageSize) - 10) {
		            ini = Math.ceil($scope.listadoRecetas.length / $scope.pageSize) - 10;
		            fin = Math.ceil($scope.listadoRecetas.length / $scope.pageSize);
		          }
		        }
		        if (ini < 1) ini = 1;
		        for (var i = ini; i <= fin; i++) {
		          $scope.pages.push({
		            no: i
		          });
		        }

		        if ($scope.currentPage >= $scope.pages.length)
		          $scope.currentPage = $scope.pages.length - 1;
		      };

		      $scope.setPage = function(index) {
		        $scope.currentPage = index - 1;
		    };

		    function guardarDatosUsuario(cadena){
				var aux = cadena.substring(cadena.indexOf(".")+1);
				var datosBase64 = aux.substring(0,aux.indexOf("."));

				sessionStorage.sub = angular.fromJson(atob(datosBase64)).sub;
				sessionStorage.id = angular.fromJson(atob(datosBase64)).id;
				sessionStorage.role = angular.fromJson(atob(datosBase64)).roles[0];
			}

			inicioUsuario();

	}]);
angular.module('app')
	.filter('startFromGrid', function() {
	  return function(input, start) {
	    start = +start;
	    return input.slice(start);
	  }
	});