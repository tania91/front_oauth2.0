angular.module('app' )
	.controller('CrearRecetaCtrl',['$scope', '$rootScope', '$window', 'LiteralesCtrl', 'PgnUsuarioService', '$location', '$uibModal', 'PgnPrincipalService', '$route',
		function($scope, $rootScope, $window,LiteralesCtrl, PgnUsuarioService, $location, $uibModal, PgnPrincipalService, $route ){

			$rootScope.estadoDevolverRecetas = "";
			$scope.listadoRecetas = [];
			$scope.literales = [];
			$scope.estadoCrearReceta = "";
			$scope.validarUsuario = "";
			$scope.estadoLogout = localStorage.estadoLogout;
			
			$rootScope.estadoVerificarRecetas = "";
			
			$rootScope.mensajeError = "";
			$rootScope.estadoVerificar = "";
			$rootScope.show = false;
			$scope.fileImagen = [];

			$scope.receta = {
				nombreReceta:"",
				descripcionReceta:"",
				ingredientesReceta: ""
			}
			if(localStorage.tipoLogin == "SINSSO" || localStorage.tipoLogin == "CONSSO"){
				$rootScope.estadoVerificar = "OK";
			}else{
				$rootScope.estadoVerificar = "";
			}
			

			function inicioCrearReceta(){
				$window.scrollTo(0, 0);
				$scope.literales = LiteralesCtrl.getLiterales();
				$rootScope.estadoVerificarRecetas = "HAYDATOS";
			}

			$scope.recogerImagen = function(){
				
				var flag = "propio";
				if(localStorage.code != undefined){
					flag = "tercero";
				}
				if($scope.recetaForm.nombre.$error.required == undefined 
					&& $scope.recetaForm.ingredientes.$error.required == undefined 
					&& $scope.recetaForm.descripcion.$error.required == undefined ){
					$scope.estadoCrear = "CARGANDO";
					var model = {

						imagen: $scope.fileImagen.data,
						nombreReceta: $scope.receta.nombreReceta,
						descripcion:$scope.receta.descripcionReceta,
						ingredientes: $scope.receta.ingredientesReceta,
						flag: flag

					}; 
					PgnUsuarioService.guardarReceta(model, localStorage.token)
						.then(function(respuesta){
							$scope.estadoCrear = "HAYDATOS";
							$rootScope.estadoDevolverRecetas = "OK";
							$location.url('/cocinaRusa/inicio')
							
						},function(error){

							//Si es KO

							if(error.data.status == parseInt($scope.literales.status.forbiden, 10)){
								//Si es error 403 devuelve el usuario no esta autorizado
								$rootScope.datosUsuario = false;
								$rootScope.estadoEntrar = '';
								$rootScope.estadoDevolverRecetas = "";
								$rootScope.estadoVerificarRecetas = "";
								$rootScope.estadoUsuariosAdmin="";
								$rootScope.estadoUsuariosTerceros ="";
								localStorage.clear();
								$rootScope.estadoVerificar = "ERROR"
								localStorage.error = "ERRORROL";
								$scope.estadoCrear = "";
								$location.url('/cocinaRusa/login');	
							}else if(error.data.status == parseInt($scope.literales.status.unauthorized, 10)){
								if(error.data.message.indexOf($scope.literales.errores.tokenErroneo) != -1){
									$rootScope.datosUsuario = false;
									$rootScope.estadoEntrar = '';
									$rootScope.estadoDevolverRecetas = "";
									$rootScope.estadoVerificarRecetas = "";
									$rootScope.estadoUsuariosAdmin="";
									$rootScope.estadoUsuariosTerceros ="";
									localStorage.clear()
									//$rootScope.estadoVerificar = "ERROR";
									localStorage.error = "ERRORROL";
									$location.url('/cocinaRusa/login');	
								}else{
									//Si es error 401
									var token = localStorage.refreshToken.substring(7);
									PgnPrincipalService.refreshToken(token, localStorage.code)
										.then(function(respuesta){
											localStorage.token = respuesta.headers("Authorization");
											localStorage.refreshToken = respuesta.headers("Refreshtoken");
											$scope.recogerImagen();
										}, function(error){
											if(error.data.message.indexOf("JWT expired") != 1){
												//Si es por tiempo
												$rootScope.mensajeErrorAutorizacion = "Su sesion se ha expirado";
											}else{
												//Si es por otra causa devuelve que usuario npo esta autorizado
												$rootScope.mensajeErrorAutorizacion = "Ustes no esta autorizado";
											}
											localStorage.clear();
											localStorage.error = "ERRORROL";
											$rootScope.estadoDevolverRecetas = "ERROR";
											$rootScope.estadoVerificar = "ERROR"
											$rootScope.show = true;
											$location.url('/cocinaRusa/login');
										});
								}
								
							}else{
								$rootScope.estadoDevolverRecetas = "ERROR";
								$rootScope.estadoVerificar = "ERROR";
								$scope.estadoCrear = "ERROR";
							}


							});
					}
				
			}
			
			$scope.volver = function(){
				$rootScope.estadoDevolverRecetas = "";
				$location.url('/cocinaRusa/inicio');
			}

			
			inicioCrearReceta();

	}]);

   


