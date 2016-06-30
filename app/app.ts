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

          let creds = firebase.auth.FacebookAuthProvider.credential(_response.authResponse.accessToken)
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
