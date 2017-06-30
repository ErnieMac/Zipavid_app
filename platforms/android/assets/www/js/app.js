angular.module('app', ['ionic', 'ngCordova', 'ngCordovaOauth', 'backand', 'ionic.contrib.ui.tinderCards', 'ion-google-autocomplete', 'ion-autocomplete', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])
.run(function($state, $rootScope, $ionicPlatform, Backand, LoginService) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.overlaysWebView(true);
      StatusBar.backgroundColorByHexString("#24CE00");
    }

    var isMobile = !(ionic.Platform.platforms[0] == "browser");
    Backand.setIsMobile(isMobile);
    Backand.setRunSignupAfterErrorInSigninSocial(true);

    if(typeof LoginService.userDetails.name != "undefined") {
        $rootScope.$broadcast('authorized');
        $state.go('tabsController.me');
    }
    navigator.splashscreen.hide();
  });
})

.filter('trustUrl', function ($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  });;
