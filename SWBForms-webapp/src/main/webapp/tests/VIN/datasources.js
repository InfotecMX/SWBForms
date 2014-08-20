//En swblang.js
//swbf.validators["email"] = {type:"regexp", expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"No es un correo electrónico válido"};

//swbf.dataStores["mongodb"].host="localhost";

swbf.userRepository={
    authModule:"swbforms",
    dataStore:"mongodb",
    modelid:"UserRep",
};

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
                    print("user:"+this.getUser());
                    //print(this.getDataSource("Pais").fetch().response.data[0].nombre);
                    return value=="jei 3";
                },
                errorMessage:"Error desde el servidor, el valor debe de ser jei 3"
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
        {name: "auto", newline:true, title: "Automovil", required: true, type: "select" , multiple:true, valueMap:{1:"Audi",2:"Chevrolet",3:"Chrysler"} },
        
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
        {name: "habitantes", title: "Habitantes", required: false, type: "int", validators: [                
            {type:"integerRange", min:1000, max:100000000},            
/**            
            {
                type:"serverCustom", 
                serverCondition:function(name,value,request){
                    print("request:"+request.data.nombre.length());
                    if(value==(request.data.nombre.length()*1000))return true;
                    //if(value>0 && (value%2)==0)return true;
                    return false;
                },
                errorMessage:"El valor debe de ser par..."
            }                
*/                
        ]},
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

swbf.dataSources["Minuta"] = {
    scls: "Minuta",
    modelid: "VINDB",
    dataStore: "mongodb",    
    displayField: "nombre",
    fields: [
        {name: "cliente", title: "Cliente", required: true, type: "string"},
        {name: "proyecto", title: "Proyecto", required: true, type: "string"},
        {name: "lugar", title: "Lugar", required: true, type: "string"},
        {name: "responsable", title: "Responsable de Proyecto", required: true, type: "string"},
        {name: "participantes", title: "participantes", required: true, stype: "select" , multiple:true, dataSource:"Personal"},
        
    ]
};

//*************************************** server ************************//

swbf.dataServices["PaisService"] = {
    dataSources: ["Pais"],
    actions:["add","remove","update"],
    service: function(request, response, dataSource, action)
    {
        //print("request:"+request);
        //print("response:"+response);
        print("user:"+this.user._id);
        print(this.getDataSource("Pais").fetchObjById("_suri:VINDB:Pais:53ca73153004aec988f550e2").nombre);
        //print(this.getDataSource("Pais").fetch("{data:{abre : 'MX'}}"));
        //print(this.getDataSource("Pais").fetch());
        //print(this.getDataSource("Pais").fetch().response.data[0].nombre);
    }
};

swbf.dataProcessors["PaisProcessor"] = {
    dataSources: ["Pais"],
    actions:["add","update"],
    request: function(request, dataSource, action)
    {
        print("action:"+action);
        print("request1:"+request);
        //print("user:"+this.getUser());
        //request.data.created=new java.util.Date();
        if(request.data.nombre)
        {
            request.data.habitantes=request.data.nombre.length()*1000+request.data.habitantes;
        }else if(request.oldValues.nombre)
        {
            request.data.habitantes=request.oldValues.nombre.length()*1000+request.data.habitantes;
        }
            
        print("request2:"+request);
        return request;
    },
    response: function(response, dataSource, action)
    {
        print("response:"+response);
        //print("user:"+this.getUser());
        print(response.response.data.created);
        return response;
    }
};
