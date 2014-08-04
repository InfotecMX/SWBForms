/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


//Scripts de para importar la libreria
/*
 * Scripts
        <script type="text/javascript" >var isomorphicDir = "/isomorphic/";</script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Core.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Foundation.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Containers.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Grids.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Forms.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_DataBinding.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Calendar.js" ></script>
        <script type="text/javascript" src="/isomorphic/skins/Enterprise/load_skin.js" ></script>
<!--        <script type="text/javascript" SRC="/isomorphic/locales/frameworkMessages_es.properties" ></script>-->

        <script type="text/javascript" src="/swbadmin/js/platform.js" ></script>
        <script type="text/javascript" src="datasources.js" ></script>
        <script type="text/javascript" src="/swbadmin/js/swblang.js" ></script>

 */


//Tipos de datos:
type: string, int, date, float, double, long
stype: grid, select, time

//data stores
swbf.dataStores["mongodb"]={
    host:"localhost",
    port:27017,
    class: "org.semanticwb.forms.datastore.DataStoreMongo",
};

//Definir un datasource
swbf.dataSources["ReportesVIN"] = {
    scls: "ReportesVIN",
    modelid: "VINDB",
    dataStore: "mongodb",      
    displayField: "titulo",
    fields: [
        {name: "titulo", title: "Título", required: true, type: "string"},
        {name: "cp", title: "CP", required: true, type: "int"},
        {name: "fecha", title: "Fecha", type: "date"},
        {name: "autor", title: "Autor", stype: "select", dataSource:"Personal"},
        {name: "direccion", title:"Dirección", stype:"grid", dataSource:"Direccion", winEdit:false}
    ],
    links: [
        {name: "direccion", title:"Dirección", stype:"subForm", dataSource:"Direccion"}
    ]               

};

//Crear un grid
swbf.createGrid({left:"-10", margin:"10px", width: "100%", height: 200}, "Personal");

swbf.createGrid(
{
    left:"-10", margin:"10px", width: "100%", height: 200,

    fields:[{name:"nombre"}],

    recordDoubleClick: function(grid, record)
    {
        window.location = "detail.jsp?dsName=ReportesVIN&_id=" + record._id;
        return false;
    },
    addButtonClick: function(event)
    {
        window.location = "detail.jsp?dsName=ReportesVIN";
        return false;
    },
    //initialCriteria:{estatusTienda:"527f0b780364321b91c89f9d"},

    autoFetchTextMatchStyle:"exact",                    
}, "ReportesVIN");

//Crear una Forma
swbf.createForm({title:"Forma", width: "99%", height:"70%"}, id, dataSource);                

swbf.createForm({title:"Forma", width: "99%", height:"70%", fields:[{name:"nombre"}]}, id, dataSource);                

swbf.createForm({title:"Forma", width: "99%", height: "70%",
    fields: [
        {name: "titulo"},
        {name: "area"},
        {name: "fecha"},
        {name: "autor"},
        {name: "revisor"},
        {name: "direccion", fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp"},
                //{name: "estado"},
            ]}
    ]
},id, dataSource);


swbf.createForm({title: "Forma", width: "99%", height: "70%",
    fields: [
        {name: "titulo"},
        {name: "area"},
        {name: "fecha"},
        {name: "autor"},
        {name: "revisor"},
        {name: "direccion", fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp", validators:[{type:"integerRange", min:5, max:15}]},
                //{name: "estado"},
            ]}
    ],
    links: [
        {name: "direccion2", fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp"},
                //{name: "estado"},
            ]}
    ]
},id, dataSource);


swbf.createForm({title: "Forma", width: "99%", height: "50%",

    fields: [
        {name: "titulo"},
        {name: "area"},
        {name: "fecha"},
        {name: "autor"},
        {name: "revisor"},
        {name: "direccion", winEdit:false,   //deshabilitar winEdit del padre
            fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp",validators:[{stype:"zipcode"}]},
                //{name: "estado"},
            ]
        }
    ]
                    
},id, dataSource);

swbf.createForm({title: "Forma", width: "99%", height: "50%",

    fields: [
        {name: "titulo"},
        {name: "area"},
        {name: "fecha"},
        {name: "autor"},
        {name: "revisor"},
        {name: "direccion", winEdit: {title:"Hola", //propiedades de la ventana
            fields: [
                {name: "calle"},
                {name: "numero"},
                //{name: "colonia"},
                {name: "municipio"},
                {name: "cp",validators:[{stype:"zipcode"}]},
                {name: "estado"},
            ]}, 
            fields: [                       //propiedades del grid
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp",validators:[{stype:"zipcode"}]},
                //{name: "estado"},
            ]
        }
    ]                    
},id, dataSource);



swbf.validators["email"] = {type:"regexp", expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"No es un correo electrónico válido"};
swbf.validators["zipcode"] = {type:"regexp", expression:"^\\d{5}(-\\d{4})?$", errorMessage:"El codigo postal debe tener el formato ##### o #####-####."};

/*
validators:[{type:"integerRange", min:1, max:20}]
validators:[{type:"regexp", expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"No es un correo electrónico válido"}]
validators:[{type:"regexp", expression:"^\\d{5}(-\\d{4})?$", errorMessage:"Zip Codes should be in the format ##### or #####-####."}]
validators:[{type:"mask", mask:"^\\s*(1?)\\s*\\(?\\s*(\\d{3})\\s*\\)?\\s*-?\\s*(\\d{3})\\s*-?\\s*(\\d{4})\\s*$",transformTo:"$1($2) $3 - $4"}]
validators:[{type:"matchesField", otherField:"password", errorMessage:"Passwords do not match"}]
validators:[{type:"custom", condition:"return value == true", errorMessage:"You must accept the terms of use to continue"}]
validators:[{type:"regexp", expression:"^\\d{5}(-\\d{4})?$", errorMessage:"Zip Codes should be in the format ##### or #####-####."}]
*/



//*************************************** server ************************//

//dataService
swbf.dataServices["PaisService"] = {
    dataSources: ["Pais"],
    actions:["add","remove","update"],
    service: function(request, response, user, dataSource, action)
    {
        print("request:"+request);
        print("response:"+response);
        print("user:"+user);
        print(swbf.getDataSource("Pais").fetch().response.data[0].nombre);
    }
};

//dataProcessors
swbf.dataProcessors["PaisProcessor"] = {
    dataSources: ["Pais"],
    actions:["add","update"],
    request: function(request, user, dataSource, action)
    {
        print("request:"+request);
        print("user:"+user);
        request.data.created=new java.util.Date();
        return request;
    },
    response: function(response, user, dataSource, action)
    {
        print("response:"+response);
        print("user:"+user);
        print(request.data.created);
        return response;
    }
};



//serverCustom validators
swbf.dataSources["ReportesVIN"] = {
    scls: "ReportesVIN",
    modelid: "VINDB",
    displayField: "titulo",
    dataStore: "mongodb",      
    fields: [
        {name: "titulo", title: "Título", required: true, type: "string", validators: [{type:"isUnique"}]},  //validacion de unicidad del lado del servidor
        {name: "area", title: "Area", required: true, type: "string",validators: [
            {
                type:"serverCustom",                                    //serverCustom del lado del servidor
                serverCondition:function(name,value,request){                    
                    return value=="jei";
                },
                errorMessage:"Error desde el servidor, el valor debe de ser jei"
            }
        ]},
        {name: "fecha", title: "Fecha", type: "date"},
        {name: "autor", title: "Autor", stype: "select", width_:300, selectWidth:300, displayFormat: "value+' ('+record.lugarNacimiento+')'",
            displayFormat_:function(value, record){
                return record.nombre+" ("+record.lugarNacimiento+")";
            }, 
            canFilter:false, selectFields:[{name:"nombre"},{name:"lugarNacimiento"}], showFilter:true, dataSource:"Personal"},
        {name: "revisor", title: "Revisor", stype: "select", dataSource:"Personal"},
        {name: "direccion", title:"Dirección", stype:"grid", dataSource:"Direccion", width_:"90%", winEdit:{title:"Dirección"}},
    ],
    links: [
        {name: "direccion1", title:"Dirección 1", stype:"tab", dataSource:"Direccion"},
        {name: "direccion2", title:"Dirección 2", stype:"subForm", dataSource:"Direccion"},
    ]
}; 

//*****************************************************************//
//dependentSelect 

//dependentSelect:"estado"
// o
//dependentSelect: {filterProp:"pais", dependentField:"estado"}

swbf.dataSources["Direccion"] = {
    scls: "Direccion",
    modelid: "VINDB",
    dataStore: "mongodb",      
    displayField: "calle",
    fields: [
        {name: "calle", title: "Calle", required: true, type: "string"},
        {name: "numero", title: "Numero", type: "string"},
        {name: "colonia", title: "Colonia", type: "string"},
        {name: "municipio", title: "Municipio", type: "string"},
        {name: "cp", title: "CP", type: "int", validators_:[{stype:"zipcode"}]},
        {name: "pais", title: "Pais", required: true, stype: "select", dataSource:"Pais", dependentSelect:"estado", dependentSelect_: {filterProp:"pais", dependentField:"estado"}},
        {name: "estado", title: "Estado", required: true, stype: "select", dataSource:"Estado", canFilter:false, initialCriteria_ : {} },
    ]
};


//*****************************************************************//
//default values

swbf.createForm({title: "Forma", width: "99%", height: "50%",

    fields: [
        {name: "titulo"},
        {name: "area", canEdit:true},
        {name: "fecha"},
        {name: "autor"},
        {name: "revisor"},
        {name: "direccion", winEdit_: {title:"Hola",        //Propiedades de la ventana
            fields: [
                {name: "calle"},
                {name: "numero"},
                //{name: "colonia"},
                {name: "municipio"},
                {name: "cp",validators:[{stype:"zipcode", errorMessage:"hola error..."}]},
                {name: "pais"},
                {name: "estado"}
            ],
            values:{calle:"calle3"},                        //valores de la ventana
        }, winEdit:false,   //deshabilitar winEdit del padre
            fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp",validators:[{stype:"zipcode"}]},
                //{name: "estado"},
            ],
            values:[{calle:"calle1"},{calle:"calle2"}],     //valores de la propiedad, grid
        }
    ],

    values:{                                                //valores de la forma
        titulo:"Titulo por defecto",                        
    },

    links: [
        {name: "direccion1"},
        {name: "direccion2", fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp"},
                //{name: "estado"},
            ],
            values:{                                        //valores de objeto ligados
                calle:"Benito Juarez",
            }
        }
    ],


},null, "DataSourceName");


//*****************************************************************//
//initialCriteria
swbf.createGrid({left:"-10", margin:"10px", width: "100%", height: 200, initialCriteria:{abre:"MX"},}, "Pais");



//Botones

form.submitButton.setTitle("Enviar");


//Secciones en formas
[
{defaultValue:"1. MERCADOTECNIA", disabled:false, type:"section", sectionExpanded:true, itemIds: ["1","1_1", "1_2", "1_3", "1_4", "1_5","1_6"] },
{name: "1", defaultValue:"1.1 Modernizacion del punto de venta: (1:Mal / Nunca,  2:Regular / Algunas Veces,  3:Bien / Casi Siempre,  4:Muy Bien / Siempre)", type:"Header"},
]

