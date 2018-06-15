import {NgModule, ErrorHandler} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {TabsPage} from '../pages/tabs/tabs';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {RecepcionMP} from "../pages/recepcion_mp/recepcion_mp";
import {RecepcionPT} from "../pages/recepcion_pt/recepcion_pt";
import {Proceso} from "../pages/proceso/proceso";
import {Despacho} from "../pages/despacho/despacho";
import {SAG} from "../pages/sag/sag";
import {Login} from "../pages/login/login";

import {APIProvider, LocalDataProvider} from "../providers";
import {HttpModule} from "@angular/http";
import {IonicStorageModule} from "@ionic/storage";
import {ProfilePage} from "../pages/profilepage/profilepage";
import {Configuracion} from "../pages/configuracion/configuracion";
import {AgregarMPModal} from "../pages/recepcion_mp/modal_add/agregar_modal";
import {DetailMPModal} from "../pages/recepcion_mp/modal_detail/detail_modal";
import {DashboardPage} from "../pages/dashboard/dashboard";
import {SQLite} from "@ionic-native/sqlite";
import {ConfImpresora} from "../pages/profilepage/conf_impresora/conf_impresora";
import {ZebraPrinter} from "../../plugins/zebra-printer/native/index";

@NgModule({
    declarations: [
        MyApp,
        RecepcionMP,
        RecepcionPT,
        Proceso,
        SAG,
        Despacho,
        Login,
        TabsPage,
        Configuracion,

        //MODALES
        ProfilePage,
        DashboardPage,
        AgregarMPModal,
        DetailMPModal,
        ConfImpresora
    ],
    imports: [
        ReactiveFormsModule,
        BrowserModule,
        HttpModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        RecepcionMP,
        RecepcionPT,
        Proceso,
        SAG,
        Despacho,
        Login,
        TabsPage,
        Configuracion,

        //MODALES
        DashboardPage,
        ProfilePage,
        AgregarMPModal,
        DetailMPModal,
        ConfImpresora
    ],
    providers: [
        StatusBar,
        SplashScreen,
        ZebraPrinter,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        SQLite,

        APIProvider,
        LocalDataProvider
    ]
})
export class AppModule {
}
