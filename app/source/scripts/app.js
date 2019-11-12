angular.module('app',['ngRoute',
                     'ui.bootstrap',
                     'ngAnimate',
                     'ngAria',
                     'ngMessages',
                     'ngMaterial',
                     'angularjsFileModel'])
    .config( function($routeProvider, $locationProvider){

        $routeProvider
            .when('/', {
                templateUrl: '/PFG/oauth2.0/app/dest/html/pgnPrincipal/pgnPrincipal.html'
            })
            .when('/cocinaRusa/login', {
                templateUrl: '/PFG/oauth2.0/app/dest/html/login/eligeLogin.html'
            })

            .when('/cocinaRusa/registro', {
                templateUrl: '/PFG/oauth2.0/app/dest/html/registro/registro.html'
            })
            .when('/cocinaRusa/inicio', {
                templateUrl: '/PFG/oauth2.0/app/dest/html/paginaUsuario/paginaUsuario.html'
            })
            .when('/cocinaRusa/admin/inicio', {
                templateUrl: '/PFG/oauth2.0/app/dest/html/paginaAdmin/paginaAdmin.html'
            })
            .when('/cocinaRusa/:idReceta/:nombreReceta', {
                templateUrl: '/PFG/oauth2.0/app/dest/html/pgnPrincipal/detalle/detalleReceta.html'
            })
            .when('/cocinaRusa/miReceta/:idReceta/:nombreReceta', {
                templateUrl: '/PFG/oauth2.0/app/dest/html/paginaUsuario/detalle/detalleReceta.html'
            })
            .when('/cocinaRusa/crearMiReceta', {
                templateUrl: '/PFG/oauth2.0/app/dest/html/paginaUsuario/crearReceta.html'
            })
            .when('/cocinaRusa/misRecetas', {
                templateUrl: '/PFG/oauth2.0/app/dest/html/paginaUsuario/recetaUsuario.html'
            })
            .otherwise({redirectTo: '/'});
       // $locationProvider.html5Mode(true);

           
});

 
 

