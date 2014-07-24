

swbf.dataSources["Empleados"] = {
    scls: "Empleados",
    modelid: "DAC",
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "direccion", title: "Direccion", type: "string"},
        {name: "telefono", title: "Telefono", type: "string"},
        {name: "area", title: "Area", stype: "select", dataSource:"Area"},
    ]
};

swbf.dataSources["Area"] = {
    scls: "Area",
    modelid: "DAC",
    displayField: "abre",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "descripcion", title: "Descripcion", type: "string"},
        {name: "abre", title: "Abrebiación", type: "string"},
    ]
};

