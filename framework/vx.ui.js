/**
 * Created with IntelliJ IDEA.
 * User: zhuclude
 * Date: 7/16/13
 * Time: 11:26 AM
 * To change this template use File | Settings | File Templates.
 */

;(function() {
    var ui = {
        showWaiting: function(selector, isShow, opts) {
            var messageHtml = "<img alt='Waiting..' src='" + "/img/spinner2.gif' />";
            var defaultOpts = {
                message: messageHtml,
                css: {
                    cursor: "default",
                    border: 'none',
                    opacity: 1,
                    backgroundColor: 'transparent'
                },
                overlayCSS: { opacity: 0.1, backgroundColor: '#eee' },
                showOverlay: true,
                fadeIn: 0
            }
            var newOpts = jQuery.extend({}, defaultOpts, opts);
            // show full waiting
            if (selector == null) {
                if (isShow) {
                    jQuery.blockUI(newOpts);
                } else {
                    jQuery.unblockUI({ fadeOut: 0 });
                }
            } else {
                // show waiting on element
                // var selector = '#' + id;
                newOpts.css.top = '48%';
                newOpts.css.left = '48%';

                if (isShow) {
                    jQuery(selector).block(newOpts);
                } else {
                    jQuery(selector).unblock();
                }
            }
        },

        showMessageAutoClose: function(message) {
            var opts = {
                message: message,
                css: {
                    cursor: "default",
                    border: '0px solid #2a2a2a',
                    padding: '15px',
                    width: '20%',
                    left: '40%',
                    opacity:.8,
                    '-webkit-border-radius': '6px',
                    '-moz-border-radius': '6px',
                    'border-radius': '6px',
                    color: '#fff',
                    backgroundColor: '#555555',
                    top: '150px'
                },
                overlayCSS: { opacity: 0.0, backgroundColor: '#eee' },
                showOverlay: true,
                fadeIn: 300,
                timeout: 1200
            };

            ui.showWaiting(null, true, opts);

        },

        showOverlay: function(selector, isShow, opts) {
            var opts = {
                message: "",
                css: {
                    opacity:.0
                },
                overlayCSS: { opacity: 0.5, backgroundColor: '#fff' },
                showOverlay: true
            };

            ui.showWaiting(selector, true, opts);

        },

        tabs: {
            tabItem: function(item){
                var baseTabItem = {
                    code: 1,
                    selected: false,
                    disabled: false,
                    isvisited: false,
                    url:null,
                    title:'',
                    icon_on:'',
                    icon_off:'',
                    clickEvent: null,
                    tab: null,
                    onSelect: function(){
                        this.tab.onSelect(this.code);
                    }
                }
                var newItem = _.extend(baseTabItem, item);
                return _.extend(item, newItem);
            },

            tabObject: function(){
                var _tab = this;
                this.tabItems = [];
                this.currentTab = function(){
                    var tItem = null;
                    _.each(this.tabItems, function(item) {
                        if(item.selected){
                            tItem = item;
                            return;
                        }
                    });

                    if(tItem == null && this.tabItems.length > 0){
                        tItem = this.tabItems[0];
                    }
                    return tItem;
                }

                this.addTabItem = function(tabItem){
                    tabItem = ui.tabs.tabItem(tabItem);
                    tabItem.tab = _tab;
                    this.tabItems.push(tabItem);
                    return this;
                }

                this.onSelect = function(tabCode){
                    if(!this.beforeSelect(tabCode)) return;
                    this.setSelected(tabCode, true);
                };

                this.getTabItem = function(code){
                    var tItem = null;
                    _.each(this.tabItems, function(item) {
                        if(item.code == code){
                            tItem = item;
                        }
                    });
                    return tItem;
                };

                this.beforeSelect = function(code){
                    return true;
                };

                this.afterSelect = function(code){

                };

                this.setSelected =  function (code, isTriggerEvent) {
                    if(isTriggerEvent == null || isTriggerEvent == window.undefined){
                        isTriggerEvent = true;
                    }

                    var selectedTab = this.getTabItem(code);
                    if(!selectedTab || selectedTab.disabled) return;

                    _.each(this.tabItems, function(item) {
                        if(item.code == code){
                            item.selected = true;
                        }else{
                            item.selected = false;
                        }
                    });

                    selectedTab.isvisited = true;

                    if(!isTriggerEvent) return;

                    if(selectedTab.clickEvent){
                        selectedTab.clickEvent();
                    }else{
                        if(selectedTab.url){
                            window.location.href = selectedTab.url;
                            return;
                        }
                    }

                    if(this.afterSelect){
                        this.afterSelect(code);
                    }
                };

                this.isSelected =  function (code) {
                    var selected = false;
                    _.each(this.tabItems, function(item) {
                        if(item.code == code){
                            selected = item.selected;
                        }
                    });
                    return selected;
                };

                return this;
            },

            build: function(initItems){
                var tab = new ui.tabs.tabObject();

                if(initItems){
                    _.each(initItems, function(item) {
                        tab.addTabItem(item);
                    });
                }

                return tab;
            }
        }


    };

    VX.UI = ui;

}).call(this);
