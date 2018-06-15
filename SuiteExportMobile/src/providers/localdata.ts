import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {SQLiteObject} from "@ionic-native/sqlite";
@Injectable()
export class LocalDataProvider {

    db: SQLiteObject = null;

    constructor(private storage: Storage) {

    }


    _find(statement: string, params: any) {
        return new Promise((resolve, reject) => {
            this.db.executeSql(statement, params).then((data) => {
                let response = [];
                for (var i = 0; i < data.rows.length; i++) {
                    response.push(data.rows.item(i));
                }
                resolve(response);
            }).catch((e) => {
                console.log(e);
                reject(e);
            });
        });
    }

    _executeSql(sql, values, callback) {
        this.db.executeSql(sql, values).then(() => {
            this._find("SELECT last_insert_rowid() as lastID;", []).then((row) => {
                if (typeof callback === "function") {
                    callback(row[0].lastID);
                }
            }).catch((e) => {
                console.error(e);
            });
        }).catch((e) => {
            console.error(e);
        });
    }

    getStorage() {
        return this.storage;
    }

    setDataBase(db: SQLiteObject) {
        if (this.db === null) {
            console.log('connected');
            this.db = db;
        }
    }

    saveDataApi(ORM, key) {
        switch (key) {
            case "cfg_especie": {
                return this.saveCfgEspecie(ORM);
            }
            case "cfg_entidad": {
                return this.saveCfgEntidad(ORM);
            }
            case "inv_articulo": {
                return this.saveInvArticulo(ORM);
            }
            case "cfg_v_cuartel_variedad": {
                return this.saveCfgCuartel(ORM);
            }
            case "cfg_variedad": {
                return this.saveCfgVariedad(ORM);
            }
            case "cfg_calibre": {
                return this.saveCfgCalibre(ORM);
            }
            case "cfg_v_predio": {
                return this.saveCfgPredio(ORM);
            }
            case "web_movil_recep": {
                return this.saveWeb_movil_recep(ORM);
            }
            case "cfg_v_conf_print": {
                return this.saveCfg_v_conf_print(ORM);
            }
            default: {
                throw  new Error(key + " don't exits in switch");
            }
        }
    }

    private saveCfgEspecie(orm) {
        let str = "?,";
        let sql = "INSERT INTO cfg_especie (" +
            "idespecie," +
            "cod_especie," +
            "descripcion," +
            "idunidad_medida" +
            ") VALUES ";
        let values = [];
        for (const obj of orm) {
            values.push(obj.idespecie);
            values.push(obj.cod_especie);
            values.push(obj.descripcion);
            values.push(obj.idunidad_medida);
            sql += "(" + str.repeat(4).slice(0, -1) + "),";
        }
        sql = sql.slice(0, -1);
        return this.db.executeSql(sql, values);
    }

    private saveCfgEntidad(orm) {
        let str = "?,";
        let sql = "INSERT INTO cfg_entidad (" +
            "identidad," +
            "idempresa," +
            "codigo_entidad," +
            "razon_social," +
            "nombre," +
            "productor," +
            "compania_embarque," +
            "cliente_extranjero," +
            "empresa_transporte," +
            "agente_aduana" +
            ") VALUES ";
        let values = [];
        for (const obj of orm) {
            values.push(obj.identidad);
            values.push(obj.idempresa);
            values.push(obj.codigo_entidad);
            values.push(obj.razon_social);
            values.push(obj.nombre);
            values.push(obj.productor);
            values.push(obj.compania_embarque);
            values.push(obj.cliente_extranjero);
            values.push(obj.empresa_transporte);
            values.push(obj.agente_aduana);
            sql += "(" + str.repeat(10).slice(0, -1) + "),";
        }
        sql = sql.slice(0, -1);
        return this.db.executeSql(sql, values);
    }

    private saveInvArticulo(orm) {
        let str = "?,";
        let sql = "INSERT INTO inv_articulo (" +
            "idarticulo," +
            "cod_articulo," +
            "descripcion," +
            "idespecie," +
            "idcategoria," +
            "idtipo_articulo," +
            "idtipo_produccion," +
            "idarticulo_fact," +
            "idvariedad," +
            "desc_tipo_produccion," +
            "idmercado," +
            "idempresa" +
            ") VALUES ";
        let values = [];
        for (const obj of orm) {
            values.push(obj.idarticulo);
            values.push(obj.cod_articulo);
            values.push(obj.descripcion);
            values.push(obj.idespecie);
            values.push(obj.idcategoria);
            values.push(obj.idtipo_articulo);
            values.push(obj.idtipo_produccion);
            values.push(obj.idarticulo_fact);
            values.push(obj.idvariedad);
            values.push(obj.desc_tipo_produccion);
            values.push(obj.idmercado);
            values.push(obj.idempresa);
            sql += "(" + str.repeat(12).slice(0, -1) + "),";
        }
        sql = sql.slice(0, -1);
        return this.db.executeSql(sql, values);
    }

    private saveCfgCuartel(orm) {
        let str = "?,";
        let sql = "INSERT INTO cfg_cuartel (" +
            "idcuartel," +
            "idpredio," +
            "idvariedad," +
            "idespecie," +
            "sector," +
            "descripcion," +
            "idtipo_produccion" +
            ") VALUES ";
        let values = [];
        for (const obj of orm) {
            values.push(obj.idcuartel);
            values.push(obj.idpredio);
            values.push(obj.idvariedad);
            values.push(obj.idespecie);
            values.push(obj.sector);
            values.push(obj.descripcion);
            values.push(obj.idtipo_produccion);
            sql += "(" + str.repeat(7).slice(0, -1) + "),";
        }
        sql = sql.slice(0, -1);
        return this.db.executeSql(sql, values);
    }

    private saveCfgVariedad(orm) {
        let str = "?,";
        let sql = "INSERT INTO cfg_variedad (" +
            "idvariedad," +
            "idempresa," +
            "idespecie," +
            "codigo," +
            "variedad" +
            ") VALUES ";
        let values = [];
        for (const obj of orm) {
            values.push(obj.idvariedad);
            values.push(obj.idempresa);
            values.push(obj.idespecie);
            values.push(obj.codigo);
            values.push(obj.variedad);
            sql += "(" + str.repeat(5).slice(0, -1) + "),";
        }
        sql = sql.slice(0, -1);
        return this.db.executeSql(sql, values);
    }

    private saveCfgCalibre(orm) {
        let str = "?,";
        let sql = "INSERT INTO cfg_calibre (" +
            "idcalibre," +
            "idempresa," +
            "cod_calibre," +
            "descripcion," +
            "orden," +
            "idespecie," +
            "checkCalidad," +
            "is_calibrado" +
            ") VALUES ";
        let values = [];
        for (const obj of orm) {
            values.push(obj.idcalibre);
            values.push(obj.idempresa);
            values.push(obj.cod_calibre);
            values.push(obj.descripcion);
            values.push(obj.orden);
            values.push(obj.idespecie);
            values.push(obj.checkCalidad);
            values.push(obj.is_calibrado);
            sql += "(" + str.repeat(8).slice(0, -1) + "),";
        }
        sql = sql.slice(0, -1);
        return this.db.executeSql(sql, values);
    }

    private saveCfg_v_conf_print(orm) {
        let str = "?,";
        let sql = "INSERT INTO cfg_v_conf_print (" +
            "idcfg_conf_print," +
            "code," +
            "idempresa," +
            "idespecie," +
            "activo" +
            ") VALUES ";
        let values = [];
        for (const obj of orm) {
            values.push(obj.idcfg_conf_print);
            values.push(obj.code);
            values.push(obj.idempresa);
            values.push(obj.idespecie);
            values.push(obj.activo);
            sql += "(" + str.repeat(5).slice(0, -1) + "),";
        }
        sql = sql.slice(0, -1);
        return this.db.executeSql(sql, values);
    }

    private saveCfgPredio(orm) {
        let str = "?,";
        let sql = "INSERT INTO cfg_predio (" +
            "idpredio," +
            "identidad," +
            "idbodega," +
            "cod_predio," +
            "descripcion," +
            "idempresa," +
            "proveedor," +
            "productor," +
            "cliente" +
            ") VALUES ";
        let values = [];
        for (let obj of orm) {
            values.push(obj.idpredio);
            values.push(obj.identidad);
            values.push(obj.idbodega);
            values.push(obj.cod_predio);
            values.push(obj.descripcion);
            values.push(obj.idempresa);
            values.push(obj.proveedor);
            values.push(obj.productor);
            values.push(obj.cliente);
            sql += "(" + str.repeat(9).slice(0, -1) + "),";
        }
        sql = sql.slice(0, -1);
        return this.db.executeSql(sql, values);
    }

    private saveWeb_movil_recep(orm) {
        let str = "?,";
        let sql = "INSERT INTO `prod_recepcion` (\
            `idrecepcion_server`,\
            `tipo_recepcion`,\
            `idtemporada`,\
            `idbodega`,\
            `idpredio`,\
            `guia`,\
            `fecha_guia_despacho`,\
            `fecha_recepcion`,\
            `identidad_transporte`,\
            `chofer`,\
            `rut_chofer`,\
            `patente_camion`,\
            `patente_carro`,\
            `idespecie`,\
            `observaciones`,\
            `calidad_aplicada`,\
            `is_rebajado`,\
            `idcreador`,\
            `idmodificador`,\
            `ideliminador`,\
            `fecha_creacion`,\
            `activo`,\
            `paletizado`,\
            `idpredio_rotulado`\
            ) VALUES ";
        let values = [];
        for (const obj of orm) {
            values.push(obj.idrecepcion);
            values.push(obj.tipo_recepcion);
            values.push(obj.idtemporada);
            values.push(obj.idbodega);
            values.push(obj.idpredio);
            values.push(obj.guia);
            values.push(obj.fecha_guia_despacho);
            values.push(new Date(obj.fecha_recepcion).toISOString());
            values.push(obj.identidad_transporte);
            values.push(obj.chofer);
            values.push(obj.rut_chofer);
            values.push(obj.patente_camion);
            values.push(obj.patente_carro);
            values.push(obj.idespecie);
            values.push(obj.observaciones);
            values.push(obj.calidad_aplicada);
            values.push(obj.is_rebajado);
            values.push(obj.idcreador);
            values.push(obj.idmodificador);
            values.push(obj.ideliminador);
            values.push(new Date(obj.fecha_creacion).toISOString());
            values.push(obj.activo);
            values.push(obj.paletizado);
            values.push(obj.idpredio_rotulado);
            sql += "(" + str.repeat(24).slice(0, -1) + "),";
        }
        sql = sql.slice(0, -1);
        return this.db.executeSql(sql, values);
    }

    public truncate(tables) {
        let this_table: string;
        return new Promise((resolve, reject) => {
            let t = (i, callback) => {
                switch (tables[i]) {
                    case "cfg_v_cuartel_variedad": {
                        this_table = "cfg_cuartel";
                        break;
                    }
                    case "cfg_v_predio": {
                        this_table = "cfg_predio";
                        break;
                    }case "web_movil_recep": {
                        this_table = "prod_recepcion";
                        break;
                    }
                    default: {
                        this_table = tables[i];
                        break;
                    }
                }
                this.db.executeSql("Delete from " + this_table, []).then(() => {
                    if ((i + 1) == tables.length) {
                        callback();
                    } else {
                        i++;
                        t(i, callback);
                    }
                }).catch((e) => {
                    console.log('errorr truncate');
                    reject(e);
                });
            };

            t(0, () => {
                resolve(true)
            });
        });
        //  this.db.executeSql("DELETE FROM SQLITE_SEQUENCE WHERE name='" + this_table + "';");

    }

    /////////////////////////////////////////////////////////////////////
    createSchema() {//DROP TABLE `cfg_predio`;
        console.log('Schema was created');
        let tables = [
            "CREATE TABLE IF NOT EXISTS `cfg_especie` ( \
                `idespecie` INT(11) NOT NULL, \
                `cod_especie` varchar(45) DEFAULT NULL, \
                `descripcion` varchar(255) DEFAULT NULL, \
                `idunidad_medida` INT(11) NOT NULL DEFAULT '1' \
            );",
            "CREATE TABLE IF NOT EXISTS `cfg_entidad` ( \
                `identidad` INT(11) NOT NULL, \
                `idempresa` INT(11) NOT NULL, \
                `codigo_entidad` varchar(45) DEFAULT NULL, \
                `razon_social` varchar(255) DEFAULT NULL, \
                `nombre` varchar(45) DEFAULT NULL,\
                `cliente` INT(1) DEFAULT NULL,\
                `proveedor` INT(1) DEFAULT NULL,\
                `productor` INT(1) DEFAULT NULL,\
                `compania_embarque` INT(1) DEFAULT '0',\
                `cliente_extranjero` INT(1) DEFAULT NULL,\
                `empresa_transporte` INT(1) DEFAULT NULL,\
                `agente_aduana` INT(1) DEFAULT NULL\
            );",
            "CREATE TABLE IF NOT EXISTS  `inv_articulo` ( \
                `idarticulo` INT(11) NOT NULL, \
                `cod_articulo` VARCHAR(45) DEFAULT NULL, \
                `descripcion` VARCHAR(255) DEFAULT NULL, \
                `idespecie` INT(11) DEFAULT NULL, \
                `idcategoria` INT(11) DEFAULT NULL, \
                `idtipo_articulo` INT(11) NOT NULL, \
                `idtipo_produccion` INT(11) DEFAULT NULL, \
                `idarticulo_fact` INT(11) DEFAULT NULL, \
                `idvariedad` INT(11) DEFAULT NULL, \
                `desc_tipo_produccion` VARCHAR(255) DEFAULT NULL, \
                `idmercado` INT(11) DEFAULT NULL, \
                `idempresa` INT(11) DEFAULT NULL \
            );  ",
            "CREATE TABLE IF NOT EXISTS `cfg_cuartel` ( \
                `idcuartel` INT(11) NOT NULL , \
                `idpredio` INT(11) NOT NULL, \
                `idespecie` INT(11) NOT NULL, \
                `idvariedad` INT(11) NOT NULL, \
                `sector` varchar(45) DEFAULT NULL, \
                `descripcion` varchar(255) DEFAULT NULL, \
                `idtipo_produccion` INT(11) DEFAULT NULL \
            );",
            "CREATE TABLE IF NOT EXISTS `cfg_variedad` ( \
                `idvariedad` INT(11) NOT NULL , \
                `idempresa` INT(11) NOT NULL DEFAULT '1', \
                `idespecie` INT(11) NOT NULL, \
                `variedad` VARCHAR(255) DEFAULT NULL, \
                `codigo` VARCHAR(45) DEFAULT NULL \
            );",
            "CREATE TABLE IF NOT EXISTS `cfg_calibre` ( \
                `idcalibre` INT(11) NOT NULL , \
                `idempresa` INT(11) NOT NULL DEFAULT '1', \
                `cod_calibre` varchar(45) DEFAULT NULL, \
                `descripcion` varchar(255) DEFAULT NULL, \
                `orden` INT(2) DEFAULT NULL, \
                `idespecie` INT(11) NOT NULL, \
                `checkCalidad` INT(1) NOT NULL DEFAULT '1', \
                `is_calibrado` INT(1) DEFAULT '0' \
             );",
            "CREATE TABLE IF NOT EXISTS  `cfg_predio` ( \
                `idpredio` int(11) NOT NULL PRIMARY KEY, \
                `identidad` int(11) NOT NULL, \
                `idbodega` int(11) DEFAULT NULL, \
                `cod_predio` varchar(45) DEFAULT NULL, \
                `descripcion` varchar(255) DEFAULT NULL, \
                `idempresa` int(11) DEFAULT NULL, \
                `proveedor` int(11) DEFAULT NULL, \
                `productor` int(11) DEFAULT NULL, \
                `cliente` int(11) DEFAULT NULL \
            );","CREATE TABLE `cfg_v_conf_print` ( \
                `idcfg_conf_print` INT(11) NOT NULL , \
                `code` TEXT NULL, \
                `idempresa` INT(11) NOT NULL DEFAULT '1', \
                `idespecie` TEXT NOT NULL, \
                `activo` INT(1) NULL DEFAULT '1');",
            /////////////////////////////////////////////////////
            "CREATE TABLE IF NOT EXISTS `prod_recepcion` ( \
                `idrecepcion` INTEGER PRIMARY KEY AUTOINCREMENT, \
                `idrecepcion_server` INT(11) DEFAULT '0', \
                `tipo_recepcion` VARCHAR(45) DEFAULT NULL, \
                `idtemporada` INT(11) NOT NULL, \
                `idbodega` INT(11) NOT NULL, \
                `idpredio` INT(11) NOT NULL, \
                `guia` VARCHAR(45) DEFAULT NULL, \
                `fecha_guia_despacho` DATE DEFAULT NULL, \
                `fecha_recepcion` DATETIME DEFAULT NULL, \
                `identidad_transporte` INT(11) NOT NULL , \
                `chofer` VARCHAR(255) DEFAULT NULL, \
                `rut_chofer` VARCHAR(45) DEFAULT NULL, \
                `patente_camion` VARCHAR(45) DEFAULT NULL, \
                `patente_carro` VARCHAR(45) DEFAULT NULL, \
                `idespecie` INT(11) NOT NULL, \
                `observaciones` TEXT, \
                `calidad_aplicada` INT(1) NOT NULL DEFAULT '0', \
                `is_rebajado` INT(1) NOT NULL DEFAULT '0', \
                `idcreador` INT(11) NOT NULL, \
                `idmodificador` INT(11) DEFAULT NULL, \
                `ideliminador` INT(11) DEFAULT NULL, \
                `fecha_creacion` DATE NOT NULL, \
                `fecha_edicion` DATE DEFAULT NULL, \
                `fecha_eliminacion` DATE DEFAULT NULL, \
                `activo` INT(1) DEFAULT NULL, \
                `paletizado` INT(1) DEFAULT '1', \
                `idpredio_rotulado` INT(11) DEFAULT NULL \
             );",
            "CREATE TABLE IF NOT EXISTS  `prod_recepcion_detalle` ( \
                `idrecepcion_detalle` INTEGER PRIMARY KEY AUTOINCREMENT, \
                `idrecepcion` int(11) NOT NULL, \
                `lote` varchar(45) DEFAULT NULL, \
                `idarticulo` int(11) NOT NULL, \
                `idcalibre` int(11) NOT NULL, \
                `idcuartel` int(11) NOT NULL, \
                `idvariedad` int(11) NOT NULL, \
                `fecha_cosecha` date DEFAULT NULL, \
                `fecha_embalaje` date DEFAULT NULL, \
                `cant_cajas` float DEFAULT NULL, \
                `kilos_brutos` float DEFAULT NULL, \
                `kilos_netos` float DEFAULT NULL, \
                `cant_cajas_informadas` float DEFAULT NULL, \
                `kilos_brutos_informados` float DEFAULT NULL, \
                `idarticulo_envase` int(11) DEFAULT NULL, \
                `calidad_aplicada` int(1) DEFAULT '0', \
                `idcreador` int(11) NOT NULL, \
                `idmodificador` int(11) DEFAULT NULL, \
                `ideliminador` int(11) DEFAULT NULL, \
                `fecha_creacion` date NOT NULL, \
                `fecha_edicion` date DEFAULT NULL, \
                `fecha_eliminacion` date DEFAULT NULL, \
                `activo` int(1) DEFAULT NULL, \
                `idestado_stock_paletizado` int(11) DEFAULT '4', \
                `temperatura` float DEFAULT NULL, \
                `idarticulo_pallet` int(11) DEFAULT NULL, \
                `app` int(1) DEFAULT '0', \
                `idcuartel_rotulado` int(11) DEFAULT NULL, \
                `idvariedad_rotulada` int(11) DEFAULT NULL \
           );"
        ];
        /////////////////////////SAVE ON THIS/////////////

        for (let i = 0; i < tables.length; i++) {
            this.db.executeSql(tables[i], []);
        }
        return true;
    }

    public GetView(name) {
        let query = {prod_v_recepcion: "", prod_v_recepcion_detalle: ""};

        query.prod_v_recepcion = "SELECT * FROM (SELECT  \
            `prod_recepcion`.`idrecepcion` AS `idrecepcion`, \
            `prod_recepcion`.`idrecepcion_server` AS `idserver`, \
            `prod_recepcion`.`tipo_recepcion` AS `tipo_recepcion`, \
            `prod_recepcion`.`idtemporada` AS `idtemporada`, \
            `prod_recepcion`.`idbodega` AS `idbodega`, \
            `prod_recepcion`.`idpredio` AS `idpredio`, \
            `prod_recepcion`.`idpredio_rotulado` AS `idpredio_rotulado`, \
            `prod_recepcion`.`guia` AS `guia`, \
            `prod_recepcion`.`fecha_guia_despacho` AS `fecha_guia_despacho`, \
            `prod_recepcion`.`fecha_recepcion` AS `fecha_recepcion`, \
            strftime('%d-%m-%Y',`prod_recepcion`.`fecha_guia_despacho`) AS `fecha_guia_despacho_i`, \
            strftime('%d-%m-%Y',`prod_recepcion`.`fecha_recepcion`) AS `fecha_recepcion_i`, \
            `prod_recepcion`.`identidad_transporte` AS `identidad_transporte`, \
            `prod_recepcion`.`chofer` AS `chofer`, \
            `prod_recepcion`.`rut_chofer` AS `rut_chofer`, \
            `prod_recepcion`.`patente_camion` AS `patente_camion`, \
            `prod_recepcion`.`patente_carro` AS `patente_carro`, \
            `prod_recepcion`.`idespecie` AS `idespecie`, \
            `prod_recepcion`.`observaciones` AS `observaciones`, \
            `prod_recepcion`.`idcreador` AS `idcreador`, \
            `prod_recepcion`.`idmodificador` AS `idmodificador`, \
            `prod_recepcion`.`ideliminador` AS `ideliminador`, \
            `prod_recepcion`.`fecha_creacion` AS `fecha_creacion`, \
            `prod_recepcion`.`fecha_edicion` AS `fecha_edicion`, \
            `prod_recepcion`.`fecha_eliminacion` AS `fecha_eliminacion`, \
            `cfg_entidad`.`identidad` AS `identidad_productor`, \
            `cfg_entidad`.`codigo_entidad` AS `cod_productor`, \
            `cfg_entidad`.`razon_social` AS `productor`, \
            `cfg_predio`.`identidad` AS `identidad`, \
            `cfg_predio`.`descripcion` AS `desc_predio`, \
            `cfg_predio`.`cod_predio` AS `cod_predio`, \
            `cfg_predio`.`cod_predio`|| \
                ' - '|| \
                `cfg_predio`.`descripcion` AS `desc_predio_full`, \
            `prod_recepcion`.`activo` AS `activo`, \
            `cfg_especie`.`cod_especie` AS `cod_especie`, \
            `cfg_especie`.`descripcion` AS `desc_especie`, \
            \ `cfg_especie`.`cod_especie`|| \
                ' - '|| \
            `cfg_especie`.`descripcion` AS `desc_espe_full`, \
            `prod_recepcion`.`calidad_aplicada` AS `calidad_aplicada` \
        FROM \
        (((`prod_recepcion` \
        JOIN `cfg_predio` ON ((`cfg_predio`.`idpredio` = `prod_recepcion`.`idpredio`))) \
        JOIN `cfg_especie` ON ((`cfg_especie`.`idespecie` = `prod_recepcion`.`idespecie`))) \
        JOIN `cfg_entidad` ON ((`cfg_entidad`.`identidad` = `cfg_predio`.`identidad`)))) as prod_v_recepcion ";

        query.prod_v_recepcion_detalle = "SELECT * FROM (SELECT  \
            `prod_recepcion_detalle`.`idrecepcion_detalle` AS `idrecepcion_detalle`, \
            `prod_recepcion_detalle`.`idrecepcion` AS `idrecepcion`, \
            `prod_recepcion_detalle`.`lote` AS `lote`, \
            `prod_recepcion_detalle`.`idarticulo` AS `idarticulo`, \
            `prod_recepcion_detalle`.`idcalibre` AS `idcalibre`, \
            `prod_recepcion_detalle`.`idcuartel` AS `idcuartel`, \
            `prod_recepcion_detalle`.`idvariedad` AS `idvariedad`, \
            `prod_recepcion_detalle`.`fecha_cosecha` AS `fecha_cosecha`, \
            `prod_recepcion_detalle`.`fecha_embalaje` AS `fecha_embalaje`, \
            `prod_recepcion_detalle`.`cant_cajas` AS `cant_cajas`, \
            `prod_recepcion_detalle`.`kilos_brutos` AS `kilos_brutos`, \
            `prod_recepcion_detalle`.`kilos_netos` AS `kilos_netos`, \
            `prod_recepcion_detalle`.`idarticulo_envase` AS `idarticulo_envase`, \
            `prod_recepcion_detalle`.`idcreador` AS `idcreador`, \
            `prod_recepcion_detalle`.`idmodificador` AS `idmodificador`, \
            `prod_recepcion_detalle`.`ideliminador` AS `ideliminador`, \
            `prod_recepcion_detalle`.`fecha_creacion` AS `fecha_creacion`, \
            `prod_recepcion_detalle`.`fecha_edicion` AS `fecha_edicion`, \
            `prod_recepcion_detalle`.`fecha_eliminacion` AS `fecha_eliminacion`, \
            `prod_recepcion_detalle`.`activo` AS `activo`, \
            `prod_recepcion_detalle`.`cant_cajas_informadas` AS `cant_cajas_informadas`, \
            `prod_recepcion_detalle`.`kilos_brutos_informados` AS `kilos_brutos_informados`, \
            `prod_recepcion`.`guia` AS `guia`, \
            `prod_recepcion`.`fecha_guia_despacho` AS `fecha_guia_despacho`, \
            `cfg_entidad`.`identidad` AS `identidad`, \
            `cfg_entidad`.`productor` AS `productor`, \
            `cfg_entidad`.`codigo_entidad` AS `codigo_entidad`, \
            `inv_articulo`.`cod_articulo` AS `cod_articulo`, \
            `inv_articulo`.`descripcion` AS `desc_articulo`, \
            `envase`.`cod_articulo` AS `cod_envase`, \
            `envase`.`descripcion` AS `desc_envase`, \
            `cfg_calibre`.`cod_calibre` AS `cod_calibre`, \
            `cfg_calibre`.`descripcion` AS `desc_calibre`, \
            `cfg_cuartel`.`descripcion` AS `desc_cuartel`, \
            `cfg_variedad`.`variedad` AS `desc_variedad`, \
            `cfg_variedad`.`codigo` AS `cod_variedad`, \
            `cfg_especie`.`idespecie` AS `idespecie`, \
            `cfg_especie`.`cod_especie` AS `cod_especie`, \
            `cfg_especie`.`descripcion` AS `desc_especie`, \
            `prod_recepcion_detalle`.`calidad_aplicada` AS `calidad_aplicada`, \
            `prod_recepcion`.`idtemporada` AS `idtemporada`, \
            `prod_recepcion`.`tipo_recepcion` AS `tipo_recepcion`, \
            `cfg_entidad`.`codigo_entidad`|| \
                ' - '|| \
                `cfg_entidad`.`razon_social` AS `productor_full`, \
            `cfg_predio`.`cod_predio` AS `cod_predio`, \
            `cfg_predio`.`descripcion` AS `desc_predio`, \
            `prod_recepcion_detalle`.`temperatura` AS `temperatura`, \
            `prod_recepcion`.`idbodega` AS `idbodega`, \
            `prod_recepcion`.`fecha_recepcion` AS `fecha_recepcion` \
        FROM \
        (((((((((`prod_recepcion_detalle` \
        JOIN `prod_recepcion` ON ((`prod_recepcion`.`idrecepcion` = `prod_recepcion_detalle`.`idrecepcion`))) \
        JOIN `inv_articulo` ON ((`inv_articulo`.`idarticulo` = `prod_recepcion_detalle`.`idarticulo`))) \
        LEFT JOIN `inv_articulo` `envase` ON ((`envase`.`idarticulo` = `prod_recepcion_detalle`.`idarticulo_envase`))) \
        JOIN `cfg_calibre` ON ((`cfg_calibre`.`idcalibre` = `prod_recepcion_detalle`.`idcalibre`))) \
        JOIN `cfg_cuartel` ON ((`cfg_cuartel`.`idcuartel` = `prod_recepcion_detalle`.`idcuartel`))) \
        JOIN `cfg_variedad` ON ((`cfg_variedad`.`idvariedad` = `prod_recepcion_detalle`.`idvariedad`))) \
        JOIN `cfg_predio` ON ((`cfg_predio`.`idpredio` = `prod_recepcion`.`idpredio`))) \
        JOIN `cfg_entidad` ON ((`cfg_entidad`.`identidad` = `cfg_predio`.`identidad`))) \
        JOIN `cfg_especie` ON ((`cfg_especie`.`idespecie` = `cfg_variedad`.`idespecie`))) \
        ) as prod_v_recepcion_detalle";
        return query[name];
    }

}