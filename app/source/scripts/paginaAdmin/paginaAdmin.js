angular.module('app' )
	.controller('AdminCtrl',['$scope',  'LiteralesCtrl', '$rootScope', '$routeParams',  '$location', '$q', 'PgnAdminService','PgnPrincipalService', '$window',
		function($scope,  LiteralesCtrl, $rootScope, $routeParams, $location, $q, PgnAdminService, PgnPrincipalService, $window){

			$scope.literales = [];
			$rootScope.estadoUsuariosTerceros = "";
			$rootScope.estadoUsuariosAdmin = "";
			$rootScope.eliminar = "";
			$rootScope.mensajeError = "";
			$rootScope.show = false;



			function inicioAdmin(){
				$window.scrollTo(0, 0);
				$scope.literales = LiteralesCtrl.getLiterales();
				$scope.usuario = sessionStorage.sub;
			
				//Se recuperan los usuarios propios de la pagina
				PgnAdminService.devolverUsuarios(sessionStorage.token, "propio")
					.then(function(respuesta){
						$rootScope.estadoUsuariosAdmin = "HAYDATOS";
						$scope.listadoUsuariosAdmin = respuesta.data;
						
						if($scope.listadoUsuariosAdmin.length == 0){
							$rootScope.estadoUsuariosAdmin = "WARNING";
						}

						  
						//Se recuperan los usurio que estan registrados en una pagina de tercero
						PgnAdminService.devolverUsuarios(sessionStorage.token)
							.then(function(respuestaTercero){
								$rootScope.estadoUsuariosTerceros = "HAYDATOS";
								$scope.listadoUsuariosTerceros = respuestaTercero.data;
								
								if($scope.listadoUsuariosTerceros.length == 0){
									$rootScope.estadoUsuariosTerceros = "WARNING";
								}

								//Se recuperan las recetas de un usuario
								PgnAdminService.buscarRecetasPorId(sessionStorage.token)
									.then(function(respuesta){

										for(var i  = 0; i < respuesta.data.length; i++){
											cont = 0;
											for(var y = 0; y < $scope.listadoUsuariosTerceros.length; y++){
												if($scope.listadoUsuariosTerceros[y].id ==  respuesta.data[i].identificadorUsuario ){
													cont++;
													$scope.listadoUsuariosTerceros[y].numRecetas = cont;
												}
												if(cont == 0 ){
													$scope.listadoUsuariosTerceros[y].numRecetas = 0;
												}
												
											}

										
										}

										for(var i  =0; i < respuesta.data.length; i++){
											cont = 0;
											for(var z = 0; z < $scope.listadoUsuariosAdmin.length; z++){
												if($scope.listadoUsuariosAdmin[z].id ==  respuesta.data[i].identificadorUsuario ){
													cont++;
													$scope.listadoUsuariosAdmin[z].numRecetas = cont;
												}
												if(cont == 0){
													$scope.listadoUsuariosAdmin[z].numRecetas = 0;
												}
												
											}
											
										}
										$rootScope.estadoUsuariosTerceros = "HAYDATOS";
										$scope.listadoRecetasAdmin = respuesta.data;
										
										if($scope.listadoRecetasAdmin.length == 0){
											$rootScope.estadoUsuariosTerceros = "WARNING";
										}
									}, function(error){
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
					
					sessionStorage.clear()
					sessionStorage.error = "ERRORROL"
					$location.url('/cocinaRusa/login');	
				}else if(error.data.status == parseInt($scope.literales.status.unauthorized, 10)){
					//Si es error 401 se llama a refresh token
					var token = sessionStorage.refreshToken.substring(7);
					PgnPrincipalService.refreshToken(token, sessionStorage.code)
						.then(function(respuesta){
							sessionStorage.token = respuesta.headers("Authorization");
							sessionStorage.refreshToken = respuesta.headers("Refreshtoken");
							guardarDatosUsuario(sessionStorage.token);
							inicioAdmin();
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
							if(tipoUsuario == "propio"){
								$rootScope.estadoUsuariosAdmin = "";
							}else if(tipoUsuario == "eliminar"){
								$rootScope.eliminar = "";
							}else{
								$rootScope.estadoUsuariosTerceros = "";
							}
							sessionStorage.error = "ERRORROL"
							$rootScope.show = true;
							$location.url('/cocinaRusa/login');
						});
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
				//Se elimina el usuario
				PgnAdminService.eliminarUsuario(sessionStorage.token, "", id)
					.then(function(respuesta){
						$rootScope.eliminar = "OK";
						inicioAdmin();
					}, function(error){
						tratarError(error,"eliminar");
					});
			}
			
			$scope.eliminarUsuarioTercero = function(id){
				//Se elimina el usuario
				PgnAdminService.eliminarUsuarioRecetas(sessionStorage.token, id)
					.then(function(respuesta){
						$rootScope.eliminar = "OK";
						PgnAdminService.eliminarUsuario(sessionStorage.token, "tercero", id)
							.then(function(respuesta){
								$rootScope.eliminar = "OK";
								inicioAdmin();
							}, function(error){
								tratarError(error,"eliminar");
							});
					}, function(error){
						tratarError(error,"eliminar");
					});
				
			}

			function guardarDatosUsuario(cadena){
				var aux = cadena.substring(cadena.indexOf(".")+1);
				var datosBase64 = aux.substring(0,aux.indexOf("."));

				sessionStorage.sub = angular.fromJson(atob(datosBase64)).sub;
				sessionStorage.id = angular.fromJson(atob(datosBase64)).id;
				sessionStorage.role = angular.fromJson(atob(datosBase64)).roles[0];
			}

			inicioAdmin();

	}]);
