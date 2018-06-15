import { Component } from '@angular/core';

import {RecepcionMP} from "../recepcion_mp/recepcion_mp";
import {RecepcionPT} from "../recepcion_pt/recepcion_pt";
import {Proceso} from "../proceso/proceso";
import {Despacho} from "../despacho/despacho";
import {SAG} from "../sag/sag";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = RecepcionMP;
    tab2Root = RecepcionPT;
    tab3Root = Proceso;
    tab4Root = SAG;
    tab5Root = Despacho;

    constructor() {

    }
}
