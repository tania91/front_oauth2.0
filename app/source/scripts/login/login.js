angular.module('app')
	.controller('LoginCtrl',['$scope', 'RecetasCtrl', 'LiteralesCtrl', '$rootScope', '$window', 'ServicioService', '$http', '$location', '$uibModal',
		function($scope, RecetasCtrl, LiteralesCtrl, $rootScope, $window, ServicioService, $http, $location, $uibModal){

			$scope.inputType1 = 'password';
			$scope.inputType2 = 'password';
			$scope.registro = {
				usuario: "",
				contrasenia:"",
				contrasenia2:"",
				nombre:"",
				apellidos:"",
				email:"",
				email2:"",
				fchNasimiento:""
			};
			//$rootScope.estadoEntrar = "";
			$scope.usuarioExiste = false;
			$scope.registro.nombre="";
			$scope.registro.apellidos="";
			$scope.registro.usuario="";
			$scope.registro.contrasenia="";
			$scope.registro.email="";
			

			$rootScope.mensajeError = "";

			function inicioLogin(){
				$window.scrollTo(0, 0);
				$scope.literales = LiteralesCtrl.getLiterales();
				if(sessionStorage.usuarioRegistrado == "true"){
					$scope.mostrarFormulario = true;
					$scope.registro.usuario = sessionStorage.nombre;
				}else {
					$scope.mostrarFormulario = false;
					$scope.registro.usuario = "";
				}
				if($rootScope.estadoVerificar == 'ERROR' && $rootScope.show){
					mostrarModal();
				}
			}

			$scope.loginConSSO = function(){
				sessionStorage.tipoLogin = "CONSSO";
				ServicioService.autorizacionOauth()
					.then(function(respuesta){
						console.log(respuesta);
						$window.open(respuesta.config.url);
					})
					.catch(function(error){
						$window.open(error.config.url);
						$rootScope.estadoEntrar = "ERROR";
					});
			}
			
			

			$scope.loginSinSSO = function(){
				$scope.estadoCrear = "CARGANDO";
				sessionStorage.tipoLogin = "SINSSO";
				ServicioService.login($scope.registro)
					.then(function(respuesta, headers){
						if(respuesta != undefined){
							$rootScope.estadoEntrar = "HAYDATOS";
							$rootScope.estadoVerificar = "OK";
							sessionStorage.token = respuesta.headers("Authorization");
							sessionStorage.refreshToken = respuesta.headers("Refreshtoken");
							sessionStorage.succes = "1";
							$location.url('/cocinaRusa/inicio');
						}
						
					})
					.catch(function(error){
						sessionStorage.succes = "0";
						
						if(error.data.message == $scope.literales.errores.credenciales){
							$rootScope.estadoEntrar = "ERRORCREDENCIALES";
						}else{
							$rootScope.estadoEntrar = "ERROR";
						}
						$rootScope.estadoVerificar = "OK";
					});
			}

			
			$scope.crearCuenta = function(){
				$location.url('/cocinaRusa/registro');
			};

			$scope.crearRegistro = function(){
				$rootScope.usuarioRegistrado = false;


				if($scope.registroForm.usuario.$error.required == undefined 
					&& $scope.registroForm.contrasenia.$error.required == undefined
					&& $scope.registroForm.contrasenia2.$error.required == undefined 
					&& $scope.registroForm.nombre.$error.required == undefined
					&& $scope.registroForm.apellidos.$error.required == undefined 
					&& $scope.registroForm.email.$error.required == undefined
					&& $scope.registroForm.email2.$error.required == undefined
					&& !$scope.equalCont && !$scope.equalEmail ){

					var model ={
						username:$scope.registro.usuario
					};

					ServicioService.buscarPorNombre(model)
						.then(function(respuesta){
							if(respuesta.data.coneccion == "OK"){
								$scope.usuarioExiste = false;
								var model = {
									nombre:$scope.registro.nombre,
									apellidos:$scope.registro.apellidos,
									username:$scope.registro.usuario,
									password:btoa($scope.registro.contrasenia),
									email:$scope.registro.email
								};

								ServicioService.crearUsuario(model)
									.then(function(respuesta){
										$scope.estadoCrear = "CARGANDO";
										$scope.estadoEntrar = "";
										sessionStorage.nombre = respuesta.data.username;
										$rootScope.usuarioRegistrado = true;
										sessionStorage.usuarioRegistrado = $rootScope.usuarioRegistrado;
										$location.url('/cocinaRusa/login');
									})
									.catch(function(error){
										$scope.estadoCrear = "ERROR";
									});
							}else {
								$scope.usuarioExiste = true;
							}
						})
						.catch(function(error){
							$scope.estadoCrear = "ERROR";
						});



					


					}
				


			};

			 $scope.comprobar = function(cadena1, cadena2, tipo){
				if(cadena1 != cadena2 && cadena1 != undefined && cadena2 != undefined){
					if(tipo=="contrasenia"){
						$scope.equalCont = true;
					}else if(tipo=="email"){
						$scope.equalEmail = true;
					}

				}else {
					if(tipo=="contrasenia"){
						$scope.equalCont = false;
					}else if(tipo=="email"){
						$scope.equalEmail = false;
					}
				}
			};

			$scope.hacerVisible1 =function(){
				if ($scope.inputType1 == 'password'){
					$scope.inputType1 = 'text';
				}else{
				    $scope.inputType1 = 'password';
				}
			}
			$scope.hacerVisible2 =function(){
				

				if ($scope.inputType2 == 'password'){
					$scope.inputType2 = 'text';
				}else{
				    $scope.inputType2 = 'password';
				}
			}

			function mostrarModal(){
				
				var modalInstance = $uibModal.open({
					templateUrl:"PFG/oauth2.0/app/dest/html/include/ventanaError.html",
					controller:"ModalCtrl" 
					});
			}

			
			
			$scope.desplegarFormulario = function(){
				
				return $scope.mostrarFormulario = !$scope.mostrarFormulario;
				
				
			}

			inicioLogin();

	}]);

	