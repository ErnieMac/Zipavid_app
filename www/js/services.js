angular.module('app.services', ['backand'])
  .service('Messages', function($http, Backand) {
    var baseUrl = '/1/objects/',
      objectName = 'messages/';

    function getUrl() {
      return Backand.getApiUrl() + baseUrl + objectName;
    }

    function getUrlForId(id) {
      return getUrl() + id;
    }

    this.user = function(id, senderid, order) {
      return $http({
        method: 'GET',
        url: getUrl() + "?deep=true&relatedObjects=true",
        params: {
          pageSize: 20000,
          pageNumber: 1,
          sort: [{
            "fieldName": "id",
            "order": order
          }],
          filter: {
            "q": {
              "$or": [
                {
                  "sender_id": senderid
                }, {
                 "recipient": {
                  "$in": {
                    "object": "users",
                    "q": {
                      "id": id
                    },
                    "fields": ["id"]
                  }
                }
              }]
            }
          }
        }
      });
    };

    this.all = function(order) {
      return $http({
        method: 'GET',
        url: getUrl() + "?deep=true&relatedObjects=true",
        params: {
          pageSize: 20000,
          pageNumber: 1,
          sort: [{
            "fieldName": "id",
            "order": order
          }]
        }
      });
    };

    this.fetch = function(id) {
      return $http.get(getUrlForId(id));
    };

    this.create = function(object) {
      return $http.post(getUrl(), object);
    };

    this.update = function(id, object) {
      return $http.put(getUrlForId(id), object);
    };

    this.delete = function(id) {
      return $http.delete(getUrlForId(id));
    };
  })
    .service('Applications', function($http, Backand) {
      var baseUrl = '/1/objects/',
        objectName = 'applications/';

      function getUrl() {
        return Backand.getApiUrl() + baseUrl + objectName;
      }

      function getUrlForId(id) {
        return getUrl() + id;
      }

      this.all = function(order) {
        return $http.get(getUrl());
      };

      this.fetch = function(id) {
        return $http.get(getUrlForId(id));
      };

      this.create = function(object) {
        return $http.post(getUrl(), object);
      };

      this.update = function(id, object) {
        return $http.put(getUrlForId(id), object);
      };

      this.delete = function(id) {
        return $http.delete(getUrlForId(id));
      };
    })

.service('Jobs', function($http, Backand) {
  var baseUrl = '/1/objects/',
    objectName = 'jobs/';

  function getUrl() {
    return Backand.getApiUrl() + baseUrl + objectName;
  }

  function getUrlForId(id) {
    return getUrl() + id;
  }

  this.all = function() {
    return $http.get(getUrl());
  };

  this.fetch = function(id) {
    return $http.get(getUrlForId(id));
  };

  this.create = function(object) {
    return $http.post(getUrl(), object);
  };

  this.update = function(id, object) {
    return $http.put(getUrlForId(id), object);
  };

  this.delete = function(id) {
    return $http.delete(getUrlForId(id));
  };
})

.service('User', function($http, Backand, LoginService) {
  var baseUrl = '/1/objects/',
    objectName = 'users/';

  function getUrl() {
    return Backand.getApiUrl() + baseUrl + objectName;
  }

  function getUrlForId(id) {
    return getUrl() + id;
  }

  this.fetch = function() {
    return $http.get(getUrlForId(LoginService.userDetails.details.userId));
  };

  this.update = function(object) {
    return $http.put(getUrlForId(LoginService.userDetails.details.userId), object);
  };
})

.service('APIInterceptor', function($rootScope, $q) {
  this.responseError = function(response) {
    if (response.status === 401) {
      $rootScope.$broadcast('unauthorized');
    }
    return $q.reject(response);
  };
})

.service('LoginService', function($http, Backand) {
    self.currentUser = {};

    loadUserDetails();

    function loadUserDetails() {
      return Backand.getUserDetails()
        .then(function(data) {
          self.currentUser.details = data;
          if (data !== null) {
            self.currentUser.name = data.username;
          }
        });
    }

    this.loadUserDetails = loadUserDetails;
    this.userDetails = currentUser;

    this.signin = function(email, password) {
      return Backand.signin(email, password);
    };

    this.signup = function(firstName, lastName, username, password, parameters) {
      return $http({
        method: 'POST',
        url: Backand.getApiUrl() + '/1/user/signup',
        headers: {
          'SignUpToken': '17b6f913-ebb7-4feb-b496-18d722010bcf'
        },
        data: {
          "firstName": firstName,
          "lastName": lastName,
          "email": username,
          "password": password,
          "confirmPassword": password
        },
        params: {
          parameters: parameters
        }
      })
    };

    this.changePassword = function(oldPassword, newPassword) {
      return Backand.changePassword(oldPassword, newPassword)
    };

    this.requestResetPassword = function(email) {
      return Backand.requestResetPassword(email);
    };

    this.resetPassword = function(password, token) {
      return Backand.resetPassword(password, token);
    };

    this.signout = function() {
      return Backand.signout();
    };

    this.socialSignIn = function(provider) {
      return Backand.socialSignIn(provider);
    };
  })

  .service('Language', function() {
    var languages = [
       {"name": "Abkhaz"},
       {"name": "Afar"},
       {"name": "Afrikaans"},
       {"name": "Akan"},
       {"name": "Albanian"},
       {"name": "Amharic"},
       {"name": "Arabic"},
       {"name": "Aragonese"},
       {"name": "Armenian"},
       {"name": "Assamese"},
       {"name": "Avaric"},
       {"name": "Avestan"},
       {"name": "Aymara"},
       {"name": "Azerbaijani"},
       {"name": "Bambara"},
       {"name": "Bashkir"},
       {"name": "Basque"},
       {"name": "Belarusian"},
       {"name": "Bengali"},
       {"name": "Bihari"},
       {"name": "Bislama"},
       {"name": "Bosnian"},
       {"name": "Breton"},
       {"name": "Bulgarian"},
       {"name": "Burmese"},
       {"name": "Catalan"},
       {"name": "Chamorro"},
       {"name": "Chechen"},
       {"name": "Chinese"},
       {"name": "Chuvash"},
       {"name": "Cornish"},
       {"name": "Corsican"},
       {"name": "Cree"},
       {"name": "Croatian"},
       {"name": "Czech"},
       {"name": "Danish"},
       {"name": "Divehi"},
       {"name": "Dutch"},
       {"name": "English"},
       {"name": "Esperanto"},
       {"name": "Estonian"},
       {"name": "Ewe"},
       {"name": "Faroese"},
       {"name": "Fijian"},
       {"name": "Finnish"},
       {"name": "French"},
       {"name": "Fula"},
       {"name": "Galician"},
       {"name": "Georgian"},
       {"name": "German"},
       {"name": "Greek"},
       {"name": "Guaraní"},
       {"name": "Gujarati"},
       {"name": "Haitian"},
       {"name": "Hausa"},
       {"name": "Hebrew"},
       {"name": "Herero"},
       {"name": "Hindi"},
       {"name": "Hiri Motu"},
       {"name": "Hungarian"},
       {"name": "Interlingua"},
       {"name": "Indonesian"},
       {"name": "Interlingue"},
       {"name": "Irish"},
       {"name": "Igbo"},
       {"name": "Inupiaq"},
       {"name": "Ido"},
       {"name": "Icelandic"},
       {"name": "Italian"},
       {"name": "Inuktitut"},
       {"name": "Japanese"},
       {"name": "Javanese"},
       {"name": "Kalaallisut"},
       {"name": "Kannada"},
       {"name": "Kanuri"},
       {"name": "Kashmiri"},
       {"name": "Kazakh"},
       {"name": "Khmer"},
       {"name": "Kikuyu"},
       {"name": "Kinyarwanda"},
       {"name": "Kirghiz"},
       {"name": "Komi"},
       {"name": "Kongo"},
       {"name": "Korean"},
       {"name": "Kurdish"},
       {"name": "Kwanyama"},
       {"name": "Latin"},
       {"name": "Luxembourgish"},
       {"name": "Luganda"},
       {"name": "Limburgish"},
       {"name": "Lingala"},
       {"name": "Lao"},
       {"name": "Lithuanian"},
       {"name": "Luba-Katanga"},
       {"name": "Latvian"},
       {"name": "Manx"},
       {"name": "Macedonian"},
       {"name": "Malagasy"},
       {"name": "Malay"},
       {"name": "Malayalam"},
       {"name": "Maltese"},
       {"name": "Māori"},
       {"name": "Marathi (Marāṭhī)"},
       {"name": "Marshallese"},
       {"name": "Mongolian"},
       {"name": "Nauru"},
       {"name": "Navajo"},
       {"name": "Norwegian Bokmål"},
       {"name": "North Ndebele"},
       {"name": "Nepali"},
       {"name": "Ndonga"},
       {"name": "Norwegian Nynorsk"},
       {"name": "Norwegian"},
       {"name": "Nuosu"},
       {"name": "South Ndebele"},
       {"name": "Occitan"},
       {"name": "Ojibwe, Ojibwa"},
       {"name": "Oromo"},
       {"name": "Oriya"},
       {"name": "Ossetian, Ossetic"},
       {"name": "Panjabi, Punjabi"},
       {"name": "Pāli"},
       {"name": "Persian"},
       {"name": "Polish"},
       {"name": "Pashto, Pushto"},
       {"name": "Portuguese"},
       {"name": "Quechua"},
       {"name": "Romansh"},
       {"name": "Kirundi"},
       {"name": "Romanian"},
       {"name": "Russian"},
       {"name": "Sanskrit (Saṁskṛta)"},
       {"name": "Sardinian"},
       {"name": "Sindhi"},
       {"name": "Northern Sami"},
       {"name": "Samoan"},
       {"name": "Sango"},
       {"name": "Serbian"},
       {"name": "Scottish Gaelic"},
       {"name": "Shona"},
       {"name": "Sinhala"},
       {"name": "Slovak"},
       {"name": "Slovene"},
       {"name": "Somali"},
       {"name": "Southern Sotho"},
       {"name": "Spanish"},
       {"name": "Sundanese"},
       {"name": "Swahili"},
       {"name": "Swati"},
       {"name": "Swedish"},
       {"name": "Tamil"},
       {"name": "Telugu"},
       {"name": "Tajik"},
       {"name": "Thai"},
       {"name": "Tigrinya"},
       {"name": "Tibetan"},
       {"name": "Turkmen"},
       {"name": "Tagalog"},
       {"name": "Tswana"},
       {"name": "Tonga (Tonga Islands)"},
       {"name": "Turkish"},
       {"name": "Tsonga"},
       {"name": "Tatar"},
       {"name": "Twi"},
       {"name": "Tahitian"},
       {"name": "Uighur, Uyghur"},
       {"name": "Ukrainian"},
       {"name": "Urdu"},
       {"name": "Uzbek"},
       {"name": "Venda"},
       {"name": "Vietnamese"},
       {"name": "Volapük"},
       {"name": "Walloon"},
       {"name": "Welsh"},
       {"name": "Wolof"},
       {"name": "Western Frisian"},
       {"name": "Xhosa"},
       {"name": "Yiddish"},
       {"name": "Yoruba"},
       {"name": "Zhuang, Chuang"}
    ];

    this.all = function() {
      return languages;
    };

    this.search = function(name) {
      var output = [];
      for(var i = 0; i < languages.length; i++) {
        if(languages[i].name.indexOf(name) > -1) {
          output.push(languages[i]);
        }
      }
      return output;
    }
  });
