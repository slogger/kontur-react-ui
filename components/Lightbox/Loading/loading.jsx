var style = require("./lightbox-loading.less");
var React = require('react/addons');
var Lightbox = require('../lightbox');

var Loading = React.createClass({
    render : function(){

        return    <Lightbox>
            <Lightbox.Body >
                <div className={'lightbox-loading'}>
                    {this.props.children || Loading.defaultContent}
                </div>
            </Lightbox.Body>
        </Lightbox>;
    }
});
Loading.defaultContent = "Загрузка...";
module.exports = Loading;