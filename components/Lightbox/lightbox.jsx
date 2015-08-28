var _ = require("underscore");
require("./lightbox.less");

var DomUtils = require("../Common/domUtils");
var appendReactToBody = DomUtils.appendReactToBody;
var lightboxes = [];

var LightboxWindow = React.createClass({
    getInitialState(){ return {}; },
    render(){
        return <div className="lightbox-container">
                <div className="lightbox-overlay-background" style={{display: this.state.backgroundHidden ? "none" : ""}} ></div>
                <div className="lightbox-content-wrap">
                    <div className="lightbox-spring"></div>
                    <div className="lightbox-content" ref='content'/>
                </div>
            </div>
    },
    hideBackground : function(){
        this.setState({backgroundHidden : true});
    }
});

var showLightbox = function(content) {

    DomUtils.addClass(document.body, "lightbox-document-body");

    var containerWrap = document.createElement("div");
    DomUtils.addClass(containerWrap, "lightbox-container-wrap");
    document.body.appendChild(containerWrap);
    var newLightbox = React.render(<LightboxWindow/>, containerWrap);
    var contentNode = newLightbox.refs.content.getDOMNode();
    var rendered = React.render(content, contentNode);
    return { content : rendered};
};


var Body = React.createClass({
    render(){
        return <div className='lightbox-body' style={{width:this.props.width}}>{this.props.children}</div>
    }
});

var Header = React.createClass({
    render(){
        return <div className='lightbox-header' style={{width:this.props.width}}>{this.props.children}</div>
    }
});

var Footer = React.createClass({
    render(){
        return <div className='lightbox-footer' style={{width:this.props.width}}>{this.props.children}</div>
    }
});


var Lightbox = React.createClass({
    render() {
        return <div>
            <a className='lightbox-close' style={{display:this.props.closable ? "" : "none"}}>&times;</a>
            {this.props.children}
        </div>;
    }
});


Lightbox.show = showLightbox;
Lightbox.Body = Body;
Lightbox.Header = Header;
Lightbox.Footer = Footer;

module.exports = Lightbox;
