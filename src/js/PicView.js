

var PicView = function() {

	//return {};
	return {
	
		init: function() {
					
			this.invokeObserver = new AirUtil.Event({
				element: air.NativeApplication.nativeApplication,
				event: air.InvokeEvent.INVOKE,
				scope: this,
				handler: this.invoke.bindAsEventListener(this)
			});
			
			this.initDragEvents();
			
			//this.showImage('test.gif');
			nativeWindow.activate();
		},
		
		initDragEvents: function() {
			var f = function(e) {
				e.preventDefault();
				if(e.type=='drop')
					this.handleDrop(e);
				return
			}.bindAsEventListener(this);
			
			//document.designMode = "on";
			$('drop-target').contenteditable = true;
			Event.observe('drop-target', 'dragenter', f);
			Event.observe('drop-target', 'dragover', f);
			Event.observe('drop-target', 'dragleave', f);
			Event.observe('drop-target', 'drop', f);
		
		},
		
		handleDrop: function(e) {
			/* 
			console.log(
				'event', 
				e.type, 
				e.dataTransfer,
				e.dataTransfer.getData("application/x-vnd.adobe.air.file-list"),
				e
			);
			 */
			var files = e.dataTransfer.getData("application/x-vnd.adobe.air.file-list");
			var f = files[0];
			this.showImage(f.url);
		},
		
		invoke: function(e) {
			if(e.arguments.length>0) {
				var filename = e.arguments[0];
				this.showImage(filename);
			}
		},
		
		loadFile: function() {
			var fileStream = new air.FileStream();
			fileStream.open(this.airFile, air.FileMode.READ);

			var str = fileStream.readMultiByte(this.airFile.size, air.File.systemCharset);
			fileStream.close();

			this.contents = str;

			return str;
		},
		
		resizeWindow: function() {
		
			var resize = function() {
				var p = $('picview');
				window.nativeWindow.stage.stageHeight = p.height;
				window.nativeWindow.stage.stageWidth = p.width;
			};
			resize();
			
			setTimeout(resize, 20);
			setTimeout(resize, 50);
			setTimeout(resize, 80);
		},
		
		showImage: function(filename) {
			var p = $('picview');
			p.src = filename;
			p.show();
			//p.style.visibility = 'hidden';
			this.resizeWindow();

			/* 
			p.style.visibility = 'hidden';
			p.style.display = 'block';
			p.style.visibility = 'visible';
			p.style.marginTop = -(p.height/2)+"px";			
			 */

		}
	};

}();

