# AngularFire2-Ionic2-Facebook
Facebook Login w/AngularFire2 and Ionic2

```
Cordova CLI: 6.4.0
Ionic Framework Version: 2.0.0
Ionic CLI Version: 2.2.1
Ionic App Lib Version: 2.1.7
Ionic App Scripts Version: 1.0.0
ios-deploy version: 1.8.6
ios-sim version: 5.0.6
OS: macOS Sierra
Node Version: v5.0.0
Xcode version: Xcode 8.2.1 Build version 8C1002
```

See Issue here.... https://github.com/angular/angularfire2/issues/296

-
**Looking for a More complete Ionic2 Firebase 3 solution with Authentication and Image Upload**
https://github.com/aaronksaunders/ionic2firebase3

-
Make sure you install the plugin correctly and configure your facebook app
[http://ionicframework.com/docs/v2/native/facebook/](http://ionicframework.com/docs/v2/native/facebook/)

I believe running `ionic state restore` should get you going!

###Update Facebook Information

In `package.json`
```Javascript
    {
      "id": "cordova-plugin-facebook4",
      "locator": "cordova-plugin-facebook4",
      "variables": {
        "APP_ID": "YOUR-APP-ID",
        "APP_NAME": "YOUR-APP-NAME"
      }
```      
And also edit the information in the `config.xml` file
```
    <plugin name="cordova-plugin-facebook4" spec="~1.7.1">
        <variable name="APP_ID" value="YOUR-APP-ID" />
        <variable name="APP_NAME" value="YOUR-APP-NAME" />
    </plugin>
```

Be sure you update the app with your credentials from Firebase Console

```Javascript
// In app.module.ts
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { AngularFireModule } from 'angularfire2';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp({
      apiKey: "YOUR-API-KEY",
      authDomain: "YOUR-AUTH-DOMAIN",
      databaseURL: "https://YOUR-DATABASE-URL.com",
      storageBucket: "YOUR-STORAGE-BUCKET.com",
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
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

```

### Saving User


Saves the user to the database, this is where you would potentially store additional 
information on the user

```Javascript

  _setUpUser(_credentials, _authData) {
    var ref = this.af.database.object('APP/users/' + _authData.uid)
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
