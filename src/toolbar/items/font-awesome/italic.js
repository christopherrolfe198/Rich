var toolbar = require('../../toolbar.js');

toolbar.extend('italic', function() {
    window.Rich.contenteditable.call('italic');
}, ["fa-italic"], "Italics");
