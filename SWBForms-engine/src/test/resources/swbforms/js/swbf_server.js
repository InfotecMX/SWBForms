
var swbf = {    
    dataStores:{},                      //DataStores
    dataSources: {},                    //Datasources
    fieldProcesors:{},                  //Procesadores de field elements
    validators:{},                      //Validator templates
    dataServices:{},                    //Servicios
    dataProcessors:{},                  //DataProcessors
    
    getDataSource:function(name){
        return sengine.getDataSource(name);
    },                        
};

swbf.dataStores["mongodb"]={
    host:"localhost",
    port:27017,
    class: "org.semanticwb.forms.datastore.DataStoreMongo",
};








