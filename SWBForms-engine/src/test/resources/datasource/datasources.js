//En swblang.js
//swbf.validators["email"] = {type:"regexp", expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"No es un correo electrónico válido"};


swbf.dataSources["ReportesVIN"] = {
    scls: "ReportesVIN",
    modelid: "VINDB",
    displayField: "titulo",
    fields: [
        {name: "titulo", title: "Título", required: true, type: "string"},
        {name: "area", title: "Area", required: true, type: "string"},
        {name: "fecha", title: "Fecha", type: "date"},
        {name: "autor", title: "Autor", stype: "select", width_:300, selectWidth:300, displayFormat: "value+' ('+record.lugarNacimiento+')'",
            displayFormat_:function(value, record){
                return record.nombre+" ("+record.lugarNacimiento+")";
            }, 
            canFilter:false, selectFields:[{name:"nombre"},{name:"lugarNacimiento"}], showFilter:true, dataSource:"Personal"},
        {name: "revisor", title: "Revisor", stype: "select", dataSource:"Personal"},
        {name: "direccion", title:"Dirección", stype:"grid", dataSource:"Direccion", width_:"90%", winEdit:{title:"Dirección"}}
    ],
    links: [
        {name: "direccion1", title:"Dirección 1", stype:"tab", dataSource:"Direccion"},
        {name: "direccion2", title:"Dirección 2", stype:"subForm", dataSource:"Direccion"},
    ]
}; 


swbf.dataSources["Personal"] = {
    scls: "Personal",
    modelid: "VINDB",
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "email", title: "Email", required: true, type: "string", validators: [{stype:"email"}]},
        {name: "nacimiento", title: "Fecha de nacimiento", type: "date"},
        {name: "lugarNacimiento", title: "Lugar de nacimiento", type: "string"},
        {name: "otro", title:"Otro Campo", type:"string"}, 
        {name: "direccion", title: "Dirección", stype: "select", dataSource:"Direccion"},
    ],
    links: [
        //{name: "direccion", title:"Dirección", stype:"subForm", dataSource:"Direccion"}
    ]               
};


swbf.dataSources["Direccion"] = {
    scls: "Direccion",
    modelid: "VINDB",
    displayField: "calle",
    fields: [
        {name: "calle", title: "Calle", required: true, type: "string"},
        {name: "numero", title: "Numero", type: "string"},
        {name: "colonia", title: "Colonia", type: "string"},
        {name: "municipio", title: "Municipio", type: "string"},
        {name: "cp", title: "CP", type: "int", validators_:[{stype:"zipcode"}]},
        {name: "pais", title: "Pais", required: true, stype: "select", dataSource:"Pais", dependentSelect_:"estado", dependentSelect: {filterProp:"pais", dependentField:"estado"}},
        {name: "estado", title: "Estado", required: true, stype: "select", dataSource:"Estado", canFilter:false, filterCriteria_ : {} },
    ]
};



swbf.dataSources["Pais"] = {
    scls: "Pais",
    modelid: "VINDB",
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Pais", required: true, type: "string"},
        {name: "abre", title: "Abre", required: true, type: "string"},
    ]
};

swbf.dataSources["Estado"] = {
    scls: "Estado",
    modelid: "VINDB",
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Estado", required: true, type: "string"},
        {name: "pais", title: "Pais", required: true, stype: "select", dataSource:"Pais"},
    ]
};

//*************************************** server ************************//

swbf.dataServices["PaisService"] = {
    dataSources: ["Pais"],
    actions:["add","remove","update"],
    service: function(request, response, user)
    {
        print("request:"+request);
        print("response:"+response);
        print("user:"+user);
        print(swbf.getDataSource("Pais").fetch().response.status);
        //print(request.data+" "+response.data+" "+user);
    }
};