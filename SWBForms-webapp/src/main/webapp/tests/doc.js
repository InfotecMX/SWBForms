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
stype: grid, select

//Definir un datasource
swbf.dataSources["ReportesVIN"] = {
    scls: "ReportesVIN",
    modelid: "VINDB",
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