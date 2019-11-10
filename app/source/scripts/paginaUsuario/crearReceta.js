angular.module('app' )
	.controller('CrearRecetaCtrl',['$scope', '$rootScope', '$window', 'LiteralesCtrl', 'PgnUsuarioService', '$location', '$uibModal', 'PgnPrincipalService',
		function($scope, $rootScope, $window,LiteralesCtrl, PgnUsuarioService, $location, $uibModal, PgnPrincipalService ){

			$rootScope.estadoDevolverRecetas = "";
			$scope.listadoRecetas = [];
			$scope.literales = [];
			$scope.estadoCrearReceta = "";
			$scope.validarUsuario = "";
			
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
			if(sessionStorage.tipoLogin == "SINSSO" || sessionStorage.tipoLogin == "CONSSO"){
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
				
				if($scope.recetaForm.nombre.$error.required == undefined 
					&& $scope.recetaForm.ingredientes.$error.required == undefined 
					&& $scope.recetaForm.descripcion.$error.required == undefined ){
					var model = {

						imagen: $scope.fileImagen.data,
						nombreReceta: $scope.receta.nombreReceta,
						descripcion:$scope.receta.descripcionReceta,
						ingredientes: $scope.receta.ingredientesReceta

					}; 
					PgnUsuarioService.guardarReceta(model, sessionStorage.token)
						.then(function(respuesta){
							$scope.estadoCrear = "HAYDATOS";
							$rootScope.estadoDevolverRecetas = "OK";
							$location.url('/cocinaRusa/inicio')
							
						},function(error){

							//Si es KO

							if(error.data.status == parseInt($scope.literales.status.forbiden, 10)){
								//Si es error 403 devuelve el usuario no esta autorizado
								$rootScope.datosUsuario = false;
								$rootScope.estadoEntrar = "";
								$rootScope.estadoDevolverRecetas = "";
								$rootScope.estadoVerificarRecetas = "";
								sessionStorage.clear();
								$rootScope.estadoVerificar = "ERROR"
								$scope.estadoCrear = "";
								$location.url('/cocinaRusa/login');	
							}else if(error.data.status == parseInt($scope.literales.status.unauthorized, 10)){
								//Si es error 401
								var token = sessionStorage.refreshToken.substring(7);
								PgnPrincipalService.refreshToken(token, sessionStorage.code)
									.then(function(respuesta){
										sessionStorage.token = respuesta.headers("Authorization");
										sessionStorage.refreshToken = respuesta.headers("Refreshtoken");
										$scope.recogerImagen();
									}, function(error){
										if(error.data.message.indexOf("JWT expired") != 1){
											//Si es por tiempo
											$rootScope.mensajeErrorAutorizacion = "Su sesion se ha expirado";
										}else{
											//Si es por otra causa devuelve que usuario npo esta autorizado
											$rootScope.mensajeErrorAutorizacion = "Ustes no esta autorizado";
										}
										sessionStorage.clear();
										$rootScope.estadoDevolverRecetas = "ERROR";
										$rootScope.estadoVerificar = "ERROR"
										$rootScope.show = true;
										$location.url('/cocinaRusa/login');
									});
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

   


