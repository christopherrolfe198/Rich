class RichToolbar
	constructor: () ->
		# Load in configuration from somewhere?
		@config = RichConfig.toolbar
		# build the toolbar
		return @build()
	
	build: () ->
		toolbarArray = @config.split(/,/)
		toolbarContainer = document.createElement("div")
		toolbarContainer.classList.add("rich-toolbar")
		# Create an HTML structure from the array
		for item in toolbarArray
			itemHTML = document.createElement("div")
			itemHTML.classList.add(item, "rich-toolbar-item")
			itemHTML.innerHTML = item
			toolbarContainer.appendChild(itemHTML)

		return toolbarContainer