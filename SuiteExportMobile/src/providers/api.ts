import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {LocalDataProvider} from "./localdata";

const API_URL = "http://se.sbgroup.cl/index/api_mobile/";
const API_KEY = "HU9A89SDF8HSD2F";

@Injectable()
export class APIProvider {

    constructor(public http: Http,
                private localData: LocalDataProvider) {

    }

    login(credentials: any) {
        return new Promise((resolve, reject) => {
            let headers = new Headers();
            headers.append("Accept", "application/json");
            headers.append("API_KEY", API_KEY);
            headers.append("Content-Type", "application/json");
            headers.append("Content-Type", "application/x-www-form-urlencoded");

            let endpoint = API_URL + "login";
            let data = JSON.stringify(credentials);

            this.http.post(endpoint, data)
                .subscribe((data: any) => {
                    try {
                        resolve(data.json());
                    } catch (e) {
                        reject(e);
                    }
                }, (error) => {
                    reject(error);
                });
        });
    }

    reSync() {
        return new Promise((resolve, reject) => {
            try {
                let headers = new Headers();
                headers.append("Accept", 'application/json');
                headers.append('API_KEY', API_KEY);
                headers.append('Content-Type', 'application/json');
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                let link = API_URL + '_find';


                this.localData.getStorage().get("current_empresa").then((idEmpresa) => {
                    this.localData.getStorage().get("current_temporada").then((idTemporada) => {
                        this.localData.getStorage().get("current_bodega").then((idBodega) => {
                            let _JSON = this.getJsonTOSend(idEmpresa, idTemporada, idBodega);
                            let keys = [];

                            let getApi = (b) => {
                                let value = _JSON[keys[b]];
                                this.http.post(link, JSON.stringify(value)).subscribe(data => {
                                    try {
                                        let arr = data.json();
                                        if (arr.data.hasOwnProperty('pushable')) {
                                            let factor = 20;
                                            let i = 0, n = [], index = 0, c = 0;
                                            if (arr.data.pushable[keys[b]] == undefined) {
                                                throw 'Error al rescatar los datos, no coincide el pushable :' + keys[b];
                                            }
                                            if (arr.data.pushable[keys[b]].length > factor) {
                                                for (i = 0; i < arr.data.pushable[keys[b]].length; i++) {
                                                    if (typeof n[index] === "undefined") {
                                                        n[index] = [];
                                                    }
                                                    n[index].push(arr.data.pushable[keys[b]][i]);
                                                    c++;
                                                    if (c >= factor) {
                                                        c = 0;
                                                        index++;
                                                    }
                                                }

                                                i = 0;
                                            } else {
                                                n = [arr.data.pushable[keys[b]]];
                                                i = 0;
                                            }

                                            let saveData = (i, callback) => {
                                                this.localData.saveDataApi(n[i], keys[b]).then(() => {
                                                    if ((i + 1) == n.length) {
                                                        callback();
                                                    } else {
                                                        i++;
                                                        saveData(i, callback);
                                                    }
                                                }).catch((e) => {
                                                    reject(e);
                                                });
                                            };

                                            saveData(0, () => {
                                                b++;
                                                if (b < keys.length) {
                                                    getApi(b);
                                                } else {
                                                    console.log('resolve ok');
                                                    resolve(true);
                                                }
                                            });
                                        } else {
                                            throw 'Error al rescatar los datos :' + keys[b];
                                        }
                                    } catch (e) {
                                        reject(e);
                                    }
                                }, (error) => {
                                    reject(error);
                                });
                            };

                            for (let key in _JSON) {
                                keys.push(key);
                            }
                            this.localData.truncate(keys).then(() => {
                                getApi(0);
                            }).catch((e) => {
                                reject(e);
                            });

                        });
                    });
                });
            } catch (e) {
                console.log(e);
            }

        });
    }

    sendSync() {
        return new Promise((resolve, reject) => {
            try {
                let headers = new Headers();
                headers.append("Accept", 'application/json');
                headers.append('API_KEY', API_KEY);
                headers.append('Content-Type', 'application/json');
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                let link = API_URL + '_get';
                let data: Object = <any>Object;

                this.localData._find(this.localData.GetView('prod_v_recepcion') + " WHERE activo=1", []).then((rows: Array<any>) => {
                    Object.defineProperty(data, 'prod_v_recepcion', {
                        value: rows,
                        writable: true
                    });
                    this.localData._find(this.localData.GetView('prod_v_recepcion_detalle') + " WHERE activo=1  group by idrecepcion_detalle;", []).then((rows: Array<any>) => {
                        Object.defineProperty(data, 'prod_v_recepcion_detalle', {
                            value: rows,
                            writable: true
                        });
                        this.http.post(link, JSON.stringify(data)).subscribe(data => {
                            try {
                                let arr = data.json();
                                if (arr.data.hasOwnProperty('error')) {
                                    resolve(false);
                                    throw arr.data.error;
                                } else {
                                    resolve(true);
                                }

                            } catch (e) {
                                console.log(e);
                            }
                        });
                    }).catch((e) => {
                        console.log(e);
                    });
                }).catch((e) => {
                    console.log(e);
                });
            } catch (e) {
                console.log(e);
            }

        });
    }

    private getJsonTOSend(idEmpresa, idTemporada, idBodega) {
        // let obj =  <any>{};
        // let  data: Object = <any>Object;
        let obj = {
            cfg_especie: {
                columns: JSON.stringify(["idespecie", "cod_especie", "descripcion", "idunidad_medida"]),
                criteria: JSON.stringify({idempresa: idEmpresa, activo: 1}),
                from: "cfg_especie",
                order: null,
                limit: null,
                offset: 0,
                extra_params: "",
                clean: 1
            },

            cfg_entidad: {
                columns: JSON.stringify(["identidad", "idempresa", "codigo_entidad", "razon_social", "nombre", "productor", "compania_embarque", "cliente_extranjero", "empresa_transporte", "agente_aduana"]),
                criteria: JSON.stringify({idempresa: idEmpresa, activo: 1}),
                from: "cfg_entidad",
                order: null,
                limit: null,
                offset: 0,
                extra_params: "",
                clean: 1
            },
            inv_articulo: {
                columns: JSON.stringify(["*"]),
                criteria: JSON.stringify({idempresa: idEmpresa, activo: 1}),
                from: "inv_articulo",
                order: null,
                limit: null,
                offset: 0,
                extra_params: "",
                clean: 1
            },
            cfg_v_cuartel_variedad: {
                columns: JSON.stringify(["idcuartel", "idpredio", "idvariedad", "idespecie", "sector", "descripcion", "idtipo_produccion"]),
                criteria: JSON.stringify({idempresa: idEmpresa}),
                from: "cfg_v_cuartel_variedad",// por empresa
                order: null,
                limit: null,
                offset: 0,
                extra_params: "",
                clean: 1
            },
            cfg_variedad: {
                columns: JSON.stringify(["idvariedad", "idempresa", "idespecie", "variedad", "codigo"]),
                criteria: JSON.stringify({idempresa: idEmpresa, activo: 1}),
                from: "cfg_variedad",
                order: null,
                limit: null,
                offset: 0,
                extra_params: "",
                clean: 1
            },
            cfg_calibre: {
                columns: JSON.stringify(["idcalibre", "idempresa", "cod_calibre", "descripcion", "orden", "idespecie", "checkCalidad", "is_calibrado"]),
                criteria: JSON.stringify({idempresa: idEmpresa, activo: 1}),
                from: "cfg_calibre",
                order: null,
                limit: null,
                offset: 0,
                extra_params: "",
                clean: 1
            },
            cfg_v_predio: {
                columns: JSON.stringify(["idpredio", "identidad", "idbodega", "descripcion", "cod_predio", "idempresa", "proveedor", "productor", "cliente"]),
                criteria: JSON.stringify({idempresa: idEmpresa, activo: 1}),
                from: "cfg_v_predio",
                order: null,
                limit: null,
                offset: 0,
                extra_params: "",
                clean: 1
            }, web_movil_recep: {
                columns: JSON.stringify(["*"]),
                criteria: JSON.stringify({idtemporada: idTemporada, idbodega: idBodega}),
                from: "web_movil_recep",
                order: null,
                limit: null,
                offset: 0,
                extra_params: " LIMIT 50",
                clean: 1
            }, cfg_v_conf_print: {
                columns: JSON.stringify(["*"]),
                criteria: JSON.stringify({idempresa: idEmpresa, activo: 1}),
                from: "cfg_v_conf_print",
                order: null,
                limit: null,
                offset: 0,
                extra_params: "",
                clean: 1
            }
        };
        return obj;
    }


}