/*
 *  Created by Nick - Focus4People 
 *  Created 4-May-2020
 *  
 *  alink classes
 *  navBarIgnore - excludes the a link from line creation or hovering
 *  nickLineSliderCurrent - sets the current a link for the Line to sit under by default
 */
(function ($) {
    $.fn.nickLineSlider = function (settings) {
        //initialise initial vars
        var hrIsSetup = false;
        var hrIsShowing = false;
        var loadDelayReached = false;
        var thisObj;
        var kids;
        var hrObj = null;
        var hrDivObj = null;
        var currentEle;
        var orgColor;

        //default config vars
        var defaultHRTopMargin = "0px";
        var defaultColor = "inherit";
        var defaultChangeColorOnCurrent = true;
        var defaultChangeColorOnHover = false;
        var defaultPercentageExtraWidth = 20;
        var defaultAppearWidth = 0;
        var defaultLoadDelay = 0;
        var defaultDoFadeIn = true;

        //setup key vars
        thisObj = jQuery(this);
        kids = thisObj.find('a:not(.navBarIgnore)');
        if (thisObj.find('a.nickLineSliderCurrent').length !== 0) {
            currentEle = thisObj.find('a.nickLineSliderCurrent').first();
        }
        else {
            //cant find current page from class so use first
            currentEle = kids.first();
        }
        
        //setup config settings
        var config = {
            HRTopMargin: defaultHRTopMargin,
            Color: defaultColor,
            ChangeColorOnCurrent: defaultChangeColorOnCurrent,
            ChangeColorOnHover: defaultChangeColorOnHover,
            PercentageExtraWidth: defaultPercentageExtraWidth, 
            AppearWidth: defaultAppearWidth, 
            LoadDelay: defaultLoadDelay,
            DoFadeIn: defaultDoFadeIn
        };
        if (settings) $.extend(true, config, settings);
        CheckConfig();

        //Do we need to setup a loadDelay timer, this is set in config
        if (config.LoadDelay === 0) {
            LoadDelayReady();
        }
        else {
            //set timeout to run setup.
            setTimeout(function () {
                LoadDelayReady();
            }, config.LoadDelay);
        }
        
        //setup windows width watcher
        jQuery(window).resize(function () {
            //if we pass above the AppearWidth setting show/hide the sliding bar.  do nothing if we havent reached the loadDelay
            if (loadDelayReached) {
                if (window.innerWidth <= config.AppearWidth) {
                    if (hrIsShowing) {
                        //hide hr
                        hrObj.hide();
                        hrIsShowing = false;
                    }
                }
                else {
                    if (!hrIsShowing) {
                        //if we initially loaded below the threshold we are not setup.  setup if need be.
                        if (!hrIsSetup) {
                            SetupHr();
                        }

                        //show hr
                        hrObj.show();
                        hrIsShowing = true;
                    }
                }
            }

            //if we are showing the hr resize as screen has changed
            if (hrIsShowing) {
                //calculate width and lmargin
                var widthOfHr = CalculateHrWidth(currentEle);
                var lMargin = CalculateHrLMargin(currentEle);
                var rMargin = CalculateHrRMargin(currentEle);

                //set css
                hrDivObj.css("margin-left", lMargin);
                hrDivObj.css("margin-right", rMargin);
                hrDivObj.css("width", widthOfHr);
            }
        });

        function CheckConfig() {
            //Check each setting for nulls or incorrect type and if so put them back to default so we can trust them
            if (config.HRTopMargin === null || typeof config.HRTopMargin !== "string") {
                config.HRTopMargin = defaultHRTopMargin;
            }
            if (config.Color === null || typeof config.Color !== "string") {
                config.Color = defaultColor;
            }
            if (config.ChangeColorOnCurrent === null || typeof config.ChangeColorOnCurrent !== "boolean") {
                config.ChangeColorOnCurrent = defaultChangeColorOnCurrent;
            }
            if (config.ChangeColorOnHover === null || typeof config.ChangeColorOnHover !== "boolean") {
                config.ChangeColorOnHover = defaultChangeColorOnHover;
            }
            if (config.PercentageExtraWidth === null || typeof config.PercentageExtraWidth !== "number") {
                config.PercentageExtraWidth = defaultPercentageExtraWidth;
            }
            if (config.AppearWidth === null || typeof config.AppearWidth !== "number") {
                config.AppearWidth = defaultAppearWidth;
            }
            if (config.LoadDelay === null || typeof config.LoadDelay !== "number") {
                config.LoadDelay = defaultLoadDelay;
            }
            if (config.DoFadeIn === null || typeof config.DoFadeIn !== "boolean") {
                config.DoFadeIn = defaultDoFadeIn;
            }
        }

        function LoadDelayReady() {
            //Set Flag
            loadDelayReached = true;

            //is there also a minimum width. we dont setup yet if we are below the minimum width
            if (window.innerWidth > config.AppearWidth) {
                SetupHr();
            }
        }
        
        function SetupHr() {
            //back out if no kids
            if (kids.length === 0) {
                return;
            }

            //change color of currentEle if config says
            if (config.ChangeColorOnCurrent) {
                currentEle.css("color", config.Color);
            }

            //calculate width and lmargin
            var widthOfHr = CalculateHrWidth(currentEle);
            var startginMargin = CalculateHrLMargin(currentEle);
            var rMargin = CalculateHrRMargin(currentEle);
            
            //are we going to add the fade in class
            var classesToAdd = "nickLineSliderHr";
            if (config.DoFadeIn) {
                classesToAdd += " nickLineSliderFadeIn";
            }

            //add the hr element to the end of the parent element.
            var hrId = thisObj.attr("id") + "-NickLineSliderHr";
            thisObj.parent().append("<div id=\"" + hrId + "Wrap\" class=\"nickLineSliderHrWrap\" style=\"width:" + widthOfHr + ";margin-top: " + config.HRTopMargin + ";margin-left:" + startginMargin + ";margin-right:" + rMargin + ";\">"+
                                    "<hr id=\"" + hrId + "\" class=\"" + classesToAdd + "\" style=\"background-color:" + config.Color + ";\" /><div>");
            hrObj = jQuery("#" + hrId);
            hrDivObj = jQuery("#" + hrId + "Wrap");

            //setup hovering for slider movement
            SetupHovering();

            //set flags
            hrIsShowing = true;
            hrIsSetup = true;
        }

        function SetupHovering() {
            //back out if no kids
            if (kids.length === 0) {
                return;
            }
            
            //setup hover for all of the kids.  calculate widths and margins and set them
            for(x = 0; x < kids.length; x++) {
                var currentChild = jQuery(kids[x]);

                //setup hover event
                currentChild.hover(function () {
                    orgColor = jQuery(this).css("color");
                    if (config.ChangeColorOnHover) jQuery(this).css("color", config.Color);
                    hrDivObj.css("width", CalculateHrWidth(jQuery(this)));
                    hrDivObj.css("margin-left", CalculateHrLMargin(jQuery(this)));
                    hrDivObj.css("margin-right", CalculateHrRMargin(jQuery(this)));
                }, function () {
                    if (config.ChangeColorOnHover) jQuery(this).css("color", orgColor);
                    hrDivObj.css("width", CalculateHrWidth(currentEle));
                    hrDivObj.css("margin-left", CalculateHrLMargin(currentEle));
                    hrDivObj.css("margin-right", CalculateHrRMargin(currentEle));
                });
            }
        }

        function CalculateHrWidth(childEle) {
            //return calc
            var decimalExtraWidth = (config.PercentageExtraWidth / 100);
            return (childEle.width() + (childEle.width() * decimalExtraWidth)) + "px";
        }

        function CalculateHrLMargin(childEle) {
            //work out left margin and return
            var decimalExtraWidth = (config.PercentageExtraWidth / 100);
            var curentStartingPos = childEle.offset().left - thisObj.offset().left; //get position of element relative to parent
            return (curentStartingPos - (childEle.width() * (decimalExtraWidth / 2))) + "px";
        }

        function CalculateHrRMargin(childEle) {
            //if not last return 0.  as we dont need a right margin.
            if (!childEle.is(':last-child')) {
                return "0px";
            }

            //if last right margin must be minus the extra part so it doesnt move controls acording to user css
            var decimalExtraWidth = (config.PercentageExtraWidth / 100);
            return "-" + ((childEle.width() * decimalExtraWidth) / 2) + "px";
        }
    };
}(jQuery));