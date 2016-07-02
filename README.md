# AngularFire2-Ionic2-Facebook
Facebook Login w/AngularFire2 and Ionic2

See Issue here.... https://github.com/angular/angularfire2/issues/296

-
**Looking for a More complete Ionic2 Firebase 3 solution with Authentication and Image Upload**
https://github.com/aaronksaunders/ionic2firebase3

-
Make sure you install the plugin correctly and configure your facebook app
[http://ionicframework.com/docs/v2/native/facebook/](http://ionicframework.com/docs/v2/native/facebook/)

I believe running `ionic state restore` should get you going!

Be sure you update the app with your credentials from Firebase Console

```Javascript
// In app.ts
@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [
    FIREBASE_PROVIDERS,
    // Initialize Firebase app  - CHANGE THESE
    defaultFirebase({
      apiKey: "YOUR-API-KEY",
      authDomain: "YOUR-AUTH-DOMAIN",
      databaseURL: "https://YOUR-DATABASE-URL.com",
      storageBucket: "YOUR-STORAGE-BUCKET.com",
    }),
    firebaseAuthConfig({})
  ]
})
```

###Basic Email Login

This is pretty straigt forward
```javascript
  doEmailLogin(_creds) {

    let providerConfig = {
      provider: AuthProviders.Password,
      method: AuthMethods.Password
    };

    this.af.auth.login(_creds, providerConfig)
      .then((success) => {
        console.log("Firebase success: " + JSON.stringify(success));
        alert(JSON.stringify(success))
      })
      .catch((error) => {
        console.log("Firebase failure: " + JSON.stringify(error));
        alert(JSON.stringify(error))
      });
  }
```

###Facebook Login
The magic is properly creating the credentials... for Facebook login.

```Javascript
import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {Facebook} from 'ionic-native';

import {
  FIREBASE_PROVIDERS, defaultFirebase,
  AngularFire, firebaseAuthConfig, AuthProviders,
  AuthMethods
} from 'angularfire2';


declare let firebase: any;

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [
    FIREBASE_PROVIDERS,
    // Initialize Firebase app  
    defaultFirebase({
      apiKey: "AIzaSyAj670",
      authDomain: "",
      databaseURL: "",
      storageBucket: "",
    }),
    firebaseAuthConfig({})
  ]
})

export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform, public af: AngularFire) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();


      Facebook.login(['email'])
        .then((_response) => {
          console.log(_response)

          /// THIS IS THE MAGIC ....
          // - See Documentation
          // https://firebase.google.com/docs/reference/js/firebase.auth.FacebookAuthProvider#credential
          //
          let creds = firebase.auth.FacebookAuthProvider.credential(_response.authResponse.accessToken)
          /////////////////////////
          
          let providerConfig = {
            provider: AuthProviders.Facebook,
            method: AuthMethods.OAuthToken,
            remember: 'default',
            scope: ['email'],
          };
          this.af.auth.login(creds, providerConfig)
            .then((success) => {
              console.log("Firebase success: " + JSON.stringify(success));
              alert(JSON.stringify(success))
            })
            .catch((error) => {
              console.log("Firebase failure: " + JSON.stringify(error));
              alert(JSON.stringify(error))
            });

        })
        .catch((_error) => { console.log(_error) })
    });
  }
}

ionicBootstrap(MyApp);
```

### Saving User


Saves the user to the database, this is where you would potentially store additional 
information on the user

```Javascript

  _setUpUser(_credentials, _authData) {
    var ref = firebase.database().ref('APP/users/' + _authData.uid)
    var data = {
      "provider": _authData.providerData[0],
      "avatar": (_credentials.imageUri || "missing"),
      "displayName": _authData.email,
    };

    return ref.set(data).then(function () {
      return data
    }).catch(function (_error) {
      return _error
    })
  }
```