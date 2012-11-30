( function( $ ) {

	function DurationPicker( element, options ) {
		var that = this;
		this.$element = $( element ).attr( 'autocomplete', 'off' );
		this.options = $.extend( $.fn.durationpicker.defaults, options );
		this.picker = DPGlobal.render( options ).on( 'click.durationpicker', 'li', $.proxy( this.click, this ) );
		this.isInput = this.$element.is( 'input' );

		this.picker.width( this.$element.outerWidth() );
		$( document ).on( 'mousedown', function ( event ) {
			// Clicked outside the datepicker, hide it
			if ( $( event.target ).closest( '.durationpicker' ).length == 0 ) {
				that.hide();
			}
		});
		if ( this.isInput ) {
			this.$element.on( {
				focus: $.proxy( this.show, this ),
				keydown: $.proxy( this.keydown, this ),
				keyup: $.proxy( this.updateLi, this )
			} );
		}
	}

	DurationPicker.prototype = {
		constructor: DurationPicker,

        click: function( event ) {
            this.picker.find( 'li.durationpicker-selected' ).removeClass( 'durationpicker-selected' );
            $( event.currentTarget ).addClass( 'durationpicker-selected' );
            this.updateVal();
        },

		keydown: function( event ) {
			switch( event.keyCode ) {
			case 27: // ESC
				this.hide();
				event.preventDefault();
				break;
			case 9: // Tab
				this.hide();
				break;
			case 38: // Up
				if ( this.picker.is( ':not(:visible)' ) ) {
					this.show();
					return;
				}
				this.selectPrev();
				break;
			case 40: // Down
				if ( this.picker.is( ':not(:visible)' ) ) {
					this.show();
					return;
				}
				this.selectNext();
				break;
			case 13: // Enter
				this.updateVal( event );
				event.preventDefault();
				break;
			}
		},

		show: function( event ) {
			this.picker.show();
			this.place();
			$( window ).on( 'resize', $.proxy( this.place, this ) );
			if ( event ) {
				event.stopPropagation();
				event.preventDefault();
			}
		},

		hide: function( event ) {
			this.picker.hide();
			$( window ).off( 'resize', $.proxy( this.place, this ) );
		},

		place: function() {
			var offset = this.$element.offset();
			this.picker.css( {
				left: offset.left,
				top: offset.top + this.$element.outerHeight()
			} );
		},

		selectNext: function() {
			var $selected, $target;
			$selected = this.picker.find( 'li.durationpicker-selected' ).first();

			if ( $selected.length === 0 ) {
				$target = this.picker.find( 'li' ).first();
			} else {
				if ( $selected.is( ':last-child' ) ) {
					return;
				}
				$target = $selected.removeClass( 'durationpicker-selected' ).next();
			}
			$target.addClass( 'durationpicker-selected' );
		},

		selectPrev: function() {
			var $selected, $target;
			$selected = this.picker.find( 'li.durationpicker-selected' ).first();

			if ( $selected.length === 0 ) {
				$target = this.picker.find( 'li' ).last();
			} else {
				if ( $selected.is( ':first-child' ) ) {
					return;
				}
				$target = $selected.removeClass( 'durationpicker-selected' ).prev();
			}
			$target.addClass( 'durationpicker-selected' );
		},

		updateVal: function( event ) {
			this.$element.val( this.picker.find( 'li.durationpicker-selected' ).text() );
			this.hide();
		},

		updateLi: function( event ) {
			var keyVal = String.fromCharCode( event.keyCode ).toLowerCase();
			if ( event.ctrlKey || ! /^[0-9a-z ]$/.test( keyVal ) ) {
				return;
			}

			var val = $.trim( this.$element.val() ).replace(/\s+/, ' '),
			    $li = this.picker.find( 'li' ),
			    $selected = $li.filter( '.durationpicker-selected' ).first();
			if ( val === $selected.text() ) {
				return;
			}
			if ( $.inArray( val, this.options.list ) === -1 ) {
				return false;
			}
			$selected.removeClass( 'durationpicker-selected' );
			this.picker.find( 'li' ).each( function( i, elem ) {
				if ( $( elem ).text() === val ) {
					$( elem ).addClass( 'durationpicker-selected' );
				}
			} );
            this.show();
		}

	};

	var DPGlobal ={
		render: function( options ) {
			var $list = $( '<ul/>' ), i;
			$list.addClass( 'durationpicker' )
				.css( {
					zIndex: getClosestZIndex( this.$element ),
				} );

			for( i = 0; i < options.list.length; i++ ) {
				$list.append( '<li>' + options.list[i] + '</li>' );
				if ( i === 0 ) {
					$list.addClass( 'durationpicker-selected' );
				}
			}
			$list.appendTo( 'body' );
			return $list;
		}
	};

	/* Helper functions */
	function getClosestZIndex( elem ) {
		if ( !elem ) return;
		return parseInt( elem.parents().filter( function() {
			return $( this ).css( 'z-index' ) !== 'auto';
		} ).first().css( 'z-index' ), 10 );
	};


	/* Add durationpicker to jQuery */
	$.fn.durationpicker = function( method ) {
		var args = Array.apply(null, arguments);
		args.shift();
		return this.each( function () {
			var $this = $( this ),
				data = $this.data( 'durationpicker' ),
				options = typeof option == 'object' && option;
			if ( !data ) {
				data = new DurationPicker( this, $.extend({}, $.fn.durationpicker.defaults, options ) );
				$this.data( 'durationpicker', data);
			}
			if (typeof option == 'string' && typeof data[option] == 'function') {
				data[option].apply(data, args);
			}
		});
	}

	$.fn.durationpicker.defaults = {
		list: ['15 min', '30 min', '1 hr', '2 hr']
	};

} ) ( jQuery );
