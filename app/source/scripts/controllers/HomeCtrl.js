angular.module('app' )
	.controller('HomeCtrl',['$scope', 'LiteralesCtrl', '$location', '$rootScope', '$window', 'ServicioService',   
		function($scope,  LiteralesCtrl, $location, $rootScope, $window, ServicioService ){
			$rootScope.pasoActual = "INICIO";
			$rootScope.volverInicio = false;
			sessionStorage.usuarioRegistrado = null;
			sessionStorage.token = "0";
			sessionStorage.refreshToken = "0";
			sessionStorage.code = "0";
			$rootScope.estadoVerificar = "";

			function inicioOperativa(){
				$window.scrollTo(0, 0);
				$scope.literales = LiteralesCtrl.getLiterales();

				

			}

			$scope.recargar = function(){
				if($rootScope.estadoVerificar == '' || $rootScope.estadoVerificar=='ERROR'){
					$location.url('/home');
				}else if($rootScope.estadoVerificar == 'OK' ){
					
					$location.url('/cocinaRusa/inicio');
				}
				
			}; 
			 

			$scope.login = function(){
				$location.url('/cocinaRusa/login');
				
			}

			$scope.logout = function(){
				$rootScope.estadoVerificar = "";
				$rootScope.estadoEntrar = "";
				$rootScope.estadoDevolverRecetas = "";
				$rootScope.estadoVerificarRecetas = "";
				sessionStorage.token = "0";
				sessionStorage.refreshToken = "0";
				sessionStorage.code = "0";
				sessionStorage.tipoLogin = "0";
				$location.url('/home');	
			}


			inicioOperativa();


	}]);



angular.module('app')
	.directive("ngFileModel", [function () {
        return {
            scope: {
                ngFileModel: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                    	var dataURL = reader.result;
	            		var output = document.getElementById('recetaImagen');
	            		output.src = dataURL;
                        scope.$apply(function () {
                            scope.ngFileModel = {
                                lastModified: changeEvent.target.files[0].lastModified,
                                lastModifiedDate: changeEvent.target.files[0].lastModifiedDate,
                                name: changeEvent.target.files[0].name,
                                size: changeEvent.target.files[0].size,
                                type: changeEvent.target.files[0].type,
                                data: loadEvent.target.result
                            };
                        });
                    }
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }]);
    if( typeof exports !== 'undefined' ) {
      exports['default'] = angular.module('ng-file-model');
      module.exports = exports['default'];
    }

