/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
swbf.validators["email"] = {type:"regexp", expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"No es un correo electrónico válido"};
swbf.validators["zipcode"] = {type:"regexp", expression:"^\\d{5}(-\\d{4})?$", errorMessage:"El codigo postal debe tener el formato ##### o #####-####."};


swbf.fieldProcesors["select"] = function(field)
{
    var base = swbf.cloneObject(field);

    var dsObjDef = swbf.getDataSourceObjDef(swbf.removeAttribute(base, "dataSource"));
    var ds = swbf.createDataSource(dsObjDef);

    if (!base.editorType)
    {
        if(base.displayFormat)
        {
            base.editorType = "SelectItem";
        }
        else if (base.canFilter != undefined)
        {
            if (base.canFilter === true)
            {
                base.editorType = "ComboBoxItem";
            } else
            {
                base.editorType = "SelectItem";
            }
            swbf.removeAttribute(base, "canFilter");
        } else
        {
            base.editorType = "ComboBoxItem";
        }
    }

    //base.displayField = "_" + base.name;
    //base.foreignKey = dsObjDef.dsId + "._id";
    //***** nueva propiedad *********// diaplayName
    //base.editorProperties = {optionDataSource: dsObjDef.dsId, valueField: "_id", displayField: ds.displayField};
    base.valueField= "_id";
    
    base.displayField= ds.displayField;
    if(base.displayFormat)
    {
        base.formatValue= function (value, baserecord, form, item) 
        {   
            var record = item.getSelectedRecord();
            if (record) {
                //console.log(selectedRecord);
                if("function" == typeof base.displayFormat)
                {
                    return base.displayFormat(value, record);
                }else
                {
                    return eval(base.displayFormat);
                }
            } else {
               return value;
            }
        };        
    }
    
    //swbf.removeAttribute(base, "displayFormat");
    
    base.optionDataSource= dsObjDef.dsId;
    base.editorProperties = {displayField: ds.displayField};

    if (base.showFilter)
    {
        base.pickListProperties = {
            showFilterEditor: swbf.removeAttribute(base, "showFilter")
        };
    }

    //Campos a mostrar en el despliegue del select (en forma de grid dentro del combo)
    if (base.selectFields)
    {
        base.pickListFields = swbf.removeAttribute(base, "selectFields");
    }

    //Tamaño del select una vez desplegado
    if (base.selectWidth)
    {
        base.pickListWidth = swbf.removeAttribute(base, "selectWidth");
    }
    
    //Filtrar el resultado del select for un criterio inicial estatico
    if(base.filterCriteria)
    {
        base.optionCriteria = swbf.removeAttribute(base, "filterCriteria");
    }
    
//    if(base.dependentSelect)
//    {
//        if(!base.editorProperties)base.editorProperties={};        
//        base.editorProperties.getPickListFilterCriteria = function (p1, p2, p3) 
//        {
//            var ret={};
//            var criterion=this.getCriterion();
//            if(criterion && criterion.operator!="equals")
//            {
//                ret[this.getCriteriaFieldName()]=this.getCriteriaValue();
//            }
//            
//            var field=this.form.getField(base.dependentSelect.dependentField);
//            if(field)
//            {
//                var value=field.getValue();
//                var prop=base.dependentSelect.filterProp;  
//                if(!prop) //si no se define una propiedad se busca la que tenga el mismo DS
//                {
//                    var fieldDS=field.getOptionDataSource().ID;
//                    
//                    for (var attr in this.getOptionDataSource().fields) 
//                    {
//                        var ds=this.getOptionDataSource().fields[attr].optionDataSource;
//                        if(ds==fieldDS)
//                        {
//                            prop=this.getOptionDataSource().fields[attr].name;
//                        }
//                    }                    
//                }
//                if(prop)
//                {
//                    ret[prop]=value;
//                }
//            }
//            return ret;
//        };   
//    }
    
    if(base.dependentSelect)
    {
        var fname=base.dependentSelect;
        var pname=undefined;
        //si recibe un objeto con los parametros dependentField, filterProp en lugar de un string con el valor por default de dependentField
        if("object" == typeof fname) 
        {
            fname=base.dependentSelect.dependentField;
            pname=base.dependentSelect.filterProp;
        }
        
        base.changed=function(form,item,value)
        {
            var ret={};
            var field=form.getField(fname);
            field.setValue(null);
            if(!pname) //si no se define una propiedad se busca la que tenga el mismo DS
            {
                for (var attr in field.getOptionDataSource().fields) 
                {
                    var ds=field.getOptionDataSource().fields[attr].optionDataSource;
                    if(ds==item.optionDataSource)
                    {
                        pname=field.getOptionDataSource().fields[attr].name;
                    }
                }    
            }
            ret[pname]=value;
            field.optionCriteria=ret;
        }
        
        base.formatEditorValue=function(value,record,form,item,grid)
        {
            if(value && !grid)
            {
                var field=form.getField(fname);
                if(field && !field.optionCriteria)
                {
                    var ret={};
                    if(!pname) //si no se define una propiedad se busca la que tenga el mismo DS
                    {
                        for (var attr in field.getOptionDataSource().fields) 
                        {
                            var ds=field.getOptionDataSource().fields[attr].optionDataSource;
                            if(ds && ds==item.optionDataSource)
                            {
                                pname=attr;
                            }
                        }    
                    }
                    ret[pname]=value;
                    field.optionCriteria=ret;            
                }
            }else if(grid)
            {
                var field=grid.getField(fname);
                if(field && form!=field._lastFilterCriterial)
                {
                    field._lastFilterCriterial=form;
                    var ret={};
                    if(!pname) //si no se define una propiedad se busca la que tenga el mismo DS
                    {
                        var dsf=DataSource.get(field.optionDataSource).fields;
                        for (var attr in dsf) 
                        {
                            var ds=dsf[attr].optionDataSource;
                            if(ds && ds==grid.getCellField(form,item).optionDataSource)
                            {
                                pname=attr;
                            }
                        }    
                    }
                    ret[pname]=value;
                    field.optionCriteria=ret;            
                }
            }
            return value;
        }
    }    

    return base;
};

swbf.fieldProcesors["grid"] = function(field)
{
    var base = swbf.cloneObject(field);

    if (!base.editorType)
        base.editorType = "GridEditorItem";
    if (!base.width)
        base.width = "85%";
    if (!base.height)
        base.height = "65";
    if (!base.startRow)
        base.startRow = true;
    return base;
};

//FieldItems

//*********** GridEditor ****************************************
isc.ClassFactory.defineClass("GridEditor", isc.VLayout);

isc.GridEditor.addProperties({
    membersMargin: 5,
    //winEdit: false,
    canEdit: true,
    readOnly: false,
    initWidget: function()
    {
        if (!this.canEdit)
        {
            this.canEdit = true;
        }

        if (this.winEdit)
        {
            this.canEdit = false;
        }

        var gridDS = swbf.createDataSource(this.dataSource);

        var totalsLabel = isc.Label.create({
            padding: 5,
            ID: "totalsLabel"
        });

        var toolStrip = isc.ToolStrip.create({
            width: "100%",
            height: 24,
            members: [
                totalsLabel,
                isc.LayoutSpacer.create({
                    width: "*"
                }),
                isc.ToolStripButton.create({
                    icon: "[SKIN]/actions/add.png",
                    prompt: "Agregar nuevo registro",
                    click: function() {
                        //console.log(this);
                        if (this.parentElement.parentElement.winEdit)
                        {
                            var field=this.parentElement.parentElement.parentElement;
                            //if(!field.winEdit.fields)field.winEdit.fields=swbf.filterFields(field.originalFields);
                            //if(!field.winEdit.title)field.winEdit.fields=field.title;
                            var win=swbf.editWindowForm(field.winEdit,null,field.dataSource);
                            if (win.form != null)
                            {
                                win.form.fromGrid = this.parentElement.parentElement;
                            }
                        } else
                        {
                            this.parentElement.parentElement.startEditingNew();
                        }
                    }
                }),
                isc.ToolStripButton.create({
                    icon: "[SKIN]/actions/edit.png",
                    prompt: "Edit registro seleccionado",
                    click: function() {
                        if (this.parentElement.parentElement.winEdit)
                        {
                            var record = this.parentElement.parentElement.getSelectedRecord();
                            var field=this.parentElement.parentElement.parentElement;
                            //if(!field.winEdit.fields)field.winEdit.fields=swbf.filterFields(field.originalFields);
                            //if(!field.winEdit.title)field.winEdit.fields=field.title;
                            var win=swbf.editWindowForm(field.winEdit,record._id,field.dataSource);
                            if (win.form != null)
                            {
                                win.form.fromGrid = this.parentElement.parentElement;
                            }
                        } else
                        {
                            var record = this.parentElement.parentElement.getSelectedRecord();
                            if (record == null)
                                return;
                            this.parentElement.parentElement.startEditing(this.parentElement.parentElement.data.indexOf(record));
                        }
                    }
                }),
                isc.ToolStripButton.create({
                    icon: "[SKIN]/actions/remove.png",
                    prompt: "Eliminar registro seleccionado",
                    click: function() {
                        var records = this.parentElement.parentElement.getSelection();
                        if (records == null)
                            return;

                        for (var i = records.length; i--; )
                        {
                            var record = records[i];
                            this.parentElement.parentElement.markRecordRemoved(this.parentElement.parentElement.data.indexOf(record));
                        }
                        //this.parentElement.parentElement.removeSelectedData();
                    }
                })
            ]
        });

        this.grid = isc.ListGrid.create({
            //autoDraw:false,
            width: this.width,
            height: this.height,
            readOnly: this.readOnly,
            // fill the space the form allocates to the item
            //leaveScrollbarGaps:false,
            alternateRecordStyles: true,
            // dataSource and fields to use, provided to a listGridItem as
            // listGridItem.gridDataSource and optional fields
            dataSource: gridDS,
            fields: this.fields,
            sortField: this.gridSortField,
            // the record being edited is assumed to have a set of subrecords
            //data:this.getValue(),
            canEdit: this.canEdit,
            winEdit: this.winEdit,
            autoSaveEdits: false,
            //modalEditing:true,
            //autoFetchData:true,                
            canRemoveRecords: true,
            gridComponents: ["header", "body", toolStrip],
            autoFitData: "vertical",
            autoFitMaxRecords: 5,
            recordDoubleClick: function(pgrid, record)
            {
                if (this.parentElement.winEdit)
                {
                    var field=this.parentElement;
                    //if(!field.winEdit.fields)field.winEdit.fields=swbf.filterFields(field.originalFields);
                    //if(!field.winEdit.title)field.winEdit.fields=field.title;
                    var win=swbf.editWindowForm(field.winEdit,record._id,field.dataSource);
                    if (win.form != null)
                    {
                        win.form.fromGrid = this.parentElement.grid;
                    }                    
                }
            },
            dataChanged: function()
            {
                this.Super("dataChanged", arguments);
                var totalRows = this.data.getLength();
                if (totalRows > 0 && this.data.lengthIsKnown()) {
                    totalsLabel.setContents(totalRows + " Registros");
                } else {
                    totalsLabel.setContents("&nbsp;");
                }
            }
        });

        this.addMember(this.grid);
        this.addMember(this.button);
    },
    setForm: function(form, prop)
    {
        //alert(form+"-"+this.form);
        if (!this.form)
        {
            this.form = form;
        }
        this.prop = prop;
        swbf.linkFormGrid(this.form, this.grid);
    },
    validate: function()
    {
        this.grid.endEditing();
        //validar nuevos registros borrados
        for (i = 0; i < this.grid.getAllEditRows().length; i++)
        {
            var earr = this.grid.getAllEditRows();
            if (this.grid.recordMarkedAsRemoved(earr[i]) == true && this.grid.getRecord(earr[i]) == null)
            {
                this.grid.discardEdits(earr[i])
                i--;
            }
        }

        var earr = this.grid.getAllEditRows();
        for (i = 0; i < earr.length; i++)
        {
            if (this.grid.recordMarkedAsRemoved(earr[i]) == false && this.grid.validateRow(earr[i]) == false)
            {
                var err = this.grid.getRowValidationErrors(earr[i]);
                err.form = this.grid;
                swbf.validates.errors.push(err);
                return false;
            }
        }
        return true;
    },
    showValue: function(dataValue)
    {
        //alert("showValue:"+dataValue);
        if (this.grid.invalidate == false && this.dataValue && dataValue && this.dataValue.toString() == dataValue.toString())
            return; //comparar si cambio o no el contenido

        if (dataValue && dataValue != null)
        {
            this.dataValue = dataValue;
            this.grid.invalidateCache();
            this.grid.invalidate = false;  //bandera para recargar cache
            this.grid.fetchData({
                _id: dataValue
            },
            function(dsResponse, data, dsRequest)
            {
                var grid = isc.eval(dsRequest.componentId);
                for (i = 0; i < data.length; i++)
                {
                    if (data[i]._id.endsWith("_biz"))
                    {
                        grid.data.localData[i] = {
                            _id: data[i]._id
                        };
                        grid.setEditValues(i, data[i]);
                    }
                }
            });
        } else
        {

        }
    }

});



//*********** GridEditorItem ***********************************
isc.ClassFactory.defineClass("GridEditorItem", "CanvasItem");

isc.GridEditorItem.addProperties({
    height: "*",
    width: "*",
    rowSpan: "*",
    colSpan: "*",
    endRow: true,
    startRow: true,
    //winEdit: false,
    readOnly: false,
    // this is going to be an editable data item
    shouldSaveValue: true,
    // Override createCanvas to create the ListGrid with the user can use to set the value.
    createCanvas: function()
    {
        var grid = isc.GridEditor.create({
            width: this.width,
            height: this.height,
            dataSource: this.dataSource,
            title:this.title,
            gridSortField: this.gridSortField,
            winEdit: this.winEdit,
            readOnly: this.readOnly,
            fields: this.fields,
            editProps: this.editProps
        });
        //alert(this);
        grid.setForm(this.form);
        //console.log(grid);
        return grid;
    },
    // update form when data changes
    /*
     cellChanged : function () {
     
     //this.parentElement.canvasItem.saveValue(this.data);
     
     if (this.parentElement.canvasItem.gridSortField != null) {
     this.sort(this.parentElement.canvasItem.gridSortField);
     }
     },
     */

    // implement showValue to update the ListGrid data
    // Note that in this case we care about the underlying data value - an array of records
    showValue: function(displayValue, dataValue)
    {
        //console.log("showValue:");
        //console.log(this);
        //console.log(displayValue);
        //console.log(dataValue);
        if (this.canvas == null)
        {
            return;
        }
        this.canvas.showValue(dataValue);
        //this.setWidth();
        //this.canvas.setWidth();
    }

});


/*
//*********** HRefItem ***********************************
isc.ClassFactory.defineClass("FileUpload", "CanvasItem");

isc.FileUpload.addProperties({
    text: "*",
    href: "*",
    width: "*",
    height: "15",
    padding: "*",
    urlPrefix: "?suri=",
    shouldSaveValue: true,
    // Implement 'createCanvas' to build a ListGrid from which the user may 
    // select items.
    createCanvas: function()
    {
        this.fileUpload = new LongFileUploader("/itzds/_fu_", "0", this.ID);
        this.fileUpload.canvas = this;

        this.fileUpload.finishFile = function(porEnviar)
        {
            document.getElementById(this.eleid + "_percentage").style.width = 100 + '%';
            document.getElementById(this.eleid + "_label").innerHTML = 100 + '%';
            var result = this.get(this.baseURL + "/eofcheck/" + porEnviar.id);
            if (result.saved == "true")
            {
                this.canvas.form.setValue(this.canvas.name, result.val);
                //alert("key:"+result.key);
                //alert("canvas:"+this.canvas);
            } else
                alert("Error al enviar el archivo...");
        }

        var content = "<input type=\"file\" name=\"updfile\" id=\"updfile\" onchange=\"" + this.ID + ".fileUpload.sendFile(this)\"/>" +
                "<div id=\"progressBar\" style=\"width:100%; height:15px; border:1px solid #000; overflow:hidden;\">" +
                "    <div id=\"" + this.ID + "_percentage\" style=\"width:0%; height:15px; border-right: 1px solid #000000; background: #0000ff;\"></div>" +
                "    <div id=\"" + this.ID + "_label\" style=\"color: #FFFFFF; font-size: 12px; left: 5px; position: relative; top: -15px;\">";
        content += "<span></span></div>";
        content += "</div>";

        var c = isc.HTMLFlow.create({
            width: this.width,
            height: this.height,
            padding: this.width,
            //overflow:"auto",
            canDragResize: false,
            showEdges: false
        });

        c.setContents(content);
        return c;

    },
    // implement showValue to update the ListGrid data
    // Note that in this case we care about the underlying data value - an array of records
    showValue: function(displayValue, dataValue)
    {
        if (this.canvas == null)
            return;

        var val = dataValue;
        if (val)
        {
            var i = val.indexOf("#p=");
            if (i > -1)
            {
                val = val.substring(0, i);
            }
        } else
            val = "";

        //if(this.canvas.contents.length<20)
        {
            var content = "<input type=\"file\" name=\"updfile\" id=\"updfile\" onchange=\"" + this.ID + ".fileUpload.sendFile(this)\"/>" +
                    "<div id=\"progressBar\" style=\"width:100%; height:15px; border:1px solid #000; overflow:hidden;\">" +
                    "    <div id=\"" + this.ID + "_percentage\" style=\"width:0%; height:15px; border-right: 1px solid #000000; background: #0000ff;\"></div>" +
                    "    <div id=\"" + this.ID + "_label\" style=\"color: #FFFFFF; font-size: 12px; left: 5px; position: relative; top: -15px;\">";


            var suri = this.form.values.suri;
            if (suri && suri != "[init]")
            {
                content += "<span><a target=\"_new\" href=\"/work/models/" + suri.replaceAll(":", "/") + "/" + val + "\">" + val + "</a></span></div>";
            } else
            {
                content += "<span>" + val + "</span></div>";
            }
            content += "</div>";
            if (val.length > 0)
            {
                content += "<span onClick=\"" + this.ID + ".form.setValue(" + this.ID + ".name,'')\" style=\"cursor: pointer; color: #FFFFFF; position: relative; left: 5px;\">(Eliminar)</span>";
            }
            this.canvas.setContents(content);
        }
    }
});
*/