var RichToolbar;

RichToolbar = (function() {
  function RichToolbar() {
    this.config = RichConfig.toolbar;
    return this.build();
  }

  RichToolbar.prototype.build = function() {
    var item, itemHTML, toolbarArray, toolbarContainer, _i, _len;
    toolbarArray = this.config.split(/,/);
    toolbarContainer = document.createElement("div");
    toolbarContainer.classList.add("rich-toolbar");
    for (_i = 0, _len = toolbarArray.length; _i < _len; _i++) {
      item = toolbarArray[_i];
      itemHTML = document.createElement("div");
      itemHTML.classList.add(item, "rich-toolbar-item");
      itemHTML.innerHTML = item;
      toolbarContainer.appendChild(itemHTML);
    }
    return toolbarContainer;
  };

  return RichToolbar;

})();

var Rich,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Rich = (function() {
  function Rich() {
    var item, _i, _len, _ref;
    this.instances = document.querySelectorAll('.rich');
    this.toolbar = new RichToolbar;
    _ref = this.instances;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this.initiate(item);
    }
    this.addListeners();
    this["native"] = {
      "b": {
        "command": "bold",
        "type": "native"
      },
      "hr": {
        "command": "insertHorizontalRule",
        "type": "native"
      },
      "indent": {
        "command": "indent",
        "type": "native"
      },
      "ol": {
        "command": "insertOrderedList",
        "type": "native"
      },
      "ul": {
        "command": "insertUnorderedList",
        "type": "native"
      },
      "i": {
        "command": "italic",
        "type": "native"
      },
      "middel": {
        "command": "justifyCenter",
        "type": "native"
      },
      "full": {
        "command": "justifyFull",
        "type": "native"
      },
      "left": {
        "command": "justifyLeft",
        "type": "native"
      },
      "right": {
        "command": "justifyRight",
        "type": "native"
      },
      "outdent": {
        "command": "outdent",
        "type": "native"
      },
      "unformat": {
        "command": "removeFormat",
        "type": "native"
      },
      "all": {
        "command": "selectAll",
        "type": "native"
      },
      "s": {
        "command": "strikethrough",
        "type": "native"
      },
      "sub": {
        "command": "subscript",
        "type": "native"
      },
      "sup": {
        "command": "superscript",
        "type": "native"
      },
      "u": {
        "command": "underline",
        "type": "native"
      }
    };
    this.fakeNative = {
      "background": {
        "command": "backColor",
        "type": "fakeNative",
        "prompt": "Enter a background color"
      },
      "a": {
        "command": "createLink",
        "type": "fakeNative",
        "prompt": "Enter the URL for the link (needs http://)"
      },
      "font": {
        "command": "fontName",
        "type": "fakeNative",
        "prompt": "Enter a font name"
      },
      "fontSize": {
        "command": "fontSize",
        "type": "fakeNative",
        "prompt": "Enter a font size (1-7)"
      },
      "color": {
        "command": "foreColor",
        "type": "fakeNative",
        "prompt": "Enter a foreground color"
      },
      "wrap": {
        "command": "formatBlock",
        "type": "fakeNative",
        "prompt": "Enter the html for format the block with"
      },
      "html": {
        "command": "insertHTML",
        "type": "fakeNative",
        "prompt": "Enter HTML"
      },
      "image": {
        "command": "insertImage",
        "type": "fakeNative",
        "prompt": "Enter an image URL"
      },
      "text": {
        "command": "insertText",
        "type": "fakeNative",
        "prompt": "Enter text"
      }
    };
  }

  Rich.prototype.initiate = function(item) {
    this.createContentEditableArea(item);
    item.insertAdjacentHTML('afterEnd', this.toolbar.outerHTML);
    item.style.display = 'none';
    return this.updateOriginalElement();
  };

  Rich.prototype.createContentEditableArea = function(item) {
    var div;
    div = document.createElement("div");
    div.setAttribute('contenteditable', 'true');
    div.classList.add('rich-textarea');
    div.innerHTML = item.innerHTML;
    return item.insertAdjacentHTML('afterEnd', div.outerHTML);
  };

  Rich.prototype.addListeners = function() {
    var item, toolbarItems, _i, _len, _results;
    toolbarItems = document.querySelectorAll('.rich-toolbar-item');
    _results = [];
    for (_i = 0, _len = toolbarItems.length; _i < _len; _i++) {
      item = toolbarItems[_i];
      _results.push(item.addEventListener('mousedown', (function(e) {
        var toolbarItem;
        e.preventDefault();
        toolbarItem = e.currentTarget;
        item = toolbarItem.classList[0];
        if (ToolbarItems[toolbarItem.classList[0]]) {
          item = ToolbarItems[toolbarItem.classList[0]];
        }
        return this.handleToolbarItemClick(item);
      }).bind(this)));
    }
    return _results;
  };

  Rich.prototype.updateOriginalElement = function() {
    document.querySelector('.rich-toolbar').addEventListener("mousedown", this.listenerToUpdateOriginalElement);
    return document.querySelector('.rich-textarea').addEventListener("keyup", this.listenerToUpdateOriginalElement);
  };

  Rich.prototype.listenerToUpdateOriginalElement = function(e) {
    var originalElement, richTextarea;
    if (e.type === 'mousedown') {
      richTextarea = e.currentTarget.parentNode.nextElementSibling;
      originalElement = e.currentTarget.parentNode.previousElementSibling;
    } else if (e.type === 'keyup') {
      richTextarea = e.currentTarget;
      originalElement = e.currentTarget.previousElementSibling.previousElementSibling;
    }
    if (richTextarea && originalElement && originalElement.classList.contains('rich')) {
      return originalElement.innerHTML = richTextarea.innerHTML;
    }
  };

  Rich.prototype.handleToolbarItemClick = function(item) {
    var promptText;
    if (this.isNative(item)) {
      console.log('is native');
      if (this.isRealNative(item)) {
        return document.execCommand(this["native"][item]);
      } else {
        promptText = prompt(this.fakeNative[item].prompt);
        console.log(promptText);
        return document.execCommand(this.fakeNative[item].command, false, promptText);
      }
    } else {
      return document.execCommand(item.command, false, item.value);
    }
  };

  Rich.prototype.isNative = function(item) {
    if (this["native"][item] || this.fakeNative[item]) {
      return true;
    }
    return false;
  };

  Rich.prototype.isRealNative = function(item) {
    if (__indexOf.call(this["native"], item) >= 0) {
      return true;
    }
    return false;
  };

  return Rich;

})();

new Rich();
