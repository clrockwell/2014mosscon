/*
 *
 * Copyright (c) 2006-2009 Sam Collett (http://www.texotela.co.uk)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version 2.2.4
 * Demo: http://www.texotela.co.uk/code/jquery/select/
 *
 * $LastChangedDate$
 * $Rev$
 *
 */
 
;(function($) {
 
/**
 * Adds (single/multiple) options to a select box (or series of select boxes)
 *
 * @name     addOption
 * @author   Sam Collett (http://www.texotela.co.uk)
 * @type     jQuery
 * @example  $("#myselect").addOption("Value", "Text"); // add single value (will be selected)
 * @example  $("#myselect").addOption("Value 2", "Text 2", false); // add single value (won't be selected)
 * @example  $("#myselect").addOption({"foo":"bar","bar":"baz"}, false); // add multiple values, but don't select
 *
 */
$.fn.addOption = function()
{
	var add = function(el, v, t, sO)
	{
		var option = document.createElement("option");
		option.value = v, option.text = t;
		// get options
		var o = el.options;
		// get number of options
		var oL = o.length;
		if(!el.cache)
		{
			el.cache = {};
			// loop through existing options, adding to cache
			for(var i = 0; i < oL; i++)
			{
				el.cache[o[i].value] = i;
			}
		}
		// add to cache if it isn't already
		if(typeof el.cache[v] == "undefined") el.cache[v] = oL;
		el.options[el.cache[v]] = option;
		if(sO)
		{
			option.selected = true;
		}
	};
	
	var a = arguments;
	if(a.length == 0) return this;
	// select option when added? default is true
	var sO = true;
	// multiple items
	var m = false;
	// other variables
	var items, v, t;
	if(typeof(a[0]) == "object")
	{
		m = true;
		items = a[0];
	}
	if(a.length >= 2)
	{
		if(typeof(a[1]) == "boolean") sO = a[1];
		else if(typeof(a[2]) == "boolean") sO = a[2];
		if(!m)
		{
			v = a[0];
			t = a[1];
		}
	}
	this.each(
		function()
		{
			if(this.nodeName.toLowerCase() != "select") return;
			if(m)
			{
				for(var item in items)
				{
					add(this, item, items[item], sO);
				}
			}
			else
			{
				add(this, v, t, sO);
			}
		}
	);
	return this;
};

/**
 * Add options via ajax
 *
 * @name     ajaxAddOption
 * @author   Sam Collett (http://www.texotela.co.uk)
 * @type     jQuery
 * @param    String url      Page to get options from (must be valid JSON)
 * @param    Object params   (optional) Any parameters to send with the request
 * @param    Boolean select  (optional) Select the added options, default true
 * @param    Function fn     (optional) Call this function with the select object as param after completion
 * @param    Array args      (optional) Array with params to pass to the function afterwards
 * @example  $("#myselect").ajaxAddOption("myoptions.php");
 * @example  $("#myselect").ajaxAddOption("myoptions.php", {"code" : "007"});
 * @example  $("#myselect").ajaxAddOption("myoptions.php", {"code" : "007"}, false, sortoptions, [{"dir": "desc"}]);
 *
 */
$.fn.ajaxAddOption = function(url, params, select, fn, args)
{
	if(typeof(url) != "string") return this;
	if(typeof(params) != "object") params = {};
	if(typeof(select) != "boolean") select = true;
	this.each(
		function()
		{
			var el = this;
			$.getJSON(url,
				params,
				function(r)
				{
					$(el).addOption(r, select);
					if(typeof fn == "function")
					{
						if(typeof args == "object")
						{
							fn.apply(el, args);
						} 
						else
						{
							fn.call(el);
						}
					}
				}
			);
		}
	);
	return this;
};

/**
 * Removes an option (by value or index) from a select box (or series of select boxes)
 *
 * @name     removeOption
 * @author   Sam Collett (http://www.texotela.co.uk)
 * @type     jQuery
 * @param    String|RegExp|Number what  Option to remove
 * @param    Boolean selectedOnly       (optional) Remove only if it has been selected (default false)   
 * @example  $("#myselect").removeOption("Value"); // remove by value
 * @example  $("#myselect").r