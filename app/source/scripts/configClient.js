angular.module('app')
	.service('ConfigClientCtrl', function (){

			this.getConfig = function(){
				return {
					"propio":{
						"client_id": "nhfgbdt.F4KJUasnzpriWPKMVNHF98",
						"client_secret": "375252635769272e6171675b4b3279707e20306e3f253e79592b352058"
					},
					"tercero": {
						"client_id": "hkw4d99nghysp.FH5ns01jnfALZzYDBLJRB",
						"client_secret": "674242512f26257a65596c4039387e4d65314e3b634b7175435b4e7a54"
					}
					
				};
			};
			
	});8