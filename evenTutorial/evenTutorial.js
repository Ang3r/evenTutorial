/*
 * evenTutorial - jQuery Plugin
 * version: 1.0 (31 Jan 2015)
 * @requires jQuery v2.1.0 or later
 *
 * www.even.lv
 * info@even.lv
 *
 * Copyright (c) 2015 Arthur Lutkevichus
 *
 */

(function( $ ) {
    /*
     * Plugin initialization
     */

    $.evenTutorial = function( options ) {
        // If already initialized
        if (evenTutorial.initialized) {
            // Destroy
            evenTutorial.destroy();
        }
        evenTutorial.init( options );
    };

    /*
     * Handle methods
     */

    $.evenTutorial.start = function() {
        evenTutorial.stepCurrent = 0;
        evenTutorial.show();
    };

    $.evenTutorial.show = function( step ) {
        if (step > 0 && step < evenTutorial.steps.length - 1) {
            evenTutorial.stepCurrent = step;
        }

        evenTutorial.show();
    };

    $.evenTutorial.previous = function() {
        evenTutorial.previous();
    };

    $.evenTutorial.next = function() {
        evenTutorial.next();
    };

    $.evenTutorial.close = function() {
        evenTutorial.close();
    };

    $.evenTutorial.exit = function() {
        evenTutorial.close( true );
    };

    $.evenTutorial.destroy = function() {
        evenTutorial.destroy();
    };


    /*
     * evenTutorial class
     */
    function EvenTutorial() {
        this.settings = {
            // Properties
            steps: [],
            startOnLoad: true,
            allowSkipping: false,
            prevButtonText: "&larr; Previous",
            nextButtonText: "Next &rarr;",
            exitButtonText: "&times; Close tutorial",

            // Callbacks
            // function() {}
            onInit: false,
            // function(selector, step) {}
            onStart: false,
            // function(selector, step) {}
            onShow: false,
            // function(selector, step) {}
            onClose: false,
            // function() {}
            onExit: false
        };

        this.steps = [];
        this.stepCurrent = 0;

        this.tipShown = false;
        this.domOverlay = null;
        this.domTooltip = null;
        this.initialized = false;
    }

    EvenTutorial.prototype.init = function( settings ) {
        // Override default settings
        this.settings = $.extend( this.settings, settings );

        // Definition of overlay
        $( "body" ).append( "<div id='even-overlay' />" );
        this.domOverlay = $( "#even-overlay" );

        // Definition of tootltip
        $( "body" ).append( "<div id='even-tooltip' />" );
        this.domTooltip = $( "#even-tooltip" );

        // Steps are defined
        if (this.settings.steps.length) {
            // Looping through steps
            this.settings.steps.forEach( function( element ) {
                var $selector = element.selector;
                // Dom element exists
                if ($selector.length) {
                    // Add data attribute to dom element
                    $selector.attr( "data-even-tip", element.tip );

                    // Add selector to steps
                    this.steps.push( $selector );
                }
            }.bind( this ) );

            // Start on init is true
            if (this.settings.startOnLoad == true && this.steps.length) {
                // Show first element
                this.show();
            }
        }

        if (typeof this.settings.onInit == "function") {
            this.settings.onInit();
        }
        this.initialized = true;
    };

    EvenTutorial.prototype.show = function() {

        $selector = this.steps[this.stepCurrent];

        // Check if one tip is already shown
        if (!this.tipShown && $selector && $selector.length) {
            // Set tip shown state
            this.tipShown = true;

            // Show overlay
            this.domOverlay.addClass( "even-visible" );

            // Highlight selector
            $selector.addClass( "even-selector" );

            // Prepare tooltip
            this.domTooltip.html( $selector.data( 'even-tip' ) );

            // Prepare tooltip buttons
            var $buttons = $( "<ul class='even-tooltip-buttons' />" );
            var $button;

            // More then one step and current step is not first
            if (this.steps.length > 1 && this.stepCurrent > 0) {
                // Create button
                $button = $( "<button type='button'>" + this.settings.prevButtonText + "</button>" );

                // Button event
                $button.on( "click", function() {
                    this.previous();
                }.bind( this ) );

                // Add button
                $buttons.append( $( "<li>" ).append( $button ) );
            }

            // More the one step and current step is not last
            if (this.steps.length > 1 && this.stepCurrent < this.steps.length - 1) {
                // Create button
                $button = $( "<button type='button'>" + this.settings.nextButtonText + "</button>" );

                // Button event
                $button.on( "click", function() {
                    this.next();
                }.bind( this ) );

                // Add button
                $buttons.append( $( "<li>" ).append( $button ) );
            }

            // Setting that allows skipping tutorial is set to true or last on lest step
            if (this.settings.allowSkipping || this.stepCurrent == this.steps.length - 1) {
                // Create button
                $button = $( "<button type='button'>" + this.settings.exitButtonText + "</button>" );

                // Button event
                $button.on( "click", function() {
                    this.close( true );
                    this.stepCurrent = 0;
                }.bind( this ) );

                // Add button
                $buttons.append( $( "<li>" ).append( $button ) );
            }

            // Buttons added to list
            if ($( "li", $buttons ).length) {
                // Add buttons bar to tooltip
                this.domTooltip.append( $buttons );
            }

            // Calculation of tooltip position
            var positions = {
                tooltip: {
                    spacing: 40,
                    width: this.domTooltip.width(),
                    height: this.domTooltip.height()
                },
                selector: {
                    width: $selector.width(),
                    height: $selector.height(),
                    left: $selector.offset().left,
                    top: $selector.offset().top
                },
                body: {
                    width: $( "body" ).width(),
                    height: $( "body" ).height()
                }
            };

            var tipPosition = "left";
            if (positions.selector.left > positions.tooltip.width + positions.tooltip.spacing) {
                tipPosition = "left";
            }
            else if (positions.body.width - positions.selector.width + positions.tooltip.spacing - positions.selector.left >= positions.tooltip.width + positions.tooltip.spacing) {
                tipPosition = "right";
            }
            else {
                if (positions.selector.top > positions.tooltip.height + positions.tooltip.spacing) {
                    tipPosition = "top";
                }
                else {
                    tipPosition = "bottom";
                }
            }

            switch (tipPosition) {
                case "top":
                    this.domTooltip.css( "top", positions.selector.top - (positions.tooltip.height + positions.tooltip.spacing) );
                    this.domTooltip.css( "left", positions.selector.left + positions.selector.width / 2 - positions.tooltip.width / 2 - positions.tooltip.spacing / 4 );
                    break;
                case "right":
                    this.domTooltip.css( "top", positions.selector.top + positions.selector.height / 2 - positions.tooltip.height / 2 - positions.tooltip.spacing / 4 );
                    this.domTooltip.css( "left", positions.selector.left + positions.selector.width + positions.tooltip.spacing );

                    if (parseInt( this.domTooltip.css( "top" ) ) < positions.tooltip.spacing) {
                        this.domTooltip.css( "top", positions.tooltip.spacing );
                    }
                    break;
                case "bottom":
                    this.domTooltip.css( "top", positions.selector.top + positions.selector.height + positions.tooltip.spacing );
                    this.domTooltip.css( "left", positions.selector.left + positions.selector.width / 2 - positions.tooltip.width / 2 - positions.tooltip.spacing / 4 );
                    break;
                case "left":
                    this.domTooltip.css( "top", positions.selector.top + positions.selector.height / 2 - positions.tooltip.height / 2 - positions.tooltip.spacing / 4 );
                    this.domTooltip.css( "left", positions.selector.left - (positions.tooltip.width + positions.tooltip.spacing) );

                    if (parseInt( this.domTooltip.css( "top" ) ) < positions.tooltip.spacing) {
                        this.domTooltip.css( "top", positions.tooltip.spacing );
                    }
                    break;
            }

            var tooltipTop = parseInt( this.domTooltip.css( "top" ) ) - positions.tooltip.spacing;
            var selectorTop = positions.selector.top - positions.tooltip.spacing;
            var scrollPos = (tooltipTop < selectorTop ? tooltipTop : selectorTop);
            $( "body" ).animate( {"scrollTop": scrollPos}, 300, function() {
                // Show tooltip
                this.domTooltip.addClass( "even-visible" );
                this.domTooltip.removeClass( "even-tooltip-top even-tooltip-right even-tooltip-bottom even-tooltip-left" );
                this.domTooltip.addClass( "even-tooltip-" + tipPosition );

                if (typeof this.settings.onShow == "function") {
                    this.settings.onShow( $selector, this.stepCurrent );
                }

                if (this.stepCurrent == 0 && typeof this.settings.onStart == "function") {
                    this.settings.onStart( $selector, this.stepCurrent );
                }
            }.bind( this ) );
        }
    };

    EvenTutorial.prototype.previous = function() {
        var currentlyShow = this.tipShown;
        if (currentlyShow) {
            this.close();
        }
        this.stepCurrent--;
        if (currentlyShow) {
            this.show( this.steps[this.stepCurrent] );
        }
    };

    EvenTutorial.prototype.next = function() {
        var currentlyShow = this.tipShown;
        if (currentlyShow) {
            this.close();
        }
        this.stepCurrent++;
        if (currentlyShow) {
            this.show( this.steps[this.stepCurrent] );
        }
    };

    EvenTutorial.prototype.close = function( exit ) {
        $selector = this.steps[this.stepCurrent];
        $selector.removeClass( "even-selector" );
        this.tipShown = false;
        this.domTooltip.html( "" ).removeClass( "even-visible" );
        this.domOverlay.removeClass( "even-visible" );

        // onClose callback
        if (typeof this.settings.onClose == "function") {
            this.settings.onClose( $selector, this.stepCurrent );
        }

        // onExit callback
        if (exit == true && typeof this.settings.onExit == "function") {
            this.settings.onExit( $selector );
        }
    };

    EvenTutorial.prototype.destroy = function() {
        this.domTooltip.remove();
        this.domOverlay.remove();
        this.settings.steps.forEach( function( element ) {
            var $selector = element.selector;
            if ($selector.length) {
                $selector.removeClass( "even-selector" ).removeAttr( "data-even-tip" );
            }
        } );
        this.steps = [];
        this.stepCurrent = 0;
        this.tipShown = false;
        this.initialized = false;
    };

    var evenTutorial = new EvenTutorial();
}( jQuery ));