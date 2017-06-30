angular.module('app.routes', ['ionicUIRouter', 'backand'])

.config(function(BackandProvider, $ionicConfigProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
  BackandProvider.setAppName('zipavid');
  BackandProvider.setAnonymousToken('04ffe727-7b19-450c-b6be-a41a50852483');

  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.tabs.style('standard');

  $stateProvider
  .state('tabsController', {
    url: '/tabs',
    templateUrl: 'templates/tabsController.html',
    abstract: true
  })

  .state('tabsController.notifications', {
    url: '/notifications',
    views: {
      'notifications': {
        templateUrl: 'templates/notifications.html',
        controller: 'notificationsCtrl'
      }
    }
  })

  .state('tabsController.more', {
    url: '/more',
    views: {
      'more': {
        templateUrl: 'templates/more.html',
        controller: 'moreCtrl'
      }
    }
  })

  .state('tabsController.jobs', {
    url: '/jobs',
    views: {
      'jobs': {
        templateUrl: 'templates/jobs.html',
        controller: 'jobsCtrl'
      }
    }
  })

  .state('tabsController.myProfile', {
    url: '/profile',
    views: {
      'more': {
        templateUrl: 'templates/myProfile.html',
        controller: 'myProfileCtrl'
      }
    }
  })

  .state('tabsController.application', {
    url: '/application',
    views: {
      'more': {
        templateUrl: 'templates/application.html',
        controller: 'applicationCtrl'
      }
    }
  })

  .state('tabsController.search', {
    url: '/search',
    views: {
      'more': {
        templateUrl: 'templates/search.html',
        controller: 'searchCtrl'
      }
    }
  })

  .state('tabsController.sent', {
    url: '/sent',
    views: {
      'more': {
        templateUrl: 'templates/sent.html',
        controller: 'sentCtrl'
      }
    }
  })

  .state('tabsController.jobDetails', {
    url: '/job-details/:id',
    views: {
      'jobs': {
        templateUrl: 'templates/jobDetails.html',
        controller: 'jobDetailsCtrl'
      }
    }
  })

  .state('tabsController.editProfile', {
    url: '/edit-profile',
    views: {
      'dashboard': {
        templateUrl: 'templates/editProfile.html',
        controller: 'editProfileCtrl as edit'
      }
    }
  })

  .state('tabsController.savedJobs', {
    url: '/saved-jobs',
    views: {
      'more': {
        templateUrl: 'templates/savedJobs.html',
        controller: 'savedJobsCtrl'
      }
    }
  })

  .state('tabsController.offers', {
    url: '/offers',
    views: {
      'more': {
        templateUrl: 'templates/offers.html',
        controller: 'offersCtrl'
      }
    }
  })

  .state('tabsController.interviewsBooked', {
    url: '/interviews',
    views: {
      'more': {
        templateUrl: 'templates/interviewsBooked.html',
        controller: 'interviewsBookedCtrl'
      }
    }
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl as login'
  })

  .state('walkthrough', {
    url: '/walkthrough',
    templateUrl: 'templates/walkthrough.html',
    controller: 'walkthroughCtrl'
  })

  .state('getStarted', {
    url: '/getstarted',
    templateUrl: 'templates/getStarted.html',
    controller: 'getStartedCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl as signup'
  })

  .state('createProfile', {
    url: '/createProfile',
    templateUrl: 'templates/createProfile.html',
    controller: 'createProfileCtrl as create'
  })

  .state('uploadPicture', {
    url: '/uploadPicture',
    templateUrl: 'templates/uploadPicture.html',
    controller: 'uploadPictureCtrl as picture'
  })

  .state('experience', {
    url: '/experience',
    templateUrl: 'templates/experience.html',
    controller: 'experienceCtrl as experience'
  })

  .state('tabsController.me', {
    url: '/dashboard',
    views: {
      'dashboard': {
        templateUrl: 'templates/me.html',
        controller: 'meCtrl',
        cache: false
      }
    }
  })

  .state('forgotPassword', {
    url: '/forgot',
    templateUrl: 'templates/forgotPassword.html',
    controller: 'forgotPasswordCtrl'
  })

  .state('tabsController.messages', {
    url: '/messages',
    views: {
      'messages': {
        templateUrl: 'templates/messages.html',
        controller: 'messagesCtrl',
        cache: false
      }
    }
  })

  .state('tabsController.fullMessage', {
    url: '/fullMessage/:messageId',
    views: {
      'messages': {
        templateUrl: 'templates/fullMessage.html',
        controller: 'fullMessageCtrl'
      }
    }
  })

  .state('tabsController.settings', {
    url: '/settings',
    views: {
      'more': {
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })

  .state('tabsController.privacy', {
    url: '/privacy',
    views: {
      'more': {
        templateUrl: 'templates/privacy.html',
      }
    }
  })

  .state('tabsController.terms', {
    url: '/terms',
    views: {
      'more': {
        templateUrl: 'templates/terms.html',
      }
    }
  })

  $urlRouterProvider.otherwise('/walkthrough');

  $httpProvider.interceptors.push('APIInterceptor');
});
