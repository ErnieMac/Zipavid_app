angular.module('app.controllers', ['ngCordova', 'ionic'])


.controller('moreCtrl', function(Backand, $scope, $state, $rootScope, LoginService) {
  $scope.logout = function() {
    LoginService.signout().then(function() {
      $state.go('walkthrough');
      $rootScope.$broadcast('logout');
    });
  };
})

.controller('jobsCtrl', function($scope, $http, Jobs, Backand, LoginService, User) {
  var education_lvl = 3;
  User.fetch().then(function(response) {
    education_lvl = response.data.education_level;
    console.log(education_lvl);
    Jobs.all().then(function(response) {
      var jobs = response.data.data;
      $scope.jobs = [];
      for(var i = 0; i < jobs.length; i++) {
        if(parseInt(jobs[i].minimumreq) <= education_lvl) {
          $scope.jobs.push(jobs[i]);
        }
      }
    }, function(error) {
      console.log('Unable to load jobs: ' + error.message);
    });
  });

  $scope.doRefresh = function() {
    Jobs.all().then(function(response) {
      var jobs = response.data.data;
      $scope.jobs = [];
      for(var i = 0; i < jobs.length; i++) {
        if(parseInt(jobs[i].minimumreq) <= education_lvl) {
          $scope.jobs.push(jobs[i]);
        }
      }
      $scope.$broadcast('scroll.refreshComplete');
    }, function(error) {
      console.log('Unable to load jobs: ' + error.message);
    });
  }

  /*$scope.cardSwipedLeft = function(index) {
    console.log('Ignored');
    $http.post(Backand.getApiUrl() + '/1/objects/ignored/', {
      "job": index,
      "user": LoginService.userDetails.details.userId
    });
  }

  $scope.cardSwipedRight = function(index) {
    console.log('Applied' + index);
    $http.post(Backand.getApiUrl() + '/1/objects/applications/', {
      "job": index,
      "applicant": LoginService.userDetails.details.userId
    });
  }*/

  $scope.cardDestroyed = function(index) {
    console.log("card gone");
    console.log($scope.jobs[index]);
    var id = $scope.jobs[index].id;
    $scope.jobs.splice(index, 1);
    $http.post(Backand.getApiUrl() + '/1/objects/ignored/', {
      "job": id,
      "user": LoginService.userDetails.details.userId
    });
  }
})

.controller('myProfileCtrl', function($scope) {

})

.controller('applicationCtrl', function($scope) {

  })
  .controller('sentCtrl', function($scope) {

  })
  .controller('jobDetailsCtrl', function($scope, $stateParams, $http, $ionicPopup, $sce, Backand, LoginService, Jobs) {
    var title, company, skills;
    Jobs.fetch($stateParams.id).then(function(response) {
      console.log(response.data);
      $scope.hero = response.data.image;
      $scope.icon = response.data.icon;
      $scope.title = response.data.title;
      title = $scope.title;
      $scope.salary = response.data.salary;
      $scope.location = response.data.location;
      $scope.description = response.data.description;
      $scope.experience = response.data.experience;
      $scope.company = response.data.company;
      $scope.skills = response.data.skills;
      skills = response.data.skills;
      company = $scope.company;
      $scope.googlemap = $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/place?key=AIzaSyCjawbkfG6n6_n24k5io4eOzFxpjimWhIQ&q=" + encodeURIComponent(response.data.location));
    }, function(error) {
      console.log('Unable to load jobs: ' + error.message);
    });

    $scope.jobApply = function() {
      if(skills) {
        $ionicPopup.confirm({
          title: 'Required skills',
          template: skills.replace(/(?:\r\n|\r|\n)/g, '<br>') + '<br>Do you really fulfill these requirements?'
        }).then(function(res) {
          if(res) {
            $http.post(Backand.getApiUrl() + '/1/objects/applications/', {
              "job": $stateParams.id,
              "applicant": LoginService.userDetails.details.userId,
              "title": title,
              "company": company,
              "status": 0
            });
            $ionicPopup.alert({
              title: 'Applied',
              template: 'Application for the job sent.'
            });
          }
        });
      }
    }
  })

.controller('editProfileCtrl', function($ionicPopup, $filter, $cordovaCamera, $ionicLoading, $http, Backand, User, LoginService) {
  var edit = this;
  User.fetch().then(function(response) {
    edit.firstName = response.data.firstName;
    edit.lastName = response.data.lastName;
    edit.post_code = response.data.post_code;
    edit.address = response.data.address;
    edit.location = response.data.location;
    edit.photo = response.data.photo;
    edit.email = response.data.email;
    edit.birth_date = new Date(response.data.birth_date);
    edit.education_lvl = response.data.education_level;

    edit.education = response.data.details_education;
    edit.skills = response.data.details_skills;
    edit.experience = response.data.details_experience;
    edit.language = response.data.details_language;
    edit.linkedinurl = response.data.linkedinurl;
  }, function(error) {
    console.log('Unable to load user data: ' + error.message);
  });

  edit.capture = function(type) {
    var options = {
      quality: 60,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: type,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      targetWidth: 400,
      targetHeight: 400,
      saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $ionicLoading.show({
        template: 'Uploading...'
      });
      console.log(imageData);
      edit.photo = "data:image/jpeg;base64," + imageData;
      User.update({
          "photo": "data:image/jpeg;base64," + imageData
        })
        .then(function() {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: 'Success',
            template: "Profile picture uploaded."
          });
        }, function(error) {
          $ionicLoading.hide();
          console.log(error.error_description)
          var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: "Sorry, something went wrong."
          });
        });
    }, function(error) {
      console.error(error);
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: "Sorry, something went wrong."
      });
    });
  }

  edit.updateData = function() {
    User.update({
        "firstName": edit.firstName,
        "lastName": edit.lastName,
        "location": edit.location,
        "email": edit.email,
        "birth_date": $filter('date')(edit.birth_date, "MM/dd/yyyy"),
        "education_level": edit.education_lvl,
        "post_code": edit.post_code,
        "address": edit.address
      })
      .then(function() {
        var alertPopup = $ionicPopup.alert({
          title: 'Success',
          template: "User information updated."
        });
      }, function(error) {
        console.log(error.error_description)
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: "Sorry, something went wrong."
        });
      });
  }

  edit.updateDetails = function() {
    User.update({
        "details_education": edit.education,
        "details_skills": edit.skills,
        "details_experience": edit.experience,
        "details_language": edit.language,
        "linkedinurl": edit.linkedinurl
      })
      .then(function() {
        var alertPopup = $ionicPopup.alert({
          title: 'Success',
          template: "User information updated."
        });
      }, function(error) {
        console.log(error.error_description)
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: "Sorry, something went wrong."
        });
      });
  }

  edit.changePassword = function() {
    LoginService.changePassword(edit.oldPassword, edit.newPassword)
      .then(function() {
        edit.oldPassword = "";
        edit.newPassword = "";
        var alertPopup = $ionicPopup.alert({
          title: 'Success',
          template: "Password changed."
        });
      }, function(error) {
        console.log(error.error_description)
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: "The password you entered is incorrect."
        });
      });
  }

  function fileChanged(fileInput) {
    var file = fileInput.files[0];
    var reader = new FileReader();

    var filename = fileInput.value;
    var extension = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();

    reader.onload = function(e) {
      $ionicLoading.show({
        template: 'Uploading...'
      });
      upload(file.name, e.currentTarget.result).then(function(res) {
        console.log(res.data.url);
        User.update({
            "cvurl": res.data.url
          })
          .then(function() {
            var alertPopup = $ionicPopup.alert({
              title: 'Success',
              template: "CV uploded."
            });
          }, function(error) {
            console.log(error.error_description)
            var alertPopup = $ionicPopup.alert({
              title: 'Error',
              template: "Sorry, something went wrong."
            });
          });
        $ionicLoading.hide();
      }, function(err) {
        $ionicLoading.hide();
        alert(err.data + " The file might be too large.");
      });
    };

    reader.readAsDataURL(file);
  };

  function upload(filename, filedata) {
    return $http({
      method: 'POST',
      url: Backand.getApiUrl() + '/1/objects/action/' + 'users',
      params: {
        "name": 'files'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "filename": filename,
        "filedata": filedata.substr(filedata.indexOf(',') + 1, filedata.length)
      }
    });
  };

  var fileInput = document.getElementById('fileup3');

  fileInput.addEventListener('change', function(e) {
    fileChanged(fileInput);
  });
})

.controller('createProfileCtrl', function($scope, $state, $ionicLoading, LoginService, User) {
  var create = this;

  create.data = {};

  create.onAddressSelection = function(location) {
    console.log(location);
    var components = location.address_components;
    for (var i = 0; i < components.length; i++) {
      console.log(components[i].types[0]);
      if (components[i].types[0] == "postal_code") {
        create.post_code = components[i].long_name;
      }
      if (components[i].types[0] == "locality") {
        create.location = components[i].long_name + ", ";
      }
      if (components[i].types[0] == "country") {
        create.location += components[i].short_name;
      }
    }
  };

  create.needsName = false;

  $ionicLoading.show({
    template: 'Loading...'
  });
  User.fetch().then(function(response) {
    $ionicLoading.hide();
    console.log(response.data);

    create.first_name = response.data.firstName;
    create.last_name = response.data.lastName;

    if (create.first_name == create.last_name) {
      create.needsName = true;
      create.first_name = "";
      create.last_name = "";
    }
  });

  create.submit = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    var data = {
      "photo": "img/i8wN4mATbei14CSL6VFg_1458259350_malecostume.svg",
      "birth_date": create.birth_date,
      "education_level": create.education,
      "post_code": create.post_code,
      "address": create.address,
      "location": create.location
    };
    if (create.first_name != "") {
      data.firstName = create.first_name;
    }
    if (create.last_name != "") {
      data.lastName = create.last_name;
    }
    User.update(data)
      .then(function() {
        $ionicLoading.hide();
        $state.go('experience');
      }, function(error) {
        $ionicLoading.hide();
        console.log(error.error_description)
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: "Sorry, something went wrong."
        });
      });
  }
})

.controller('uploadPictureCtrl', function($ionicPopup, $filter, $cordovaCamera, $ionicLoading, User, LoginService) {
  var picture = this;
  picture.capture = function(type) {
    var options = {
      quality: 60,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: type,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      targetWidth: 400,
      targetHeight: 400,
      saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
      console.log(imageData);
      $ionicLoading.show({
        template: 'Loading...'
      });
      User.update({
          "photo": "data:image/jpeg;base64," + imageData
        })
        .then(function() {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: 'Success',
            template: "Profile picture uploaded."
          });
        }, function(error) {
          $ionicLoading.hide();
          console.log(error.error_description)
          var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: "Sorry, something went wrong."
          });
        });
    }, function(error) {
      console.error(error);
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: "Sorry, something went wrong."
      });
    });
  }
})

.controller('experienceCtrl', function($scope, $state, $ionicLoading, $ionicPopup, $cordovaOauth, $http, Backand, Language, User) {
  var experience = this;

  experience.language = "";

  experience.getItems = function (query) {
                        if (query) {
                            return {
                                items: Language.search(query)
                            };
                        }
                        return {items: Language.all()};
                    };

  experience.linkedin = function() {
      var browserRef = window.cordova.InAppBrowser.open('https://www.linkedin.com/uas/oauth2/authorization?client_id=78ellqt2dswora&redirect_uri=http://localhost/callback&scope=r_basicprofile&response_type=code&state=4524545_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
      browserRef.addEventListener('loadstart', function(event) {
        if((event.url).indexOf("http://localhost/callback") === 0) {
          try {
            var requestToken = (event.url).split("code=")[1].split("&")[0];
            $http({method: "post", headers: {'Content-Type': 'application/x-www-form-urlencoded'}, url: "https://www.linkedin.com/uas/oauth2/accessToken", data: "client_id=78ellqt2dswora&client_secret=fS81cI6XE9exNmZw&redirect_uri=http://localhost/callback&grant_type=authorization_code&code=" + requestToken })
              .success(function(data) {
                console.log(data);
                var token = data.access_token;
                $http({
                  method: 'GET',
                  headers: {
                    'Authorization': "Bearer " + token
                  },
                  url: 'https://api.linkedin.com/v1/people/~:(id,industry,educations,languages,positions,specialties,public-profile-url)?format=json'
                }).then(function(response) {
                    console.log(response);
                    experience.linkedinurl = response.data.publicProfileUrl;
                    experience.education = "";
                    experience.skills = "";
                    experience.experience = "";
                    var positions = response.data.positions.values;
                    for(var i = 0; i < positions.length; i++) {
                      experience.experience += positions[i].company.name + " - " +  positions[i].title + ", ";
                    }
                    experience.language = "";
                }, function(error) {
                    console.log(error)
                });
              })
              .error(function(data, status) {
                console.log(data + " " + status);
              })
              .finally(function() {
                setTimeout(function() {
                    browserRef.close();
                }, 10);
              });
          } catch(e){
            setTimeout(function() {
                console.log(e)
                browserRef.close();e
            }, 10);
          }
        }
      });
  }

  function fileChanged(fileInput) {
    var file = fileInput.files[0];
    var reader = new FileReader();

    var filename = fileInput.value;
    var extension = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();

    reader.onload = function(e) {
      $ionicLoading.show({
        template: 'Uploading...'
      });
      upload(file.name, e.currentTarget.result).then(function(res) {
        console.log(res.data.url);
        User.update({
            "cvurl": res.data.url
          })
          .then(function() {
            var alertPopup = $ionicPopup.alert({
              title: 'Success',
              template: "CV uploded."
            });
          }, function(error) {
            console.log(error.error_description)
            var alertPopup = $ionicPopup.alert({
              title: 'Error',
              template: "Sorry, something went wrong."
            });
          });
        $ionicLoading.hide();
      }, function(err) {
        $ionicLoading.hide();
        alert(err.data + " The file might be too large.");
      });
    };

    reader.readAsDataURL(file);
  };

  function upload(filename, filedata) {
    return $http({
      method: 'POST',
      url: Backand.getApiUrl() + '/1/objects/action/' + 'users',
      params: {
        "name": 'files'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "filename": filename,
        "filedata": filedata.substr(filedata.indexOf(',') + 1, filedata.length)
      }
    });
  };

  var fileInput = document.getElementById('fileup4');

  fileInput.addEventListener('change', function(e) {
    fileChanged(fileInput);
  });

  experience.submit = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    User.update({
        "details_education": experience.education,
        "details_skills": experience.skills,
        "details_experience": experience.experience,
        "details_language": experience.language,
        "linkedinurl": experience.linkedinurl
      })
      .then(function() {
        $ionicLoading.hide();
        $state.go('uploadPicture');
      }, function(error) {
        $ionicLoading.hide();
        console.log(error.error_description)
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: "Sorry, something went wrong."
        });
      });
  }
})

.controller('savedJobsCtrl', function($scope) {

})

.controller('offersCtrl', function($scope) {

})

.controller('searchCtrl', function($scope) {

})

.controller('interviewsBookedCtrl', function($scope) {

})

.controller('loginCtrl', function(Backand, $state, $rootScope, $ionicPopup, LoginService) {
  var login = this;
  login.signin = function() {
    LoginService.signin(login.email, login.password)
      .then(function() {
        login.email = '';
        login.password = '';

        LoginService.loadUserDetails();

        $rootScope.$broadcast('authorized');
        $state.go('tabsController.me');
      }, function(error) {
        console.log(error.error_description)
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: error.error_description
        });
      })
  }
})

.controller('walkthroughCtrl', function($state, $scope, $rootScope, $ionicPopup, Backand, User, LoginService) {
  var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    paginationClickable: true
  });

  function twitterSignIn() {
    $ionicPopup.confirm({
      title: 'Returning user?',
      template: 'Are you a first time or returning user?',
      okText: 'Returning',
      cancelText: 'First time'
    }).then(function(result) {
      if (result) {
        socialSignIn('twitter');
      } else {
        Backand.socialSignUp('twitter', null, null, 'martykant@gmail.com');
      }
    });
  }

  function socialSignIn(provider) {
    console.log("logging in");
    LoginService.socialSignIn(provider)
      .then(function(response) {
        console.log("valid login");
        console.log(response);
        Backand.getUserDetails().then(function(response) {
          console.log(response);
          LoginService.loadUserDetails();
          $rootScope.$broadcast('authorized');
          User.fetch().then(function(response) {
            if (response.data.firstName == response.data.lastName) {
              $state.go('createProfile');
            } else {
              $state.go('tabsController.me');
            }
          });
        });
        console.log("-");
      }, function(rejection) {
        console.log("invalid login");
        console.log(rejection);
        console.log("-");
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: 'There was a problem with the log in. Please use your email instead.'
        });
      });
  }

  $scope.twitterSignIn = twitterSignIn;
  $scope.socialSignin = socialSignIn;
})

.controller('getStartedCtrl', function($scope) {
  // ???
})

.controller('signupCtrl', function(Backand, $state, $rootScope, $ionicLoading, $ionicPopup, LoginService) {
  var signup = this;
  signup.submit = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    LoginService.signup(signup.firstName, signup.lastName, signup.email, signup.password, {
        "photo": "img/i8wN4mATbei14CSL6VFg_1458259350_malecostume.svg"
      })
      .then(function(response) {
        LoginService.signin(signup.email, signup.password)
          .then(function() {
            $ionicLoading.hide();
            LoginService.loadUserDetails();
            $state.go('createProfile');
          })
      }, function(error) {
        $ionicLoading.hide();
        if (error.data.error_description != null) {
          var info = error.data.error_description;
        } else {
          var info = error.data;
        }
        console.log(error.data)
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: info
        });
      });
  }

  signup.email = '';
  signup.password = '';
  signup.again = '';
  signup.firstName = '';
  signup.lastName = '';
  signup.errorMessage = '';
})

.controller('meCtrl', function($scope, User, LoginService) {
  User.fetch().then(function(response) {
    $scope.fullName = response.data.firstName + " " + response.data.lastName;
    $scope.location = response.data.location;
    if (response.data.photo == "") {
      $scope.photo = "img/i8wN4mATbei14CSL6VFg_1458259350_malecostume.svg";
    } else {
      $scope.photo = response.data.photo;
    }
  }, function(error) {
    console.log('Unable to load user data: ' + error.message);
  });

  FCMPlugin.getToken(function(token){
    User.update({
        "fcmhash": token
      })
  });
})

.controller('forgotPasswordCtrl', function($scope) {

})

.controller('messagesCtrl', function($scope, $location, Messages, LoginService) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    Messages.all("desc").then(function(response) {
      var tempMessages = response.data.data;
      var length = tempMessages.length;
      var existing = [];
      $scope.messages = [];
      for (var i = 0; i < length; i++) {
        if(tempMessages[i].recieved == true && existing.indexOf(tempMessages[i].sender_id) == -1) {
          tempMessages[i].photo = tempMessages[i].sender_photo;
          tempMessages[i].id = tempMessages[i].sender_id;
          $scope.messages.push(tempMessages[i]);
          existing.push(parseInt(tempMessages[i].sender_id));
        }
      }
    }, function(error) {
      console.log('Unable to load message data: ' + error.message);
    });

  });
  $scope.delete = function(message) {
    Messages.remove(message);
  };
})

.controller('fullMessageCtrl', function($scope, $stateParams, $ionicScrollDelegate, $ionicLoading, $http, LoginService, Backand, Messages) {
  var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');

  $scope.sendMessage = function(form) {
    var message = $scope.input.message;
    Messages.create({
      "message": message,
      "date": new Date().toJSON(),
      "recipient": LoginService.userDetails.details.userId,
      "sender_name": "",
      "sender_id": $stateParams.messageId,
      "sender_photo": "",
      "recieved": false
    });
    $scope.input.message = "";
  }

  $scope.messages = [];
  var myphoto;

  Messages.user(parseInt(LoginService.userDetails.details.userId), parseInt($stateParams.messageId), "asc").then(function(response) {
    var tempMessages = response.data.data;
    var length = tempMessages.length;
    var finalMessages = [];
    for (var i = 0; i < length; i++) {
      var senderID = parseInt(tempMessages[i].sender_id);
      var message = response.data.data[i];
      myphoto = response.data.relatedObjects.users[parseInt(LoginService.userDetails.details.userId)].photo;
      if (tempMessages[i].recieved) {
        message.color = "green";
        if(message.sender_name != "") {
          $scope.sender_name = message.sender_name;
        }
        message.photo = message.sender_photo;
      }
      else if (tempMessages[i].message.startsWith("#Video: ")) {
        message.photo = myphoto;
        message.video = message.message.replace("#Video: ", "");
        var extension = message.video.substr(message.video.lastIndexOf('.') + 1);
        if (extension == "mp4") {
          var filetype = "video/mp4";
        } else if (extension == "webm") {
          var filetype = "video/webm";
        } else if (extension == "ogg" || extension == "ogv") {
          var filetype = "video/ogg";
        }
        message.videohtml = '<source src="' + message.video + '" type="' + filetype + '">';
        message.message = "";
      }
      else {
        message.photo = myphoto;
      }
      console.log(message);
      finalMessages.push(message);
      viewScroll.scrollBottom();
    }
    $scope.messages = finalMessages;
  });

  var reload = function() {
    Messages.user(parseInt(LoginService.userDetails.details.userId), parseInt($stateParams.messageId), "asc").then(function(response) {
      var length = $scope.messages.length;
      for (var i = length; i < response.data.totalRows; i++) {
        var message = response.data.data[i];
        var senderID = parseInt(message.sender_id);
        var myphoto = response.data.relatedObjects.users[parseInt(LoginService.userDetails.details.userId)].photo;
        console.log(message.message);
        console.log(message.message.startsWith("#Video: "));
        if (message.recieved) {
          message.color = "green";
          message.photo = message.sender_photo;
        }
        else if (message.message.startsWith("#Video: ")) {
          message.photo = myphoto;
          message.video = message.message.replace("#Video: ", "");
          var extension = message.video.substr(message.video.lastIndexOf('.') + 1);
          if (extension == "mp4") {
            var filetype = "video/mp4";
          } else if (extension == "webm") {
            var filetype = "video/webm";
          } else if (extension == "ogg" || extension == "ogv") {
            var filetype = "video/ogg";
          }
          message.videohtml = '<source src="' + message.video + '" type="' + filetype + '">';
          message.message = "";
        }
        else {
          message.photo = myphoto;
        }
        console.log(message);
        $scope.messages.push(message);
        viewScroll.scrollBottom();
      }
    });
  };

  window.setInterval(reload, 3000);

  $scope.scrollDown = function() {
    window.setInterval(function() { viewScroll.scrollBottom(); }, 1000);
  };

  $scope.record = function() {
    if(device.platform == "Android") {
      var permissions = cordova.plugins.permissions;
      permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, function(status){
        if (status.hasPermission) {
          doCapture();
        }
        else {
          permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, function(success) {
            doCapture();
          });
        }
      });
    } else {
      doCapture();
    }

    var doCapture = function() {
      navigator.device.capture.captureVideo(function(success) {
        console.log("Video captured");
        console.log(success);
        window.resolveLocalFileSystemURI(success[0].fullPath, function(success) {
          console.log("File resolved");
          console.log(success);
          fileChanged(success);
        }, function(error) {
          console.log(error);
        });
      }, function(error) {
        console.log(error);
      }, { duration: 5 });
    }
  };

  function fileChanged(file) {
    file.file(function(success) {
      console.log("File converted");
      console.log(success);
      var file = success;
      var reader = new FileReader();
      var filename = file.name;
      var extension = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
      if (extension != "mp4" && extension != "webm" && extension != "ogg" && extension != "ogv") {
        alert("Unsupported filetype. Only MP4, WEBM and OGG are supported.");
        return;
      }
      /*reader.onload = function(e) {
        console.log("Uploading");
        $ionicLoading.show({
          template: 'Uploading...'
        });
        upload(file.name, e.currentTarget.result).then(function(res) {
          Messages.create({
            "message": "#Video: " + res.data.url,
            "date": new Date().toJSON(),
            "recipient": LoginService.userDetails.details.userId,
            "sender_name": "",
            "sender_id": $stateParams.messageId,
            "sender_photo": "",
            "recieved": false
          });
          $ionicLoading.hide();
        }, function(err) {
          $ionicLoading.hide();
          alert(err.data + " The file might be too large.");
        });
      };*/

      reader.onloadend = function(e) {
        console.log("Uploading");
        console.log(e);
        $ionicLoading.show({
          template: 'Uploading...'
        });
        upload(file.name, e.target.result).then(function(res) {
          Messages.create({
            "message": "#Video: " + res.data.url,
            "date": new Date().toJSON(),
            "recipient": LoginService.userDetails.details.userId,
            "sender_name": "",
            "sender_id": $stateParams.messageId,
            "sender_photo": "",
            "recieved": false
          });
          $ionicLoading.hide();
        }, function(err) {
          $ionicLoading.hide();
          alert(err.data + " The file might be too large.");
        });
      };
      console.log("File reading started");
      reader.readAsDataURL(file);
    }, function(error) {
      console.log(error);
    })
  };

  function upload(filename, filedata) {
    return $http({
      method: 'POST',
      url: Backand.getApiUrl() + '/1/objects/action/' + 'users',
      params: {
        "name": 'files'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "filename": filename,
        "filedata": filedata.substr(filedata.indexOf(',') + 1, filedata.length)
      }
    });
  };

  var fileInput = document.getElementById('fileup');

  fileInput.addEventListener('change', function(e) {
    fileChanged(fileInput);
  });
})

.controller('notificationsCtrl', function($scope, Applications) {
  Applications.all().then(function(data) {
    console.log(data.data);
    $scope.jobs = data.data.data;
  });

  $scope.doRefresh = function() {
    Applications.all().then(function(data) {
      console.log(data.data);
      $scope.jobs = data.data.data;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
})

.controller('settingsCtrl', function($scope) {

})
