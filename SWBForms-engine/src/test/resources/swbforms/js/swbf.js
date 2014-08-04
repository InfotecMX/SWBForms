
var isomorphicDir = "/isomorphic/";

var swbf = {
    operationBindings: [
        {operationType: "fetch", dataProtocol: "postMessage"},
        {operationType: "add", dataProtocol: "postMessage"},
        {operationType: "update", dataProtocol: "postMessage"},
        {operationType: "remove", dataProtocol: "postMessage"},
        {operationType: "validate", dataProtocol: "postMessage"},
    ],
    dataStores:{},                      //DataStores
    dataSources: {},                    //Datasources
    fieldProcesors:{},                  //Procesadores de field elements
    validators:{},                      //Validator templates
    dataServices:{},                    //Servicios
    dataProcessors:{},                  //DataProcessors
    
    dsCounter:0,                        //contador incremental para IDs de datasources 
    
    dataSourceScriptPath:"",            //ruta de datasource.js
    
    //Metodos Internos
    
    //Construccion de un array
    array:function()
    {
        var ret=[];
        ret.remove=function(obj)
        {
            while ((ax = ret.indexOf(obj)) !== -1) {
                ret.splice(ax, 1);
            }            
        };
        return ret;
    },
            
    //Timer para inhabilitar boton de submit
    startSubmitTimeOut:function(button)
    {
        if(swbf.submitTimeOut)clearTimeout(swbf.submitTimeOut);        
        if(button && button!=null)
        {
            swbf.submitButton=button;  
            swbf.submitButton.disable();
            swbf.submitTimeout=setTimeout(function(){
                swbf.stopSubmitTimeOut()
            },3000);
        }        
    },
            
    //activar boton de submit y detener timer            
    stopSubmitTimeOut:function()
    {
        if(swbf.submitTimeOut)clearTimeout(swbf.submitTimeOut);
        if(swbf.submitButton)swbf.submitButton.enable();
    },    
    
    linkFormGrid:function(form, grid)  //Metodo Interno
    {
        if(!form.formGrids)
        {
            form.formGrids=[];
        }
        form.formGrids.push(grid);
        grid.form=form;
    },    
            
    linkForm:function(fromForm, toForm, prop)  //Metodo Interno
    {
        if(!fromForm.linkToForms)
        {
            fromForm.linkToForms=[];
        }
        if(!toForm.linkFromForms)
        {
            toForm.linkFromForms=[];
        }        
        fromForm.linkToForms.push({
            form:toForm, 
            prop:prop
        });
        toForm.linkFromForms.push({
            form:fromForm, 
            prop:prop
        });
    },    
            
    getSubmitList:function(form, arr)
    {
        arr.push(form);
        if(form.formGrids)
        {
            for (var i = form.formGrids.length; i--;) 
            {
                var grid=form.formGrids[i];   
                arr.push(grid);
            }
        }
        if(form.linkToForms)
        {
            for (var i = form.linkToForms.length; i--;) 
            {
                var to=form.linkToForms[i];   
                swbf.getSubmitList(to.form,arr);
            }
        }        
    },            
    
    submitForm:function(form,callback)
    {
        //console.log("submitForm:"+form.ID);
        var arr=[];
        swbf.getSubmitList(form,arr);
        swbf.submitList(arr,callback);
    },
            
    submitList:function(arr,callback,index)
    {
        //console.log("submitList:"+arr+" "+index);
        if(!index && index!=0)index=arr.length-1;
        if(index>=0)
        {
            var form=arr[index];
            if(form.getAllEditRows)
            {
                swbf.submitListGrid(form,arr,callback,index);    
            }else
            {
                swbf.submitListForm(form,arr,callback,index);
            }        
        }else if(index==-1)
        {
            swbf.stopSubmitTimeOut()
            if(callback && callback!=null)callback();
            else
            {
                isc.say("Datos enviados correctamente...");
            }
        }
    },
            
    submitListGrid:function(grid,farr,callback,findex)
    {
        //console.log("submitListGrid:"+grid.ID+" "+findex);
        if(grid!=null)
        {
            var earr=grid.getAllEditRows();
            //var fin=null;
            //if(earr.length>0)fin=earr[earr.length-1];
            if(earr.length>0)
            {
                //Valida renglones en blanco
                if(Object.keys(grid.getEditValues(earr[0])).length==0)
                {
                    grid.discardEdits(earr[0]);
                    swbf.submitListGrid(grid,farr,callback,findex);
                }else
                {
                    swbf.startSubmitTimeOut();
                    
                    grid.saveEdits(null,function(rownum)
                    {                                 
                        //console.log("grid.saveEdits:"+grid.ID+" "+rownum);                    
                        //if(fin==rownum)
                        if(grid.getAllEditRows().length==0)
                        {
                            var arr=[];
                            for(j=0;j<grid.getTotalRows();j++)
                            {
                                var rec=grid.getRecord(j);
                                if(rec!=null)
                                {
                                    var suri=rec._id;
                                    if(suri && suri!=null)arr.push(suri);
                                }
                            }                                                

                            if(grid.parentElement.canvasItem)
                            {
                                //alert(this.parentElement.canvasItem.getValue());
                                if(arr.length>0)
                                    grid.form.saveItemValue(grid.parentElement.canvasItem,arr);
                                else
                                    grid.form.saveItemValue(grid.parentElement.canvasItem,null);
                            //alert(arr +" "+this.parentElement.canvasItem.getValue());                        
                            }else
                            {
                                if(arr.length>0)
                                    grid.form.setValue(grid.parentElement.prop,arr);
                                else
                                    grid.form.setValue(grid.parentElement.prop,null);
                            }
                            swbf.submitList(farr,callback,--findex);                        
                        }else
                        {
                            swbf.submitListGrid(grid,farr,callback,findex);
                        }
                    },earr[0]);
                    
                }
            }  
            if(earr.length==0)swbf.submitList(farr,callback,--findex); 
            
        }else
        {
            swbf.submitList(farr,callback,--findex);
        }
    },         
    
            
    submitListForm:function(form, farr, callback, findex)
    {
        //console.log("submitListForm:"+form.ID+" "+farr+" "+findex);
        //alert(form);
        
        //console.log("submitInv:"+form);
        swbf.startSubmitTimeOut();
        form.saveData(function()
        {
            //console.log("form.saveData:"+form.ID);
            form.rememberValues();
            if(form.linkFromForms)
            {
                for (var i = form.linkFromForms.length; i--;) 
                {
                    var from=form.linkFromForms[i];  
                    from.form.setValue(from.prop,form.getValue("_id"));
                }
            }
            
            //revisar si la forma esta vinculada a un grid
            if(form.fromGrid!=null)
            {     
                //alert(form.fromGrid+" "+form.getValue("_id"));
                var grid=form.fromGrid;
                var arr=[];
                var rec=null;
                var add=true;
                var fsuri=form.getValue("_id");
                var _suri=form.getValue("_suri");
                for(j=0;j<grid.getTotalRows();j++)
                {
                    rec=grid.getRecord(j);
                    if(rec!=null)
                    {
                        var suri=rec._id;
                        if(suri && suri!=null && suri!=_suri)
                        {
                            arr.push(suri);
                            if(fsuri==suri)add=false;
                        }
                    }
                }
                if(add)arr.push(fsuri);
                
                //alert(grid.parentElement.canvasItem.form);
                grid.invalidate=true;
                
                if(grid.parentElement.canvasItem)
                {
                    if(arr.length>0){
                        grid.parentElement.canvasItem.form.saveItemValue(grid.parentElement.canvasItem,arr);
                        grid.parentElement.showValue(arr);
                    }
                    else{
                        grid.parentElement.canvasItem.form.saveItemValue(grid.parentElement.canvasItem,null);
                        grid.parentElement.showValue(null);                
                    }
                }else
                {
                    if(arr.length>0)
                    {
                        grid.form.setValue(grid.parentElement.prop,arr);
                    }
                    else 
                    {
                        grid.form.setValue(grid.parentElement.prop,null);
                    }
                    //Actualiza grid
                    grid.parentElement.showValue(grid.form.getValue(grid.parentElement.prop));
                }
                
            swbf.submitForm(grid.parentElement.canvasItem.form);
            //swbf.submitFormInv(grid.parentElement.canvasItem.form);
            //alert("revisar forma fomas vinculadas a grid parent");                
            }
            //Si la forma esta en una ventama y es la ventana a la que se le dio save cierra la ventana
            if(form.window && swbf.submited==form)
            {
                form.window.closeClick();
            }
            
            swbf.submitList(farr,callback,--findex);
        });
    },                 
            
    //Valida la forma dada            
    validateForm:function(form)
    {
        //console.log("validateForm:"+form.ID);
        //form.synchronousValidation=true;
        form.handleAsyncValidationReply=function(s,e)
        {
            if(s==false)
            {
                swbf.validates.isValid=false;
                var err=form.getErrors();
                err.form=form;
                swbf.validates.errors.push(err);
            //form.showErrors();
            //swbf.desc(form.getErrors(),true);
            }
            swbf.validates.remove(form);
        };
        var ret=form.validate();
        if(form.isPendingAsyncValidation()==true)
        {
            swbf.validates.push(form);
        }
        //ret=form.hasErrors();
        
        if(ret==false)
        {
            swbf.validates.isValid=false;
            var err=form.getErrors();
            err.form=form;
            swbf.validates.errors.push(err);
            return false;
        }
                
        if(form.linkToForms)
        {
            for (var i = form.linkToForms.length; i--;) 
            {
                var to=form.linkToForms[i];   
                if(swbf.validateForm(to.form)==false)return false;
            }
        }   
        
        if(form.formGrids)
        {
            for (var i = form.formGrids.length; i--;) 
            {
                var grid=form.formGrids[i];
                if(grid.parentElement.validate()==false)return false;
            }                          
        }
        return true;        
    },    
            
    //Filtra y combina los objetos json, por ejemplo links definidos en el datasource, 
    //con los definidos en la forma         
    mergeAndArray:function(bnodes, fnodes)
    {
        if(!fnodes)return bnodes;
        var ret=[];
        for(var x=0;x<fnodes.length;x++)
        {
            for(var y=0;y<bnodes.length;y++)
            {
                if(bnodes[y].name===fnodes[x].name)
                {
                    ret.push(swbf.clonAndMergeObjects(bnodes[y],fnodes[x]));
                }
            }
        }        
        return ret;
    },     
            
    //Agregar un link a una forma         
    addLinks:function(links,tabs,tab,pane,form)
    {
        links=swbf.mergeAndArray(links,form.links);
        
        if(links)
        {
            for (var x=0;x<links.length;x++) 
            {
                var link=links[x];
                
                var ds = swbf.createDataSource(link.dataSource,true);       
                                
                if(link.stype==="subForm")
                {
                    
                    var sform=isc.DynamicForm.create({
                        numCols: "6",
                        cellPadding: 5,
                        titleAlign : "right",
                        disabled : false,
                        dataSource: ds,
                        fields:link.fields,
                        values:link.values,
                    });
                    sform.tindex=form.tindex;

                    var spane=isc.VStack.create({
                        membersMargin: 10,
                        //styleName: 'normal seccion',
                        //class: 'normal seccion',
                        members : [
                            isc.Label.create({
                                contents: link.title,
                                width: "100%",
                                height: 25,
                                autoDraw: true,
                                baseStyle: "exampleSeparator"
                            }),
                            sform
                        ]
                    });              
                    pane.addMember(spane);
                    
                    swbf.linkForm(form,sform,link.name);
                    
                    swbf.addLinks(ds.links,tabs,tab,spane,sform);
                }else if(link.stype==="tab")
                {
                    var sform=isc.DynamicForm.create({
                        numCols: "6",
                        cellPadding: 5,
                        titleAlign : "right",
                        disabled : false,
                        dataSource: ds,
                        fields:link.fields
                    });
                    
                    sform.tindex=form.tindex+1;
                    
                    var spane=isc.VStack.create({
                        members: [sform]
                    });

                    var stab={
                        title: link.title,
                        pane: spane
                    };
                    
                    tabs.addTab(stab);
                    swbf.linkForm(form,sform,link.name);
                    swbf.addLinks(ds.links,tabs,stab,spane,sform);
                }
            }                  
        }        
     
    },    
            
    //Muestra los errores de validacion        
    showFormErrors:function()
    {
        swbf.stopSubmitTimeOut();
        var txt="";
        var ferr=null;
        for (var i = swbf.validates.errors.length; i--;) 
        {
            var obj=swbf.validates.errors[i];
            for (property in obj) 
            {
                var field=isc.DS.get(obj.form.dataSource).fields[property];
                if(field)
                {
                    txt+=field.title+": "+obj[property]+"</br>";
                    ferr=obj.form;
                }
            }            
        }
        //swbf.desc(swbf.validates.errors[0],true);        
        isc.warn(txt);
        if(ferr!=null)
        {
            var tabs=swbf.findObject(swbf.submited.dataSource.dsName+"Tabs");
            if(tabs){
                if(typeof ferr.tindex === 'undefined') //es Un grid
                {
                    tabs.selectTab(ferr.parentElement.parentElement.tindex);
                }else // es una forma
                {
                    tabs.selectTab(ferr.tindex);
                }
            }
        }
    },               
            
                        
            
            
    //Metodos Publicos        
    
    //Clonar un objeto 
    cloneObject:function(obj)
    {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) 
        {
            if (obj.hasOwnProperty(attr))
            {
                copy[attr] = swbf.cloneObject(obj[attr]);
            }
        }
        return copy;        
        //return Object.create(obj);
        //return JSON.parse(JSON.stringify(obj));
    },
            
    //Clonar un objeto 
    clonAndMergeObjects:function(obj1, obj2)
    {
        var copy = swbf.cloneObject(obj1);
        if (null == obj2 || "object" != typeof obj2) return copy;
        for (var attr in obj2) {
            if (obj2.hasOwnProperty(attr)) copy[attr] = obj2[attr];
        }
        return copy;        
    },            
            
    //Busca un objeto por ID            
    findObject: function(id)
    {
        var obj = null;
        try
        {
            obj = eval(id);
        } catch (e) {
        }
        return obj;
    },
    
    //Abre un url en el target especificado
    openURL: function(url, target)
    {
        var win = window.open(url, target);
        win.focus();
    },
    
    //realiza un submit a una forma dada
    submit: function(form, button, callback)
    {
        swbf.startSubmitTimeOut(button);        
        //console.log("submit:"+form.ID);
        swbf.submited=form;             //Forma original enviada
        
        swbf.validates=swbf.array();    //Array para server validates
        swbf.validates.isValid=true;
        swbf.validates.errors=[];
        
        if(swbf.validateForm(form)==true && swbf.validates.isValid==true)
        {
            if(swbf.validates.length==0)    //Si no hay validaciones del server pendientes envia el submit
            {
                swbf.submitForm(form,callback);
            }else
            {
                var inter=window.setInterval(function()
                {
                    var end=true;
                    for (var i = swbf.validates.length; i--;) 
                    {
                        var frm=swbf.validates[i];  
                        if(frm.isPendingAsyncValidation()==true)end=false;
                    }
                    if(end==true)
                    {
                        window.clearInterval(inter);
                        //alert("end:"+swbf.validates.isValid);
                        if(swbf.validates.isValid==true)
                        {
                            swbf.submitForm(form,callback);
                        }else
                        {
                            swbf.showFormErrors();
                        } 
                    }                
                },100);
            }
                
        }else
        {
            swbf.showFormErrors();
        }
    },
            
    //Realiza un fetch de una forma con los datos especificados            
    fetchForm:function(form, data)
    {
        form.fetchData(data,function()
        {
            if(form.formGrids)
            {
                for (var i = form.formGrids.length; i--;) 
                {
                    var grid=form.formGrids[i];

                    if(grid.parentElement.prop)
                    {
                        var val=form.getValue(grid.parentElement.prop);
                        grid.parentElement.showValue(val);
                    }
                }               
            }
            
            if(form.linkToForms)
            {
                for (var i = form.linkToForms.length; i--;) 
                {
                    var to=form.linkToForms[i];

                    val=form.getValue(to.prop);
                    if(val)swbf.fetchForm(to.form,{
                        _id:val
                    });
                }               
            }
        });
    },
            
    //resize form         
    resize:function(form)
    {
        for (var i = form.items.length;i--;)
        {
            form.items[i].setWidth(form.items[i].getWidth());            
        }
        
        if(form.linkToForms)
        {
            for (var i = form.linkToForms.length; i--;) 
            {
                var to=form.linkToForms[i];   
                swbf.resize(to.form);
            }
        }           
//        if(form.formGrids)
//        {
//            for (var i = form.formGrids.length; i--;) 
//            {
//                var grid=form.formGrids[i];
//            }                          
//        }
        return true;        
    },                
            
            
    //Regresa un objeto con el nombre y ID del Datasource en base al parametro dado que puede ser 
    //un string o un objeto con los dos parametros        
    getDataSourceObjDef: function(dsDef, clone)
    { 
        var dsObjDef={};
        if(dsDef)
        {
            if(typeof dsDef == 'string')
            {  
                dsObjDef.dsName=dsDef;
                dsObjDef.dsId="ds_"+dsDef;
                if(clone===true)dsObjDef.dsId+="_"+(swbf.dsCounter++);
            }
            else
            {
                if(dsDef.dsName)dsObjDef.dsName=dsDef.dsName;
                if(dsDef.dsId)dsObjDef.dsId=dsDef.dsId;
                else 
                {
                    dsObjDef.dsId="ds_"+dsDef.dsName;
                    if(clone===true)dsObjDef.dsId+="_"+(swbf.dsCounter++);
                }
            }
        }
        return dsObjDef;
    },
            
    createDataSource: function(dsDef,clone)
    {
        var dsObjDef=swbf.getDataSourceObjDef(dsDef,clone);
        
        var ds = swbf.findObject(dsObjDef.dsId);
        if (ds == null)
        {
            var data = swbf.cloneObject(swbf.dataSources[dsObjDef.dsName]);
            if(data)
            {
                data.ID = dsObjDef.dsId;
                data.dsName = dsObjDef.dsName;
                data.dataFormat = "json";
                data.dataURL = "/swbforms/jsp/datasource.jsp?dssp="+dataSourceScriptPath+"&ds="+dsObjDef.dsName;// + "&scls=" + data.scls;//+"&modelid=" + data.modelid;
                data.operationBindings = swbf.operationBindings;
                swbf.processFields(data.fields);
                data.fields.unshift({name: "_id", type: "string", hidden: true, primaryKey: true});    //Insertar llave primaria
                return isc.RestDataSource.create(data);
            }
        }
        return ds;
    },
            
            
    createGrid: function(base, dsDef)
    {
        //swbf.initPlatform();     
        
        var ds = swbf.createDataSource(dsDef);
        
        if (base.alternateRecordStyles===undefined)
            base.alternateRecordStyles = true;
        if (base.emptyCellValue===undefined)
            base.emptyCellValue = "--";
        if (base.dataPageSize===undefined)
            base.dataPageSize = 20;
        if (base.dataSource===undefined)
            base.dataSource = ds;
        if (base.autoFetchData===undefined)
            base.autoFetchData = true;
        if (base.position===undefined)
            base.position = "relative";
        if (base.canAddFormulaFields===undefined)
            base.canAddFormulaFields = true;
        if (base.canAddSummaryFields===undefined)
            base.canAddSummaryFields = true;
        if (base.canEditHilites===undefined)
            base.canEditHilites = true;     
        if (base.canEdit===undefined)
            base.canEdit = false;
        if (base.canAdd===undefined)
            base.canAdd = false;
        base.canRemoveRecords = swbf.removeAttribute(base, "canRemove");
        base.showFilterEditor = swbf.removeAttribute(base, "showFilter");

        var totalsLabel = isc.Label.create({
            padding: 5,
        });

        var mem=[
            totalsLabel,
            isc.LayoutSpacer.create({
                width: "*"
            })
        ];
        
        if(base.canAdd===true)
        {
            var addButton = isc.ToolStripButton.create({
                grid: grid,
                icon: "[SKIN]/actions/add.png",
                prompt: "Agregar nuevo registro",
            });            
            mem.push(addButton);
        }
        
        var button2;
        
        if(base.canEditHilites==true)
        {
            button2 = isc.ToolStripButton.create({
                icon: "[SKIN]/actions/column_preferences.png",
                prompt: "Agregar Marcadores",
            });
            mem.push(button2);
        }
        
        var toolStrip = isc.ToolStrip.create({
            width: "100%",
            height: 24,
            members: mem,
        });
        
        if (base.gridComponents===undefined)
            base.gridComponents = ["filterEditor","header", "body","summaryRow", toolStrip];

        
        if (base.dataChanged===undefined)
            base.dataChanged = function()
            {
                this.Super("dataChanged", arguments);
                var totalRows = this.data.getLength();
                if (totalRows > 0 && this.data.lengthIsKnown()) {
                    totalsLabel.setContents(totalRows + " Registros");
                } else {
                    totalsLabel.setContents("&nbsp;");
                }
            };

        var grid = isc.ListGrid.create(base);

        //***** nueva propiedad *********//
        if(base.addButtonClick===undefined)
        {
            addButton.click = function(p1) {
                grid.startEditingNew(grid.initialCriteria);
            };
        }else
        {
            addButton.click = base.addButtonClick;
        }
        
        if(base.canEditHilites==true)
        {
            button2.click=function(p1)
            {
                grid.editHilites();
            };
        }

        return grid;
    },
            
            
            
    createForm: function(base, fetchId, dsDef)
    {
        var dsObjDef=swbf.getDataSourceObjDef(dsDef);
        
        //links=swbf.mergeAndArray(links,form.links);
        
        var ds = swbf.createDataSource(dsObjDef);
        
        var formBase = swbf.cloneObject(base);

        if (formBase.numCols===undefined)
            formBase.numCols = 6;        
        //colWidths: [60, "*"],        
        if (formBase.titleAlign===undefined)
            formBase.titleAlign = "right";
        if (formBase.cellPadding===undefined)
            formBase.cellPadding = 5;
        if (formBase.dataSource===undefined)
            formBase.dataSource = ds;
        if (formBase.width)
            delete formBase.width;
        if (formBase.height)
            delete formBase.height;
        if (formBase.showTabs===undefined)
        {
            formBase.showTabs = true;
        }
        //***** nueva propiedad *********//
        if (formBase.title)
            delete formBase.title;
        
        swbf.processFields(formBase.fields);

        var form = isc.DynamicForm.create(formBase);        

        var submit = isc.IButton.create(
                {
                    title: "Guardar",
                    click: function(p1) {
                        swbf.submit(p1.target.form);
                    }
                });
        submit.form = form;
        
        var pane=isc.VStack.create({
            members: [form]
        });
        
        var tabs=pane;
        
        if(formBase.showTabs===true)
        {
            var tab={
                title: base.title,
                pane: pane
            };

            tabs=isc.TabSet.create({
                ID: dsObjDef.dsName + "Tabs",
                tabs: [tab]
            });
        }
        
        var buttons=isc.HLayout.create({height: "20px", padding:"10px", members: [submit]});

        var layout=isc.VLayout.create({
            membersMargin: 5,
            width: base.width,
            height: base.height,
            members: [
                tabs,
                buttons,
            ],
            position: "relative",
        });
        
        tabs.setBorder("1px solid darkgray");
        layout.setZIndex(0)

        //Para tener acceso al layout desde la forma, al contenedor de botones y al boton de submit
        form.layout=layout;
        form.submitButton=submit;
        form.buttons=buttons;
        form.tindex=0;

        //Process linked objects
        
        swbf.addLinks(ds.links,tabs,tab,pane,form);
        
        if (fetchId && fetchId != null)
        {
            swbf.fetchForm(form, {_id: fetchId});
        }
        
        swbf.resize(form);
        return form;
    },
    
    //Muestra una ventana para edicion de un objeto
    editWindowForm:function(field, fetchId, dsDef, values)
    {
        var base=swbf.cloneObject(field);
        
        if(values)base.values=values;
        
        var w= swbf.removeAttribute(base,"width");
        var h= swbf.removeAttribute(base,"height");
        
        var form=swbf.createForm(base, fetchId, dsDef);
        
        var pane=form.parentElement;
        var tab=pane.parentElement;
        var tabs=tab.parentElement;
        //var layout=form.layout;
        
        if(!w)w="90%";
        if(!h)h="80%";        
        
        var win=isc.Window.create({
            //width:"950",
            //height:"600",
            canDragResize:true,
            title: base.title,
            width: w, //"90%",
            height: h, //"90%",
            //autoSize:true,
            autoCenter: true,
            isModal: true,
            showModalMask: true,
            autoDraw: false,
            closeClick : function () {
                this.Super("closeClick", arguments);
                //win=null;
            },
            items:[tabs,form.buttons]
        });   
        
        win.animateShow("slide", null, 500, "smoothStart");
        win.form=form;
        form.window=win;
        
        return win;
    }, 
    
    filterFields:function(fields)
    {
        ret=[];
        if(fields)
        {
            for (var x=0;x<fields.length;x++) 
            {
                var field=fields[x];
                if(field.isRemoveField)continue;
                ret[x]={};
                for (var attr in field) {
                    if (field.hasOwnProperty(attr)) 
                    {
                        if(!attr.startsWith("$") && attr!="align" && attr!="masterIndex")
                        ret[x][attr] = field[attr];
                    }
                }
            }
        }
        return ret;
    },
    
    //Procesa y transforma array de fields y procesa stypes de fields como de validators 
    processFields: function(fields)
    {
        if(fields)
        {
            for (var x=0;x<fields.length;x++) 
            {
                fields[x]=swbf.processField(fields[x]);

                var validators=fields[x].validators;
                if(validators)
                {
                    for (var y=0;y<validators.length;y++) 
                    {
                        validators[y]=swbf.processValidator(validators[y]);
                    }
                }
                
                if(fields[x].fields)swbf.processFields(fields[x].fields);                
            }
            //console.log(data.fields);
        }        
    },
    
    //Transforma un stype en propiedades nativas del field
    processField: function(field)
    {
        var stype=field.stype;
        if(stype)
        {
            if(swbf.fieldProcesors[stype])
            {
                   return swbf.fieldProcesors[stype](field);
            }else
            {
                return field;
            }
        }else return field;
    },
            
    //Transforma un stype en propiedades nativas del validators        
    processValidator: function(validator)
    {
        var stype=validator.stype;
        if(stype)
        {
            var base=swbf.validators[stype];
            if(base)
            {
                var ret=swbf.clonAndMergeObjects(base,validator);
                swbf.removeAttribute(ret,"stype");
                //console.log(validator);
                //console.log(base);
                //console.log(ret);                
                return ret;
            }
        }
        return validator;
    },
    
    //Regresa el valor de un atributo y lo elimina del objeto        
    removeAttribute: function(obj,attr)
    {
        var ret=obj[attr];
        if(ret)delete obj[attr];
        return ret;
    },
            
    getSynchData: function(url,data,header)
    {
        if (typeof XMLHttpRequest === "undefined") 
        {
            XMLHttpRequest = function () {
              try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
              catch (e) {}
              try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
              catch (e) {}
              try { return new ActiveXObject("Microsoft.XMLHTTP"); }
              catch (e) {}
              // Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
              throw new Error("This browser does not support XMLHttpRequest.");
            };
        }
        
        var aRequest= new XMLHttpRequest();
        if(!data)
        {
            aRequest.open('GET', url, false);
            aRequest.send();
        }else
        {
            aRequest.open('POST', url, false);
            aRequest.send(data);
        }
        //"Content-type","application/x-www-form-urlencoded"
        return aRequest.responseText;
    },  
            
    baseUrl: function() 
    {
        var url=window.location.href;
        var i = url.lastIndexOf("/");
        if(i<10)
        {
            return url+"/";
        }
        return url.substring(0, i+1);
    },
            
    basePath: function() 
    {
        var url=window.location.href.split('/');
        var ret='/';
        for(var i=3;i<url.length-1;i++)
        {
            ret+=url[i]+"/";
        }
        return ret;
    },                        

    loadJS: function(file, eval)
    {
        var noEval=true;
        if(eval && eval==true)noEval=false;
        
        //set the returned script text while adding special comment to auto include in debugger source listing:
        var aScriptSource = swbf.getSynchData(file) + '\n////# sourceURL=' + file + '\n';

        if(noEval)
        {
            //create a dom element to hold the code
            aScript = document.createElement('script');
            aScript.type = 'text/javascript';

            //set the script tag text, including the debugger id at the end!!
            aScript.text = aScriptSource;

            //append the code to the dom
            document.getElementsByTagName('head')[0].appendChild(aScript);
        }
        else
        {
            eval(aScriptSource);
        }
    },


    loadCSS: function(filename)
    {
        var fileref=document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
        
        if (typeof fileref!="undefined")
        {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    },
    
    initPlatform: function(file, start)
    {
        if(!swbf.inited)
        {
            swbf.inited=true;     

            swbf.loadJS(isomorphicDir+"system/modules/ISC_Core.js");
            swbf.loadJS(isomorphicDir+"system/modules/ISC_Foundation.js");
            swbf.loadJS(isomorphicDir+"system/modules/ISC_Containers.js");
            swbf.loadJS(isomorphicDir+"system/modules/ISC_Grids.js");
            swbf.loadJS(isomorphicDir+"system/modules/ISC_Forms.js");
            swbf.loadJS(isomorphicDir+"system/modules/ISC_DataBinding.js");
            swbf.loadJS(isomorphicDir+"system/modules/ISC_Calendar.js");
            swbf.loadJS(isomorphicDir+"skins/Enterprise/load_skin.js");
            swbf.loadJS(isomorphicDir+"locales/frameworkMessages_es.properties");
            
            isc.DateItem.DEFAULT_START_DATE.setYear(1900);
            
            if(file.charAt(0)!='/')
            {
                dataSourceScriptPath=window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/'))+"/"+file;
            }else
            {
                dataSourceScriptPath=file;
            }
            
            swbf.loadJS("/swbforms/js/swbf_lang.js");
            swbf.loadJS(file);                                
        }
    }
    
};

swbf.dataStores["mongodb"]={};





