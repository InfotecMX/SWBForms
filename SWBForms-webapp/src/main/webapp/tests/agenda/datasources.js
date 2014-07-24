/*
validators:[{type:"integerRange", min:1, max:20}]
validators:[{type:"regexp", expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"No es un correo electrónico válido"}]
validators:[{type:"regexp", expression:"^\\d{5}(-\\d{4})?$", errorMessage:"Zip Codes should be in the format ##### or #####-####."}]
validators:[{type:"mask", mask:"^\\s*(1?)\\s*\\(?\\s*(\\d{3})\\s*\\)?\\s*-?\\s*(\\d{3})\\s*-?\\s*(\\d{4})\\s*$",transformTo:"$1($2) $3 - $4"}]
validators:[{type:"matchesField", otherField:"password", errorMessage:"Passwords do not match"}]
validators:[{type:"custom", condition:"return value == true", errorMessage:"You must accept the terms of use to continue"}]


//related
    fields: [
        {name:"categoryName", title:"Category", editorType:"select", 
         optionDataSource:"supplyCategory", changed:"form.clearValue('itemName');" 
        },
        {name: "itemName", title:"Item", editorType: "select", 
         optionDataSource:"supplyItem", 
         getPickListFilterCriteria : function () {
            var category = this.form.getValue("categoryName");
            return {category:category};
         }
        }

*/
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
swbf.dataSources["Estados"] = {
    scls: "Estados",
    modelid: "Agenda",
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "clave", title: "Clave", required: true, type: "string"},
        {name: "municipio", title: "Municipio", type: "string"},
    ]
};

swbf.dataSources["Direccion"] = {
    scls: "Direccion",
    modelid: "Agenda",
    displayField: "calle",
    fields: [
        {name: "calle", title: "Calle", required: true, type: "string"},
        {name: "colonia", title: "Colonia", type: "string"},
        {name: "cp", title: "CP", type: "integer"},
        {name: "estado", title: "Estado", stype:"select", dataSource:"Estados"}
    ],
    links: [
        //{name: "estados2", title:"Estado", type:"subForm", dataSource:"Estados"}
    ]    
};

swbf.dataSources["Sexo"] = {
    scls: "Sexo",
    modelid: "Agenda",
    displayField: "nombre",
    textMatchStyle:"substring",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "descripcion", title: "Descripcion", type: "string"},
    ]
};

swbf.dataSources["Religiones"] = {
    scls: "Religiones",
    modelid: "Agenda",
    displayField: "nombre",
    textMatchStyle:"substring",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "descripcion", title: "Descripcion", type: "string"},
    ]
};

swbf.dataSources["Agenda"] = {
    scls: "Agenda",
    modelid: "Agenda",
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "telefono", title: "Telefono", type: "string"},
        {name: "email", title: "Correo Electrónico", type: "string", validators:[{type:"regexp",expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"No es un correo electrónico válido"}]},
        {name: "edad", title: "Edad", type: "int" ,validators:[{type:"integerRange", min:0, max:150,errorMessage:"NO MANCHES"}]},
        {name: "nacimiento", title: "Fecha de Nacimiento", type: "date"},
        {name: "sexo", title: "Sexo", stype:"select", dataSource:"Sexo"},
        {name: "religion", title: "Religion", stype:"select", dataSource:"Religiones"},
        {name: "direcciones", title:"Direcciones", stype:"grid", dataSource:"Direccion"}
    ],
    links: [
        //{name: "direccion", title:"Dirección", stype:"subForm", dataSource:"Direccion"}
    ]
};


swbf.dataSources["Autor"] = {
    scls: "Autor",
    modelid: "Agenda",
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "institucion", title: "Institucion", type: "string"},
        {name: "email", title: "Correo Electrónico", type: "string", validators:[{type:"regexp",expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"No es un correo electrónico válido"}]},
        {name: "edad", title: "Edad", type: "int" ,validators:[{type:"integerRange", min:0, max:150,errorMessage:"NO MANCHES"}]},
        {name: "nacimiento", title: "Fecha de Nacimiento", type: "date"},
        {name: "sexo", title: "Sexo", stype:"select", dataSource:"Sexo"},
        {name: "religion", title: "Religion", stype:"select", dataSource:"Religiones"},
        //{name: "direcciones", title:"Direcciones", width:"800", height:"50", startRow:true, type:"GridEditorItem", dataSource:"Direccion", winEdit:false}        
    ],
    links: [
    //    {name: "direccion", title:"Dirección", stype:"subForm", dataSource:"Direccion"}
    ]
};


swbf.dataSources["Articulos"] = {
    scls: "Articulos",
    modelid: "Agenda",
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "lugar", title: "Lugar", type: "string"},
        {name: "autor", title: "Autor", stype: "select", multiple:true, dataSource:"Autor"},
        {name: "fecha", title: "Fecha", type: "date"},
    ],
    links: [
    //    {name: "direccion", title:"Dirección", stype:"subForm", dataSource:"Direccion"}
    ]
};

swbf.dataSources["Articulos2"] = {
    scls: "Articulos",
    modelid: "Agenda",
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "lugar", title: "Lugar", type: "string"},
        {name: "autor", title: "Autor", stype: "select", multiple:true, dataSource:"Autor"},
        {name: "fecha", title: "Fecha", type: "date"},
    ],
    links: [
    //    {name: "direccion", title:"Dirección", stype:"subForm", dataSource:"Direccion"}
    ]
};






