

var swbf = {    
    dataStores:{},                      //DataStores
    dataSources: {},                    //Datasources
    fieldProcesors:{},                  //Procesadores de field elements
    validators:{},                      //Validator templates
    dataServices:{},                    //Servicios
    dataProcessors:{},                  //DataProcessors
    authModules:{},                     //Modulos de autenticación    
    userRepository:{},                  //User Repository
};

swbf.dataStores["mongodb"]={
    host:"localhost",
    port:27017,
    class: "org.semanticwb.forms.datastore.DataStoreMongo",
    
};

swbf.authModules["swbforms"]={
    class: "org.semanticwb.forms.authentication.SWBBaseAuthModule",
    oauth:{
        type:"github",
        client_id:"3dd2f9c2ebb30b2ba18c",
        scope: "user:email,user:follow",
        login: "https://github.com/login/oauth/authorize?scope={scope}&client_id={client_id}",
    },
    dataSources:{
        SWBUser:{
            scls: "SWBUser",
            //modelid: "VINDB",
            //dataStore: "mongodb",    
            displayField: "login",
            fields: [
                {name: "login", title: "Usuario", required: true, type: "string"},
                {name: "password", title: "Contraseña", required: true, type: "string"},
                {name: "name", title: "Nombre", required: true, type: "string"},
                {name: "lastName", title: "Apellidos", required: true, type: "string"},
                {name: "email", title: "Correo Electónico", required: false, type: "string"},
            ]
        },
        SWBRole:{
            scls: "SWBRole",
            //modelid: "VINDB",
            //dataStore: "mongodb",    
            displayField: "name",
            fields: [
                {name: "name", title: "Nombre", required: true, type: "string"},
                {name: "description", title: "Descripcion", required: false, type: "string"},
            ]
        },
        SWBUserGroup:{
            scls: "SWBUserGroup",
            //modelid: "VINDB",
            //dataStore: "mongodb",    
            displayField: "name",
            fields: [
                {name: "name", title: "Nombre", required: true, type: "string"},
                {name: "description", title: "Descripcion", required: false, type: "string"},
            ]
        },
    },
    dataServices:{},
    dataProcessors:{},
};








