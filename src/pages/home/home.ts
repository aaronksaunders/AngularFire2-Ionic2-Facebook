import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Facebook, Device } from 'ionic-native';

import {
  AngularFire, AuthProviders,
  AuthMethods
} from 'angularfire2';

/**
 * 
 * @export
 * @class HomePage
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  /**
   * @type {*}
   * @memberOf HomePage
   */
  loginCreds: any = {}
  /**
   * @type {*}
   * @memberOf HomePage
   */
  userProfile: any
  /**
   * @type {*}
   * @memberOf HomePage
   */
  fbProfile: any
  /**
   * @type {*}
   * @memberOf HomePage
   */
  posts: any

  /**
   * Creates an instance of HomePage.
   * 
   * @param {NavController} navController
   * @param {AngularFire} af
   * @param {Platform} platform
   * 
   * @memberOf HomePage
   */
  constructor(private navController: NavController, public af: AngularFire, platform: Platform) {
    platform.ready().then(() => {
      this.af = af;

      alert(Device.serial)
    });
  }

  /**
   * check and see if we have a user at start-up
   * 
   * @memberOf HomePage
   */
  ngOnInit() {
    this.af.auth.subscribe((data) => {
      if (data) {
        this.userProfile = this.af.database.object('GLOBALFAN/users/' + data.uid);
      } else {
        this.userProfile = null;
      }
    })
  }

  /**
   * logout of firebase
   * 
   * @memberOf HomePage
   */
  doLogout() {
    this.af.auth.logout();
    this.userProfile = null;
    this.userProfile = null;
    this.fbProfile = null;
  }

  /**
   * 
   * @param {any} _creds
   * 
   * @memberOf HomePage
   */
  doRegisterUser(_creds) {
    alert("Not Implemented Yet")
  }

  /**
   * 
   * login a user using email
   * 
   * @param {any} _creds
   * @returns
   * 
   * @memberOf HomePage
   */
  doEmailLogin(_creds) {

    let providerConfig = {
      provider: AuthProviders.Password,
      method: AuthMethods.Password
    };

    return this.af.auth.login(_creds, providerConfig)
      .then((success) => {
        console.log("Firebase success: " + JSON.stringify(success));
        return this._setUpUser(_creds, success.auth);
      })
      .catch((error) => {
        console.log("Firebase failure: " + JSON.stringify(error));
        alert(JSON.stringify(error))
      });
  }


  /**
   * update the user object in the database
   * 
   * @param {any} _credentials
   * @param {any} _authData
   * @returns
   * 
   * @memberOf HomePage
   */
  _setUpUser(_credentials, _authData) {
    var ref = this.af.database.object('GLOBALFAN/users/' + _authData.uid)
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

  /**
   * 
   * get the profile infomation from the Facebook user to add it to the database
   * 
   * @returns
   * 
   * @memberOf HomePage
   */
  _FBUserProfile() {

    return new Promise((resolve, reject) => {
      Facebook.api('me?fields=id,name,email,first_name,last_name,picture.width(100).height(100).as(picture_small),picture.width(720).height(720).as(picture_large)', [])
        .then((profileData) => {
          console.log(JSON.stringify(profileData));
          return resolve(profileData);
        }, (err) => {
          console.log(JSON.stringify(err));
          return reject(err);
        });
    });
  }

  /**
   *  login using facebook credentials.
   * 
   * @memberOf HomePage
   */
  doFacebookLogin() {
    var _authInfo

    Facebook.login(['email'])
      .then((_response) => {
        console.log(_response)

        _authInfo = _response

        return this._FBUserProfile();

      }).then((success) => {
        //let p: any = firebase.auth.FacebookAuthProvider as firebase.auth.FacebookAuthProvider_Instance
        this.fbProfile = success;
        let creds = (firebase.auth.FacebookAuthProvider as any).credential(_authInfo.authResponse.accessToken)
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

            return this._setUpUser(creds, success.auth)
          })
          .catch((error) => {
            console.log("Firebase failure: " + JSON.stringify(error));
            alert(JSON.stringify(error))
          });

      })
      .catch((_error) => { console.log(_error) })
  }

}
