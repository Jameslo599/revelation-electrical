(function($) {

	var	$window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$banner = $('#banner'),
        $topBar = $('#topBar'),
		settings = {

			carousel: {

				// Transition speed (in ms)
				// For timing purposes only. It *must* match the transition speed of ".carousel > article".
					speed: 350

			}

		};

	/**
	 * @return {jQuery} jQuery object.
	 */
	$.fn._carousel = function(options) {

		var	$window = $(window),
			$this = $(this);

		// Handle no/multiple elements.
			if (this.length == 0)
				return $this;

			if (this.length > 1) {

				for (var i=0; i < this.length; i++)
					$(this[i])._slider(options);

				return $this;

			}

		// Vars.
			var	current = 0, pos = 0, lastPos = 0,
				slides = [],
				$slides = $this.children('article'),
				intervalId,
				isLocked = false,
				i = 0;

		// Functions.
			$this._switchTo = function(x, stop) {

				// Handle lock.
					if (isLocked || pos == x)
						return;

					isLocked = true;

				// Stop?
					if (stop)
						window.clearInterval(intervalId);

				// Update positions.
					lastPos = pos;
					pos = x;

				// Hide last slide.
					slides[lastPos].removeClass('visible');

				// Finish hiding last slide after a short delay.
					window.setTimeout(function() {

						// Hide last slide (display).
							slides[lastPos].hide();

						// Show new slide (display).
							slides[pos].show();

						// Show new new slide.
							window.setTimeout(function() {
								slides[pos].addClass('visible');
							}, 25);

						// Unlock after sort delay.
							window.setTimeout(function() {
								isLocked = false;
							}, options.speed);

					}, options.speed);

			};

		// Slides.
			$slides
				.each(function() {

					var $slide = $(this);

					// Add to slides.
						slides.push($slide);

					// Hide.
						$slide.hide();

					i++;

				});

		// Nav.
			$this
				.on('click', '.next', function(event) {

					// Prevent default.
						event.preventDefault();
						event.stopPropagation();

					// Increment.
						current++;

						if (current >= slides.length)
							current = 0;

					// Switch.
						$this._switchTo(current);

				})
				.on('click', '.previous', function(event) {

					// Prevent default.
						event.preventDefault();
						event.stopPropagation();

					// Decrement.
						current--;

						if (current < 0)
							current = slides.length - 1;

					// Switch.
						$this._switchTo(current);

				});

		// Initial slide.
			slides[pos]
				.show()
				.addClass('visible');

		// Bail if we only have a single slide.
			if (slides.length == 1)
				return;

	};

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Menu.
		$('#menu')
			.append('<a href="#menu" class="close"></a>')
			.appendTo($body)
			.panel({
				delay: 500,
				hideOnClick: true,
				hideOnSwipe: true,
				resetScroll: true,
				resetForms: true,
				side: 'right'
			});

	// Header.
		if ($topBar.length > 0 && $header.hasClass('relative')) {

				$window.on('resize', function() { $window.trigger('scroll'); });

				$topBar.scrollex({
						top:         $header.outerHeight(),
						terminate:      function() { $header.removeClass('relative'); },
						enter:          function() { $header.addClass('relative'); },
						leave:          function() { $header.removeClass('relative'); }
				});

		}

		if ($banner.length > 0 && $header.hasClass('alt')) {

				$window.on('resize', function() { $window.trigger('scroll'); });

				$banner.scrollex({
						bottom:         $header.outerHeight(),
						terminate:      function() { $header.removeClass('alt'); },
						enter:          function() { $header.addClass('alt'); },
						leave:          function() { $header.removeClass('alt'); }
				});

		}

	// Images.
		$('.image[data-position]').each(function() {

			var $this = $(this),
				$img = $this.children('img');

			// Polyfill object-fit.
				if (!browser.canUse('object-fit')) {

					// Apply img as background.
						$this
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-position', $this.data('position'))
							.css('background-size', 'cover')
							.css('background-repeat', 'no-repeat');

					// Hide img.
						$img
							.css('opacity', '0');

					return;

				}

		});

	// Scrolly.
		$('.scrolly').scrolly({
			offset: function() {
				return $header.outerHeight() - 2;
			}
		});

		$('.scrolly-middle').scrolly({
			anchor: 'middle',
			offset: function() {
				return $header.outerHeight() - 2;
			}
		});

	// Spotlights.
		$('.spotlight').scrollex({
			top:		'30vh',
			bottom:		'30vh',
			delay:		25,
			initialize:	function() {
				$(this).addClass('is-inactive');
			},
			terminate:	function() {
				$(this).removeClass('is-inactive');
			},
			enter:		function() {
				$(this).removeClass('is-inactive');
			}
		});

	// Carousels.
		$('.carousel')
			._carousel(settings.carousel);


    // Tiles.
		var $tiles = $('.tiles > article'),
        $wrapper = $('#wrapper');

		$tiles.each(function() {

			var $this = $(this),
				$image = $this.find('.image'), $img = $image.find('img'),
				$link = $this.find('.link'),
				x;

			// Link.
				if ($link.length > 0) {

					$link.on('click', function(event) {

						var href = $link.attr('href');

						// Prevent default.
							event.stopPropagation();
							event.preventDefault();

						// Target blank?
							if ($link.attr('target') == '_blank') {

								// Open in new tab.
									window.open(href);

							}
                            else if (href === '#contact') {
                                location.href = href;
                            }
                            
						// Otherwise ...
							else {

								// Start transitioning.
									$this.addClass('is-transitioning');
									$wrapper.addClass('is-transitioning');

								// Redirect.
									window.setTimeout(function() {
										location.href = href;
									}, 500);

							}

					});

				}

		});

        // Menu.
		var $menu = $('#menu'),
        $menu_openers = $menu.children('ul').find('.opener');

        // Openers.
            $menu_openers.each(function() {

                var $this = $(this);

                $this.on('click', function(event) {

                    // Prevent default.
                        event.preventDefault();

                    // Toggle.
                        $menu_openers.not($this).removeClass('active');
                        $this.toggleClass('active');

                    // Trigger resize (sidebar lock).
                        $window.triggerHandler('resize.sidebar-lock');

                });

        });

})(jQuery);