angular.module('app')
	.service('LiteralesCtrl', function (){
			
			
			
			this.getLiterales = function(){
				return {
					"cabecera": {
						"titulo1": "COMIDA RUSA",
						"titulo2": "Como en casa"
					},
					"login":{
						"entrar":{
							"titulo": "LogIn sin SSO",
							"noRegistrado1":"Si no esta registrado pulse ",
							"noRegistrado2": " aqui.",
							"modoEntrar": "Entrar con: ",
							"conSSO": "LogIn con SSO"
						},
						"registro":{
							"titulo": "Registrate en nuestra pagina",
							"usuario":"Usuario: ",
							"contrasenia1": "Contraseña: ",
							"contrasenia2": "Repite Contraseña: ",
							"nombre": "Nombre: ",
							"apellidos": "Apellidos: ",
							"email1": "Email: ",
							"email2": "Repite Email: ",
							"fchNasimiento": "Fecha de Nasimiento"

						}
					},
					"recetas": {
						"receta": "Nuestras Recetas",
						"noReceta": "Lo sentimos. En este momento no hay recetas disponibles",
						"miReceta": "Mis recetas",
						"ensaladas": {
							"ensaladillaRusa": "Ensaladilla rusa"
						},
						"aniadeReceta": "Añade tu recetas",
						"nombre": "Nombre receta",
						"descripcion": "Descripcion receta",
						"ingredientes": "Ingredientes",
						"derecha": "<<",
						"izquierda":">>"
					},
					"usuario":{
						"menu": {
							"misRecetas": "Mis Recetas",
							"aniadir": "Añadir Receta"
						},
						"recetas": {
							"titulo": "Nuestras recetas"
						},
						"saludo": "Hola "

					},
					"errores":{
						"tiempo": "JWT expired",
						"credenciales": "Authentication Failed: Bad credentials",
						"tokenErroneo": "Unable to read JSON value:",
						"bearerErroneo": "Illegal base64url character: ' '"
						
					},
					"status":{
						"unauthorized": "401",
						"forbiden":"403"
					}
				};
			};
			
		});