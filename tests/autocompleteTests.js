/**
 * Created by ilyin on 21.08.2015.
 */
var Autocomplete = require("../components/Autocomplete2");
var _ = require("underscore");

var getTestDomElement = function(){
    if ($('#c__').length==0)
        $(document.body).append("<div id='c__' style='position:absolute; top: 300px; left: 200px;'/>");
    React.unmountComponentAtNode($('#c__')[0]);
    $('#c__')[0].innerHTML = '';
    return $('#c__')[0];
};

test("ui-01. autocomplete test", function(){
    var source = [
        {name:"ASA1", code:"B1"},
        {name:"ASD2", code:"B2"},
        {name:"AV2", code:"B3"}
    ];
    var items = (query, code)=> {
        var res = _.filter(source, x=>{return x.name.indexOf(query)>=0});
        return $.when(res);
    };

    var onChange = function(text, item) {
        console.log(text);
        console.log(item);
    };

    var c = getTestDomElement();
    var rendered = React.render((<Autocomplete source={items} displayField="name" onChange={onChange}/>),c);
});