var _ = require("underscore");
var _ = require("./lightbox.css");

var DomUtils = require("../Common/domUtils");
var appendReactToBody = DomUtils.appendReactToBody;

var createLightbox = function(cfg) {

    DomUtils.addClass(document.body, "lightbox-document-body"); // TODO : add window here

    var container =  document.createElement("div");
    container.className = "lightbox-container lightbox-overlay-background";
    document.body.appendChild(container);


    var spring = document.createElement("div");
    spring.className = "lightbox-spring";
    container.appendChild(spring);

    var content = document.createElement("div");
    content.className = "lightbox-content";
    React.render(cfg.render(), content);
    container.appendChild(content);
};


module.exports = {
    createLightbox : createLightbox
};