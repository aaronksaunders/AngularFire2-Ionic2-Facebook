import {Component} from "@angular/core";
import {Platform, NavController} from 'ionic-angular';
import {Facebook} from 'ionic-native';

import {
  FIREBASE_PROVIDERS, defaultFirebase,
  AngularFire, firebaseAuthConfig, AuthProviders,
  AuthMethods
} from 'angularfire2';

declare let firebase: any;

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  loginCreds: any = {}

  constructor(private navController: NavController, public af: AngularFire, platform: Platform) {
    platform.ready().then(() => {

      this.af = af;

    });
  }

  doRegisterUser(_creds) {
    alert("Not Implemented Yet")
  }

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

  doFacebookLogin() {

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
  }
}
