//En swblang.js
//swbf.validators["email"] = {type:"regexp", expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"No es un correo electrónico válido"};
var _radioVals={1:"Mal / Nunca",2:"Regular / Algunas Veces",3:"Bien / Casi Siempre",4:"Muy Bien / Siempre"};

swbf.dataSources["ParamDiag"] = {
    scls: "ParamDiag",
    modelid: "IMICAM",
    displayField: "nombreEmpresa",
    fields: [
        {name: "nombreEmpresario", title: "Nombre Empreario", required: true, type: "string"},
        {name: "nombreEmpresa", newline:true, title: "Nombre Empresa", required: true, type: "string"},
        {name: "rfc", title: "RFC", required: true, type: "string"},
        {name: "email", title: "Correo Electrónico", required: true, type: "string"},
        {name: "telefono", title: "Telefono", type: "string"},
        {name: "1_1_1", title:"1.Cuenta con una buena iluminación exterior", type:"radioGroup", valueMap:[1,2,3,4], vertical: false,},
        {name: "1_1_2", title:"2.La Iluminación interior está bien diseñada", type:"radioGroup", valueMap:[1,2,3,4], vertical: false,},        
    ],
    links: [
    ]
}; 


