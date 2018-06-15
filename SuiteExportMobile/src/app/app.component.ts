import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";

import {TabsPage} from "../pages/tabs/tabs";
import {Login} from "../pages/login/login";
import {LocalDataProvider} from "../providers/localdata";
import {Configuracion} from "../pages/configuracion/configuracion";
import {SQLite} from "@ionic-native/sqlite";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = null;

    constructor(private platform: Platform,
                private statusBar: StatusBar,
                public sqlite: SQLite,
                private splashScreen: SplashScreen,
                private localdata: LocalDataProvider) {
        let seft = this;
        localdata.getStorage().get('onlogin').then((onlogin) => {
            // debugger;
            if (parseInt(onlogin) === 2) {
                localdata.getStorage().get('configured').then((configured) => {
                    this._continue().then(() => {
                        if (parseInt(configured) === 2) {
                            seft.rootPage = TabsPage;
                        } else {
                            seft.rootPage = Configuracion;
                        }
                    });
                }, (error) => {
                    console.log(error);
                    this._continue().then(() => {
                        seft.rootPage = Configuracion;
                    });
                });
            } else {
                this._continue().then(() => {
                    seft.rootPage = Login;
                });
            }
        }, (error) => {
            this._continue().then(() => {
                seft.rootPage = Login;
            });
        });
    }

    _continue() {
        return new Promise((resolve, reject) => {
            this.platform.ready().then(() => {
                this.createDataBase().then(() => {
                    this.statusBar.styleDefault();
                    this.splashScreen.hide();
                    resolve(true);
                });
            });
        });
    }

    private createDataBase() {
        return new Promise((resolve, reject) => {
            this.sqlite.create({
                name: "suiteexp.mobile",
                location: "default"
            }).then((db) => {
                this.localdata.setDataBase(db);
                return this.localdata.createSchema();
            }).then(() => {
                resolve(true);
            }).catch((error) => {
                console.error(error);
                reject(error);
            })
        });
    }
}
