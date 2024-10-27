// closure to avoid namespace collision
(function(){
  var doc = document;
  var scriptQuery = '';
  // Look for the <script> node that loads this script to get its parameters.
  // This starts looking at the end instead of just considering the last
  // because deferred and async scripts run out of order.
  // If the script is loaded twice, then this will run in reverse order.
  for (var scripts = doc.scripts, i = scripts.length; --i >= 0;) {
    var script = scripts[i];
    var match = script.src.match(
        /^[^?#]*\/ai-code-highliter_plugin\.js(\?[^#]*)?(?:#.*)?$/);
    if (match) {
      scriptQuery = match[1] || '';
      // Remove the script from the DOM so that multiple runs at least run
      // multiple times even if parameter sets are interpreted in reverse
      // order.
      script.parentNode.removeChild(script);
      break;
    }
  }

  // Pull parameters into local variables.
  var plugin_folder = '';
  scriptQuery.replace(
      /[?&]([^&=]+)=([^&]+)/g,
      function (_, name, value) {
        value = decodeURIComponent(value);
        name = decodeURIComponent(name);
        if (name == 'plugin_folder')   { plugin_folder = value; }
      });



  function cleanhtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
	// creates the plugin
	tinymce.create('tinymce.plugins.aicodehighliter', {
		// creates control instances based on the control's id.
		// our button's id is "ai-code-highliter_button"
		createControl : function(id, controlManager) {
		
			if (id == 'ai-code-highliter_button') {
				// creates the button
				var button = controlManager.createButton('ai-code-highliter_button', {
					title : 'Code Highlighter', // title of the button
					image : plugin_folder + 'images/ai-code-highliter.png',  // path to the button's image
					onclick : function() {
						// triggers the thickbox
						var width = jQuery(window).width(), H = jQuery(window).height(), W = ( 720 < width ) ? 720 : width;
						W = W - 80;
						H = H - 84;
						tb_show( 'AI Code Highlighter', '#TB_inline?width=' + W + '&height=' + H + '&inlineId=ai-code-highliter-form' );
					}
				});
				return button;
			}
			return null;
		}
	});
	
	// registers the plugin. DON'T MISS THIS STEP!!!
	tinymce.PluginManager.add('aicodehighliter', tinymce.plugins.aicodehighliter);
	
	// executes this when the DOM is ready
	jQuery(function(){
		// creates a form to be displayed everytime the button is clicked
		// you should achieve this using AJAX instead of direct html code like this
		var form = jQuery('<div id="ai-code-highliter-form"><textarea id="ai-code-highliter-code" name="code" style="width:100%; height:85%; margin-top:12px; margin-bottom:10px" placeholder="paste or enter the code here." />\
			<input type="button" id="ai-code-highliter-submit" class="button-primary" value="Insert Code" name="submit" style="float:right;" />\
		</div>');
		
		form.appendTo('body').hide();
		
		// handles the click event of the submit button
		form.find('#ai-code-highliter-submit').click(function(){
			
			var shortcode = '<?prettify linenums=true?><pre class="prettyprint linenums">\n' + cleanhtml(jQuery('#ai-code-highliter-code').val()) + '</pre>';
		
			// inserts the shortcode into the active editor
			tinyMCE.activeEditor.execCommand('mceInsertRawHTML', 0, shortcode);
			
			// closes Thickbox
			tb_remove();
		});
	});
})()

// creates the text button
QTags.addButton( 'ai-code-highliter_button2', 'Code Highlighter', '<?prettify linenums=true?><pre class="prettyprint linenums">', '</pre>', '#', 'Add Highlighted Code');