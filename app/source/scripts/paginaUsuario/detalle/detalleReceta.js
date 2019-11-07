angular.module('app' )
	.controller('DetalleRecetaUsuarioCtrl',['$scope','$http', 'LiteralesCtrl', '$location', '$rootScope', '$window',    
		function($scope, $http, LiteralesCtrl, $location, $rootScope, $window  ){

			$rootScope.pasoActual = "INICIO";
			
			function inicioOperativa(){

				if( $rootScope.recetaUsuarioAux != undefined){
					$scope.detalle = $rootScope.recetaUsuarioAux;
				} else {
					$scope.volver();
				}

			};

			$scope.volver = function(){
				$rootScope.estadoDevolverRecetas = "";
				$location.url('/cocinaRusa/inicio');
			}

			inicioOperativa();


	}]);