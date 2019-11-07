angular.module('app' )
	.controller('ModalCtrl',['$scope','$uibModalInstance',
		function($scope, $modalInstance){

		$scope.cancelar = function(){
			$modalInstance.dismiss('calncel');
		}

	}]);