let searchGroupsLength = searchGroups.length,
		searchPairsKeys = Object.keys(searchPairs),
		searchPairsJoinedKeys = searchPairsKeys.join(','),
		timeoutDuration = 300;
	
	function searchLoop(counter) {
		setTimeout(function() {
		
			document.querySelectorAll(searchPairsJoinedKeys).forEach(function(box) {
				searchPairsKeys.forEach(function(selector) {
					if (box.matches(selector)) {
						(box.shadowRoot || box).querySelectorAll(searchPairs[selector].join(',')).forEach(function(button) {
							if (button.click && !button.classList.contains('idcac')) {
								button.classList.add('idcac');
								
								if (typeof chrome == 'object' && chrome.runtime)
									chrome.runtime.sendMessage({command: "cookie_warning_dismissed", url: document.location.href});
								
								button.click();
								
								// The 2nd click is just to be sure. Avoid when a double click breaks the process.
								if (selector != '.message-container' && button.getAttribute('href') != '#cookieman-settings')
									setTimeout(function() { if (button) button.click(); }, 500);
								
								timeoutDuration += 500;
							}
						});
					}
				});
			});
			
			document.querySelectorAll(searchGroups[counter%searchGroupsLength]).forEach(function(element) {
				if (element.click && !element.classList.contains('idcac')) {
					element.classList.add('idcac');
					
					if (typeof chrome == 'object' && chrome.runtime)
						chrome.runtime.sendMessage({command: "cookie_warning_dismissed", url: document.location.href});
					
					element.click();
					
					setTimeout(function() {
						if (element) element.click();
					}, 500);
					
					timeoutDuration += 500;
				}
			});
			
			if (counter < 100*searchGroupsLength)
				searchLoop(counter+1);
		
		}, timeoutDuration);
		
		timeoutDuration += 50;
	}
	
	var start = setInterval(function() {
		var html = document.querySelector('html');
		
		if (!html || /idc0_345/.test(html.className))
			return;
		
		html.className += ' idc0_345';
		searchLoop(0);
		clearInterval(start);
	}, 500);
