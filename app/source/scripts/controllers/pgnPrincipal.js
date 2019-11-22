angular.module('app' )
	.controller('PgnPrincipalCtrl',['$scope', '$rootScope', 'LiteralesCtrl', 'PgnPrincipalService', '$location', '$window', '$route',
		function($scope, $rootScope, LiteralesCtrl,PgnPrincipalService, $location, $window, $route){

			
			$scope.listadoRecetas = [];
			$scope.posicion = null;
			$scope.receta = {
				nombreReceta: "",
				descripcionReceta:""
			};
			$rootScope.datosUsuario = null;
			$rootScope.mensajeError = "";
			$scope.currentPage = 0;
	      	$scope.pageSize = 6;
	     	$scope.pages = [];
	     	$scope.miReceta = false;
	     	



	     	

			function inicio(accion){
				var i = 0;
				$scope.literales = LiteralesCtrl.getLiterales();
				$scope.estado = "CARGANDO";

				if($location.$$absUrl.indexOf("code") != -1){
					var urlCode = $location.$$absUrl.substring($location.$$absUrl.indexOf("code")+5);
				}
				if(urlCode != undefined ){

					localStorage.code = urlCode.substring(0, urlCode.indexOf("#"));
					var url = $location.$$absUrl.substring(0,$location.$$absUrl.indexOf("code")-1).concat("#!/");
					
					PgnPrincipalService.recuperarTokenConCode(localStorage.code)
						.then(function(respuesta){
							$rootScope.estadoEntrar = "HAYDATOS";
							$rootScope.estadoVerificar = "OK";
							localStorage.token = respuesta.headers("Authorization");
							localStorage.refreshToken = respuesta.headers("Refreshtoken");
							guardarDatosUsuario(localStorage.token);
							localStorage.succes = "OK";
							
							if(localStorage.role == "USER"){
								$window.location.href = url.concat('cocinaRusa/inicio');
								//$location.url('/cocinaRusa/inicio');
							}else if(localStorage.role == "ADMIN"){
								$location.url('/cocinaRusa/admin/inicio');
							}else{
								localStorage.clear();
								$rootScope.estadoVerificar = "ERROR"
								$rootScope.estadoEntrar = "ERRORROL";
								$rootScope.show = true;
								$location.url('/cocinaRusa/login');
							}
						},function(error){
							localStorage.removeItem("succes")
							
							if(error.data.message == $scope.literales.errores.credenciales){
								$rootScope.estadoEntrar = "ERRORCREDENCIALES";
							}else{
								$rootScope.estadoEntrar = "ERROR";
							}
							$rootScope.estadoVerificar = "OK";
							$scope.estado = "ERROR";
						});
				}else if(localStorage.token == undefined){
					buscarReceta();
				}else {
					localStorage.code = urlCode;
					$location.url('/cocinaRusa/inicio');
				}
			}
			
			

			function buscarReceta(){
				PgnPrincipalService.buscarTodasRecetas()
						.then(function(respuesta){
							$scope.estado = "HAYDATOS";
							if(respuesta.data.length > 0){
								$scope.listadoRecetas = respuesta.data;
							}else{
								$scope.estado = "NOHAYDATOS";
							}
							for(i = 0 ; i < $scope.listadoRecetas.length; i++){
								$scope.listadoRecetas[i].posicion = i+1;
							}
						},function(error){
							$scope.estado = "ERROR";
						});
			}
			
			$scope.eliminarImage = function(id){
				document.getElementById('recetaImagen') = "";
			}

			$scope.entrarPagina = function(receta){
				
				$rootScope.recetaAux = receta;
				var nombre = receta.nombreReceta;

				while(nombre.indexOf(" ") != -1){
					nombre = nombre.replace(" ", "_");
				}
				
				$location.url('/cocinaRusa/'+receta.id_receta.toString() +'/'+nombre);
			};

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

			inicio();
	}])
	.config(['$httpProvider', function ($httpProvider) {
		 $httpProvider.defaults.useXDomain = true;
         $httpProvider.defaults.withCredentials = true;
     }]);
	
angular.module('app')
	.filter('startFromGrid', function() {
	  return function(input, start) {
	    start = +start;
	    return input.slice(start);
	  }
	});




