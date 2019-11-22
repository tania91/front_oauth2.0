angular.module('app' )
	.controller('UsuarioCtrl',['$scope',  'LiteralesCtrl', '$rootScope', '$window', '$routeParams', 'PgnPrincipalService', 'PgnUsuarioService', '$location', '$q',
		function($scope,  LiteralesCtrl, $rootScope, $window, $routeParams, PgnPrincipalService, PgnUsuarioService, $location, $q){

			
			$scope.listadoRecetas = [];
			$scope.literales = [];
			$scope.miReceta = false;
			$scope.currentPage = 0;
	      	$scope.pageSize = 6;
	     	$scope.pages = [];
	     	$scope.estadoLogout = localStorage.estadoLogout;

			
			$rootScope.mensajeError = "";
			$rootScope.show = false;
			$rootScope.estadoDevolverRecetas = "";


			if(localStorage.tipoLogin == "SINSSO" || localStorage.tipoLogin == "CONSSO"){
				$rootScope.estadoVerificar = "OK";
			}else{
				$rootScope.estadoVerificar = "";
			}
			

			function inicioUsuario(){
				
					$rootScope.estadoDevolverRecetas = 'CARGANDO';
					$window.scrollTo(0, 0);
					$scope.literales = LiteralesCtrl.getLiterales();
					if(localStorage.succes == "OK"){
						$rootScope.datosUsuario = true;
					}
					var flag = "propio";
					if(localStorage.code != undefined){
						flag = "tercero";
					}
					PgnPrincipalService.consultarRecursoConToken(localStorage.token, flag)
						.then(function(respuesta){
							$scope.miReceta = true;
							$rootScope.estadoDevolverRecetas = "HAYDATOS";
					    	$rootScope.estadoVerificar = "OK";
							$scope.listadoRecetas = respuesta.data;
							

							if($scope.listadoRecetas.length == 0){
								$rootScope.estadoDevolverRecetas = "WARNING";
							}

							for(i = 0 ; i < $scope.listadoRecetas.length; i++){
								$scope.listadoRecetas[i].posicion = i+1;
							}

							$scope.usuario = localStorage.sub;  
							
						}, function(error){
							tratarError(error);
						})

				
	
			}


			function tratarError(error, flag){
				if(error.data.status == parseInt($scope.literales.status.forbiden, 10)){
					//Si es error 403 devuelve el usuario no esta autorizado
					$rootScope.estadoUsuariosAdmin="";
					$rootScope.estadoUsuariosTerceros ="";
					$rootScope.datosUsuario = false;
					$rootScope.estadoEntrar = "";
					$rootScope.estadoDevolverRecetas = "";
					$rootScope.estadoVerificarRecetas = "";
					localStorage.clear()
					$rootScope.estadoVerificar = "ERROR";
					localStorage.error = "ERRORROL";
					$location.url('/cocinaRusa/login');	
				}else if(error.data.status == parseInt($scope.literales.status.unauthorized, 10)){
					//Si es error 401
					if(error.data.message.indexOf($scope.literales.errores.tokenErroneo) != -1 || error.data.message.indexOf($scope.literales.errores.bearerErroneo) != -1){
						$rootScope.estadoUsuariosAdmin="";
						$rootScope.estadoUsuariosTerceros ="";
						$rootScope.datosUsuario = false;
						$rootScope.estadoEntrar = "";
						$rootScope.estadoDevolverRecetas = "";
						$rootScope.estadoVerificarRecetas = "";
						localStorage.clear()
						$rootScope.estadoVerificar = "ERROR";
						localStorage.error = "ERRORROL";
						$location.url('/cocinaRusa/login');	
					}else{
						var token = localStorage.refreshToken.substring(7);
						PgnPrincipalService.refreshToken(token, localStorage.code)
							.then(function(respuesta){
								localStorage.token = respuesta.headers("Authorization");
								localStorage.refreshToken = respuesta.headers("Refreshtoken");
								guardarDatosUsuario(localStorage.token);
								if(flag == "buscar"){
									$scope.debolverRecetas();
								}else{
									inicioUsuario();
								}
								
							}, function(error){
								if(error.data.message.indexOf("JWT expired") != 1){
									//Si es por tiempo
									$rootScope.mensajeErrorAutorizacion = "Su sesion se ha expirado";
								}else{
									//Si es por otra causa devuelve que usuario npo esta autorizado
									$rootScope.mensajeErrorAutorizacion = "Ustes no esta autorizado";
								}
								localStorage.clear();
								$rootScope.estadoDevolverRecetas = "";
								$rootScope.estadoEntrar = "ERRORROL";
								localStorage.error = "ERRORROL";
								$rootScope.estadoVerificar = "ERROR";
								$rootScope.show = true;
								$location.url('/cocinaRusa/login');
							});
					}
					
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

				localStorage.sub = angular.fromJson(atob(datosBase64)).sub;
				localStorage.id = angular.fromJson(atob(datosBase64)).id;
				localStorage.role = angular.fromJson(atob(datosBase64)).roles[0];
			}

			$scope.debolverRecetas = function(){
				$rootScope.estadoDevolverRecetas = 'CARGANDO';
				PgnUsuarioService.buscarRecetas(localStorage.token)
					.then(function(respuesta){
						$scope.miReceta = false;
						$rootScope.estadoDevolverRecetas = "HAYDATOS";
				    	$rootScope.estadoVerificar = "OK";
						$scope.listadoRecetas = respuesta.data;
						

						if($scope.listadoRecetas.length == 0){
							$rootScope.estadoDevolverRecetas = "WARNING";
						}

						for(i = 0 ; i < $scope.listadoRecetas.length; i++){
							$scope.listadoRecetas[i].posicion = i+1;
						}

						$scope.usuario = localStorage.sub;
						
					}, function(error){
						tratarError(error, "buscar");
					})
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