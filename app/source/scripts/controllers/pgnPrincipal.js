angular.module('app' )
	.controller('PgnPrincipalCtrl',['$scope', '$rootScope', 'RecetasCtrl', 'LiteralesCtrl', 'PgnPrincipalService', '$location',
		function($scope, $rootScope, RecetasCtrl, LiteralesCtrl,PgnPrincipalService, $location){

			
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

				var urlCode = $location.search().code;
				if(urlCode != undefined ){

					sessionStorage.code = urlCode;

					PgnPrincipalService.recuperarTokenConCode(urlCode)
						.then(function(respuesta){
							sessionStorage.token = respuesta.headers("Authorization");
							sessionStorage.refreshToken = respuesta.headers("Refreshtoken");
							sessionStorage.succes = "1";
							$location.url('/cocinaRusa/inicio');	
						},function(error){
							sessionStorage.token = "0";
							sessionStorage.refreshToken = "0";
							sessionStorage.succes = "0";
							sessionStorage.code = "0";
							$scope.estado = "ERROR";
						});
				}else if(sessionStorage.token == "0"){
					buscarReceta();
				}else {
					sessionStorage.code = urlCode;
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




