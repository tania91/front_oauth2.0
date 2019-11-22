angular.module('app' )
	.controller('AdminCtrl',['$scope',  'LiteralesCtrl', '$rootScope', '$routeParams',  '$location', '$q', 'PgnAdminService','PgnPrincipalService', '$window',
		function($scope,  LiteralesCtrl, $rootScope, $routeParams, $location, $q, PgnAdminService, PgnPrincipalService, $window){

			$scope.literales = [];
			$scope.estado = "";
			$scope.estadoEliminar = "";
			$rootScope.estadoUsuariosTerceros = "";
			$rootScope.estadoUsuariosAdmin = "";
			$rootScope.eliminar = "";
			$rootScope.mensajeError = "";
			$rootScope.show = false;
			$scope.estadoLogout = localStorage.estadoLogout;



			function inicioAdmin(){
				$window.scrollTo(0, 0);
				$scope.literales = LiteralesCtrl.getLiterales();
				$scope.usuario = localStorage.sub;
				$scope.estado = "CARGANDO";
				//Se recuperan los usuarios propios de la pagina
				PgnAdminService.devolverUsuarios(localStorage.token, "propio")
					.then(function(respuesta){
						$rootScope.estadoVerificar = "OK";
						$rootScope.estadoUsuariosAdmin = "HAYDATOS";
						$scope.listadoUsuariosAdmin = respuesta.data;
						
						if($scope.listadoUsuariosAdmin.length == 0){
							$rootScope.estadoUsuariosAdmin = "WARNING";
						}

						  
						//Se recuperan los usurio que estan registrados en una pagina de tercero
						PgnAdminService.devolverUsuarios(localStorage.token)
							.then(function(respuestaTercero){
								$rootScope.estadoUsuariosTerceros = "HAYDATOS";
								$scope.listadoUsuariosTerceros = respuestaTercero.data;
								
								if($scope.listadoUsuariosTerceros.length == 0){
									$rootScope.estadoUsuariosTerceros = "WARNING";
								}

								//Se recuperan las recetas de un usuario
								PgnAdminService.buscarRecetasPorId(localStorage.token)
									.then(function(respuesta){

										var cont = 0;

										for(var y = 0; y < $scope.listadoUsuariosTerceros.length; y++){
											cont = 0;
											for(var i  = 0; i < respuesta.data.length; i++){
												if($scope.listadoUsuariosTerceros[y].id+1000 ==  respuesta.data[i].identificadorUsuario ){
													cont++;
												}
											}
											$scope.listadoUsuariosTerceros[y].numRecetas = cont;
										}

										for(var z = 0; z < $scope.listadoUsuariosAdmin.length; z++){
											cont = 0;
											for(var i  =0; i < respuesta.data.length; i++){
												if($scope.listadoUsuariosAdmin[z].id ==  respuesta.data[i].identificadorUsuario ){
													cont++;
												}
											}
											$scope.listadoUsuariosAdmin[z].numRecetas = cont;
										}


										$rootScope.estadoUsuariosTerceros = "HAYDATOS";
										$scope.listadoRecetasAdmin = respuesta.data;
										
										if($scope.listadoRecetasAdmin.length == 0){
											$rootScope.estadoUsuariosTerceros = "WARNING";
										}
										$scope.estado = "";
									}, function(error){
										$scope.estado = "";
										tratarError(error);
									});
							}, function(error){
								tratarError(error);
							});
						
					}, function(error){
						tratarError(error);
					});


	
			}


			function tratarError(error, tipoUsuario){
				if(error.data.status == parseInt($scope.literales.status.forbiden, 10)){
					//Si es error 403 devuelve el usuario no esta autorizado
					$rootScope.estadoEntrar = "";
					if(tipoUsuario == "propio"){
						$rootScope.estadoUsuariosAdmin = "";
					}else if(tipoUsuario == "eliminar"){
						$rootScope.eliminar = "";
					}else{
						$rootScope.estadoUsuariosTerceros = "";
					}
					$rootScope.estadoUsuariosAdmin="";
					$rootScope.estadoUsuariosTerceros ="";
					$rootScope.estadoVerificar = "ERROR";
					localStorage.clear()
					localStorage.error = "ERRORROL"
					$location.url('/cocinaRusa/login');	
				}else if(error.data.status == parseInt($scope.literales.status.unauthorized, 10)){
					if(error.data.message.indexOf($scope.literales.errores.tokenErroneo) != -1){
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
						//Si es error 401 se llama a refresh token
						var token = localStorage.refreshToken.substring(7);
						PgnPrincipalService.refreshToken(token, localStorage.code)
							.then(function(respuesta){
								localStorage.token = respuesta.headers("Authorization");
								localStorage.refreshToken = respuesta.headers("Refreshtoken");
								guardarDatosUsuario(localStorage.token);
								if(tipoUsuario == "eliminar"){
									$scope.eliminarUsuario();
								}else{
										inicioAdmin();
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
								$rootScope.estadoEntrar = "ERRORROL"
								if(tipoUsuario == "propio"){
									$rootScope.estadoUsuariosAdmin = "";
								}else if(tipoUsuario == "eliminar"){
									$rootScope.eliminar = "";
								}else{
									$rootScope.estadoUsuariosTerceros = "";
								}
								$rootScope.estadoVerificar = "ERROR";
								localStorage.error = "ERRORROL"
								$rootScope.show = true;
								$location.url('/cocinaRusa/login');
							});
					}
					
				}else{
					if(tipoUsuario == "propio"){
						$rootScope.estadoUsuariosAdmin = "ERROR";
					}else if(tipoUsuario == "eliminar"){
						$rootScope.eliminar = "ERROR";
					}else{
						$rootScope.estadoUsuariosTerceros = "ERROR";
					}
					$rootScope.estadoVerificar = "OK";
				}

			}

			$scope.eliminarUsuario = function(id){
				$scope.estadoEliminar = "CARGANDO";
				//Se elimina el usuario
				PgnAdminService.eliminarUsuario(localStorage.token, id)
					.then(function(respuesta){
						$rootScope.eliminar = "OK";
						$scope.estadoEliminar = "";
						inicioAdmin();
					}, function(error){
						$scope.estadoEliminar = "";
						tratarError(error,"eliminar");
					});
			}

			

			function guardarDatosUsuario(cadena){
				var aux = cadena.substring(cadena.indexOf(".")+1);
				var datosBase64 = aux.substring(0,aux.indexOf("."));

				localStorage.sub = angular.fromJson(atob(datosBase64)).sub;
				localStorage.id = angular.fromJson(atob(datosBase64)).id;
				localStorage.role = angular.fromJson(atob(datosBase64)).roles[0];
			}

			inicioAdmin();

	}]);
