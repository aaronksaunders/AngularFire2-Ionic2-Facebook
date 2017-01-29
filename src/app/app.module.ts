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
  providers: [

    { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
