/**
 * Created by ilyin on 21.08.2015.
 */
var TestUtils = React.addons.TestUtils;
var Autocomplete = require("../components/Autocomplete2");
var assert = require("assert");
var _ = require("underscore");
var $ = require("jQuery");

var getTestDomElement = function(){
    if ($('#c__').length==0)
        $(document.body).append("<div id='c__' style='position:absolute; top: 300px; left: 200px;'/>");
    React.unmountComponentAtNode($('#c__')[0]);
    $('#c__')[0].innerHTML = '';
    return $('#c__')[0];
};

var source = [
    {name:"Russia", code:"C1"},
    {name:"Romania", code:"C2"},
    {name:"Usa", code:"C3"},
    {name:"Canada", code:"C4"}
];
var items = (query, code)=> {
    var res = _.filter(source, x=>{return x.name.indexOf(query)>=0});
    return $.when(res);
};


test("ui-01. select item, check onChange triggered", function(){
    var lastText, lastItem;
    var onChange = function(text, item) {         lastText = text; lastItem = item;};

    var c = getTestDomElement();
    var rendered = React.render((<Autocomplete source={items} displayField="name" onChange={onChange}/>),c);
    var $input = $(c).find("input");
    $input.focus();

    TestUtils.Simulate.change($input[0], {target: {value: 'Russ'}});
    assert.equal(lastText, "Russ");
    assert.equal(lastItem, null);

    TestUtils.Simulate.keyDown($input[0], {key: "Enter", keyCode: 13, which: 13});
    assert.equal(lastText, "Russia");
    assert.deepEqual(lastItem, {name:"Russia", code:"C1"});
});

test("ui-02. show list, check arrowDown selects next item", function(){
    var lastText, lastItem;
    var onChange = function(text, item) {         lastText = text; lastItem = item;};

    var c = getTestDomElement();
    var rendered = React.render((<Autocomplete source={items} displayField="name" onChange={onChange}/>),c);
    var $input = $(c).find("input");
    $input.focus();
    TestUtils.Simulate.keyDown($input[0], {key: "ArrowDown"});
    TestUtils.Simulate.keyDown($input[0], {key: "Enter", keyCode: 13, which: 13});
    assert.equal(lastText, "Romania");
    assert.deepEqual(lastItem, {name:"Romania", code:"C2"});
});



test("ui-03. show list, enter text value, check item is selected automatically", function(){
    var lastText, lastItem;
    var onChange = function(text, item) {         lastText = text; lastItem = item;};

    var c = getTestDomElement();
    var rendered = React.render((<Autocomplete source={items} displayField="name" onChange={onChange}/>),c);
    var $input = $(c).find("input");
    $input.focus();
    TestUtils.Simulate.change($input[0], {target: {value: 'Romania'}});
    TestUtils.Simulate.blur($input[0]);

    assert.equal(lastText, "Romania");
    assert.deepEqual(lastItem, {name:"Romania", code:"C2"});
});

test("ui-04. show list, drop component, check menu missing ", function(){
    var lastText, lastItem;
    var onChange = function(text, item) {         lastText = text; lastItem = item;};

    var c = getTestDomElement();
    var rendered = React.render((<Autocomplete source={items} displayField="name" onChange={onChange}/>),c);
    var $input = $(c).find("input");
    $input.focus();
    TestUtils.Simulate.focus($input[0]);
    assert.equal($(".ui-AutocompleteMenu:visible").length, 1);

    var rendered = React.render((<div/>),c);
   assert.equal($(".ui-AutocompleteMenu:visible").length, 0);

});


test("ui-05. input text, check text goes to query", function(){
    var lastQuery;
    var getItems = function(query) { lastQuery= query; return items(query);};

    var c = getTestDomElement();
    var rendered = React.render((<Autocomplete source={getItems} displayField="name" />),c);
    var $input = $(c).find("input");
    $input.focus();
    TestUtils.Simulate.focus($input[0]);
    TestUtils.Simulate.change($input[0], {target: {value: 'Alalalal'}});
    assert.equal(lastQuery, 'Alalalal');

});

