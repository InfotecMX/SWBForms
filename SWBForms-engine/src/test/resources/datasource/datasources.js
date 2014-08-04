//En swblang.js
//swbf.validators["email"] = {type:"regexp", expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"No es un correo electrónico válido"};
swbf.dataStores["mongodb"].host="localhost";

swbf.dataSources["ReportesVIN"] = {
    scls: "ReportesVIN",
    modelid: "VINDB",
    dataStore: "mongodb",
    displayField: "titulo",
    fields: [
        {name: "titulo", title: "Título", required: true, type: "string", validators: [{type:"isUnique", errorMessage:"El valor debe de ser único.."}]},
        {name: "area", title: "Area", required: true, type: "string",validators: [
            {
                type:"serverCustom", 
                serverCondition:function(name,value,request){              
                    //print(swbf.getDataSource("Pais").fetch().response.data[0].nombre);
                    return value=="jei 2";
                },
                errorMessage:"Error desde el servidor, el valor debe de ser jei 2"
            }
        ]},
        {name: "fecha", title: "Fecha", type: "date"},
        {name: "autor", title: "Autor", stype: "select", multiple:true, width_:300, selectWidth:300, displayFormat: "value+' ('+record.lugarNacimiento+')'",
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
    ],
    security:{
        roles:{
            admin:["fetch","add","remove","update"],  //OR
            member:["fetch"],
        },        //and
        groups:{
            GDNPS:["fetch","add","remove","update"],
            DAC:["fetch"],
        },        
        users:[{sex:"male"}]    //OR
    }
}; 


swbf.dataSources["Personal"] = {
    scls: "Personal",
    modelid: "VINDB",
    dataStore: "mongodb",    
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



swbf.dataSources["Pais"] = {
    scls: "Pais",
    modelid: "VINDB",
    dataStore: "mongodb",    
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Pais", required: true, type: "string"},
        {name: "abre", title: "Abre", required: true, type: "string"},
    ]
};

swbf.dataSources["Estado"] = {
    scls: "Estado",
    modelid: "VINDB",
    dataStore: "mongodb",    
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
    service: function(request, response, user, dataSource, action)
    {
        print("request:"+request);
        print("response:"+response);
        print("user:"+user);
        print(swbf.getDataSource("Pais").fetch().response.data[0].nombre);
    }
};

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
        print(response.response.data.created);
        return response;
    }
};