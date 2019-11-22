angular.module('app')
	.controller('LoginCtrl',['$scope', 'LiteralesCtrl', '$rootScope', '$window', 'ServicioService', '$http', '$location', '$uibModal',
		function($scope, LiteralesCtrl, $rootScope, $window, ServicioService, $http, $location, $uibModal){

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
			$scope.estadoCrear = "";
			$rootScope.estadoEntrar = "";

			if(localStorage.error == "ERRORROL"){
				$rootScope.estadoEntrar = localStorage.error;
			}else{
				$rootScope.estadoEntrar = "";
			}
			

			$rootScope.mensajeError = "";


			function inicioLogin(){
				$window.scrollTo(0, 0);
				$scope.literales = LiteralesCtrl.getLiterales();
				if(localStorage.usuarioRegistrado == "true"){
					$scope.mostrarFormulario = true;
					$scope.registro.usuario = localStorage.nombre;
				}else {
					$scope.mostrarFormulario = false;
					$scope.registro.usuario = "";
				}
				
			}

			$scope.loginConSSO = function(){
				localStorage.tipoLogin = "CONSSO";
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
				localStorage.tipoLogin = "SINSSO";
				ServicioService.login($scope.registro)
					.then(function(respuesta, headers){
						if(respuesta != undefined){
							$rootScope.estadoEntrar = "HAYDATOS";
							$rootScope.estadoVerificar = "OK";
							localStorage.token = respuesta.headers("Authorization");
							localStorage.refreshToken = respuesta.headers("Refreshtoken");
							guardarDatosUsuario(localStorage.token);
							localStorage.succes = "OK";
							if(localStorage.role == "USER"){
								$location.url('/cocinaRusa/inicio');
							}else if(localStorage.role == "ADMIN"){
								$location.url('/cocinaRusa/admin/inicio');
							}else{
								localStorage.clear();
								$rootScope.estadoVerificar = "ERROR"
								$rootScope.estadoEntrar = "ERRORROL";
								$rootScope.show = true;
								$location.url('/cocinaRusa/login');
							}
							
						}
						
					})
					.catch(function(error){
						localStorage.removeItem("succes")
						
						if(error.data.message == $scope.literales.errores.credenciales){
							$rootScope.estadoEntrar = "ERRORCREDENCIALES";
						}else{
							$rootScope.estadoEntrar = "ERROR";
						}
						$rootScope.estadoVerificar = "OK";
					});
			}

			
			$scope.crearCuenta = function(){
				localStorage.removeItem('usuarioRegistrado');
				$location.url('/cocinaRusa/registro');
			};

			$scope.crearRegistro = function(){
				$rootScope.usuarioRegistrado = false;
				$scope.estadoCrear = "CARGANDO";

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
										$scope.estadoCrear = "OK";
										$scope.estadoEntrar = "";
										localStorage.nombre = respuesta.data.username;
										$rootScope.usuarioRegistrado = true;
										localStorage.usuarioRegistrado = $rootScope.usuarioRegistrado;
										$location.url('/cocinaRusa/login');
									})
									.catch(function(error){
										$scope.estadoCrear = "ERROR";
									});
							}else {
								$scope.estadoCrear = "ERROR";
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


			
			
			$scope.desplegarFormulario = function(){
				
				return $scope.mostrarFormulario = !$scope.mostrarFormulario;
				
				
			}

			function guardarDatosUsuario(cadena){
				var aux = cadena.substring(cadena.indexOf(".")+1);
				var datosBase64 = aux.substring(0,aux.indexOf("."));

				localStorage.sub = angular.fromJson(atob(datosBase64)).sub;
				localStorage.id = angular.fromJson(atob(datosBase64)).id;
				localStorage.role = angular.fromJson(atob(datosBase64)).roles[0];
			}

			inicioLogin();

	}]);

	
