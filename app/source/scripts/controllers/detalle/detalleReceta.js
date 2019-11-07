angular.module('app' )
	.controller('DetalleRecetaPrincipalCtrl',['$scope', '$rootScope', '$http', 'LiteralesCtrl', '$location', '$rootScope', '$window',    
		function($scope, $rootScope, $http, LiteralesCtrl, $location, $rootScope, $window ){
			$rootScope.pasoActual = "INICIO";
			
			function inicioOperativa(){
				if( $rootScope.recetaAux != undefined){
					$scope.detalle = $rootScope.recetaAux;
				} else {
					$scope.volver();
				}
				

			}

			$scope.volver = function(){
				
				$location.url('/home');
			}

			inicioOperativa();


	}]);