<?php
/*
Plugin Name: AI Code Highlighter
Plugin URI: http://andreii.org/product/wordpress-code-highlighter/
Description: Highlight your code using Googles Code Prettify Script. Simply press the button on editor toolbar and paste your code. The plugin does all the rest.
Version: 1.3
Author: Andrei Ionescu
Author URI: http://andreii.org/
License: GPL2 - GNU General Public License, version 2
*/

/*  Copyright 2014  Andrei Ionescu  (email : andreii@andreii.org)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
    or simply vizit <http://www.gnu.org/licenses/>
*/

/** Load JavaScript to header  */
add_action( 'wp_enqueue_scripts', 'andreii_codehighliter_add_scripts' );

function andreii_codehighliter_add_scripts() {
	if ( ! is_admin() ) 
	{
		wp_enqueue_script( 'prettify', plugin_dir_url( __FILE__ ) . 'prettify/prettify.js', '', '', true );
	}
}

add_action( 'wp_enqueue_scripts', 'andreii_add_codehighliter' );

function andreii_add_codehighliter() {
	if ( ! is_admin() ) 
	{
		wp_enqueue_script( 'run-prettify', plugin_dir_url( __FILE__ ) . 'prettify/run_prettify.js?autoload=true&skin=sunburst', '', '', true );
	}
}

if ( ! defined( 'ABSPATH' ) )
	die( "Can't load this file directly" );

class aicodehighliter
{
	function __construct() {
		add_action( 'admin_init', array( $this, 'action_admin_init' ) );
	}
	
	function action_admin_init() {
		// only hook up these filters if we're in the admin panel, and the current user has permission
		// to edit posts and pages
		if ( current_user_can( 'edit_posts' ) && current_user_can( 'edit_pages' ) ) {
			add_filter( 'mce_buttons', array( $this, 'filter_mce_button' ) );
			add_filter( 'mce_external_plugins', array( $this, 'filter_mce_plugin' ) );
		}
	}
	
	function filter_mce_button( $buttons ) {
		// add a separation before our button, here our button's id is "ai-code-highliter_button"
		array_push( $buttons, '|', 'ai-code-highliter_button' );
		return $buttons;
	}
	
	function filter_mce_plugin( $plugins ) {
		// this plugin file will work the magic of our button
		$plugins['ai-code-highliter'] = plugin_dir_url( __FILE__ ) . 'ai-code-highliter_plugin.js?plugin_folder=' . plugin_dir_url( __FILE__ );
		return $plugins;
	}
}

$aicodehighliter = new aicodehighliter();