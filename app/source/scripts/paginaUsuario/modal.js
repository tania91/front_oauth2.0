angular.module('app' )
	.controller('ModalExitoCtrl',['$scope','$uibModalInstance', 
		function($scope, $modalInstance){

		$scope.aceptar = function(){
			
			$modalInstance.dismiss('calncel');
		}

	}]);