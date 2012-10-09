Ext.Loader.setConfig({enabled:true});

Ext.onReady(createTree);

// a counter to allow the model to be repeatedly updated
var counter = 0;

Ext.define('TheModel', {
    extend:'Ext.data.Model',
    fields:[
        { name:'text', type:'string'},
        { name:'someValue', type:'number', defaultValue:-1}
    ]
});

Ext.define('TheStore', {
    extend:'Ext.data.TreeStore',
    model:'TheModel',
    proxy:{
        type:'ajax',
        //the store will get the content from the .json file
        url:"streams.json"
    },
    autoLoad:false,
    autoSync:true
});

Ext.define('Analysis.view.browser.Streams', {
    extend:'Ext.tree.Panel',

    alias:'widget.slowtree',

    rootVisible:false,
    stripeRows:true,
    store:Ext.create('TheStore'),

    columns:[
        {
            xtype:'treecolumn',
            text:"a",
            flex:2,
            sortable:true,
            dataIndex:'text'
        },
        {
            xtype:'gridcolumn',
            text:"b",
            flex:1,
            sortable:true,
            dataIndex:'someValue'

            /**
             * This is the rendered - commented out to prove it isn't the bottleneck
             */
//            ,
//            renderer:function (v, metaData) {
//                // only show sensible percentages
//                if (isNaN(v)) return "";
//                var roundedValue = Ext.util.Format.number(v, "0");
//                if (roundedValue <= 0) return "";    // the conversion from string to number is fine - simplest thing to do
//
//                var valueToDisplay = roundedValue + "%";
//                return '<div class="percentage-cell"><p class="percentage-cell-bar" style="width: ' + v + '%;">&nbsp;</p><p class="percentage-cell-value">' + valueToDisplay + '</p></div>';
//            }
        }
    ],

    selModel:{
        selType:'rowmodel',
        mode:'MULTI',
        allowDeselect:true  // this is only relevant for mode:'SIMPLE'
    },

    tbar:[
        {
            xtype:'button',
            text:'Update children',
            handler:function (button) {
                var tree = button.up("treepanel");
                tree.getRootNode().eachChild(function(group) {
                    group.set("someValue", counter++);

                    group.eachChild(function(child) {
                        child.set("someValue", counter);
                    });
                });
            },
            scope:this
        }
    ]

});

function createTree() {
    var win = new Ext.Window({
        title: "Slow tree",
        layout:'fit',
        height: 300,
        width: 300,
        items:[
            {
                xtype:'slowtree',
                flex:1
            }
        ]
    });
    win.show();
}
