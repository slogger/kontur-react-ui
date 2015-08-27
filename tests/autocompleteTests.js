/**
 * Created by ilyin on 21.08.2015.
 */
var TestUtils = React.addons.TestUtils;
var Autocomplete = require("../components/Autocomplete2");
var assert = require("assert");
var _ = require("underscore");
var $ = require("jQuery");

var getTestDomElement = function(num){
    var id = "__c" + (num||1);
    var top = 300 + num*100;
    if ($('#'+id).length==0)
        $(document.body).append("<div id='" + id + "' style='position:absolute; top: " + top + "px; left: 200px;'/>");
    React.unmountComponentAtNode($('#'+id)[0]);
    $('#'+id)[0].innerHTML = '';
    return $('#'+id)[0];
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

test("ui-06. test flaots", function(){
    var Panel = React.createClass({
         render(){
             return <div><div>{this.props.children}</div>{new Date().getMilliseconds()}</div>;
         }
    });

    var Owner =  React.createClass({
        getInitialState(){
            return {header: "324"};
        },
        render(){
            return <div onClick={this.onClick}>MAIN {this.state.header}</div>;
        },
        onClick : function(){
           this.setState({header: + new Date().getMilliseconds()+""});
            this.panel.setState({header:"sadasd"});
        },
        componentDidMount() {
            var c3 = getTestDomElement(3);
            this.panel = React.render(<Panel><h1> {new Date().getMilliseconds()}</h1></Panel>, c3);
        }
    });
    var c2 = getTestDomElement(2);
    var rendered = React.render((<div> <Owner ></Owner></div>),c2);
    rendered.setState({header:"23423443"});
});

