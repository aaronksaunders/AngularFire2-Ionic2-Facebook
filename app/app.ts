import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';


import {
  FIREBASE_PROVIDERS, defaultFirebase,
  AngularFire, firebaseAuthConfig, AuthProviders,
  AuthMethods
} from 'angularfire2';

//declare let firebase: any;

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [
    FIREBASE_PROVIDERS,
    // Initialize Firebase app  - CHANGE THESE
    defaultFirebase({
      apiKey: "AIzaSyAj670bbFR6dY",
      authDomain: "authDomain",
      databaseURL: "https://databaseURL.com",
      storageBucket: "storageBucket.appspot.com",
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
    });
  }
}

ionicBootstrap(MyApp);
