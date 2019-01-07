# X-Frame

X-Frame is a [Web Component](https://www.webcomponents.org/introduction), specifically a [Customized Built-in IFrame Element](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example), which was extended to bypass [X-Frame-Options: deny/sameorigin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) response header. Normally such headers prevent embedding a web page in an `<iframe>` element, but X-Frame is using a CORS proxy to allow this.

## Usage

First include the Web Components polyfill:

	<script src="https://unpkg.com/@webcomponents/webcomponentsjs@2.2.1/webcomponents-loader.js"></script>

Then include the X-Frame JS module:

	<script src="x-frame.js" type="module"></script>

Finally insert the X-Frame Custom Element:

	<iframe is="x-frame" src="https://news.ycombinator.com/"></iframe>

Supported are the current versions of Chrome and Firefox browsers.

## Demo

See the [Hacker News in an X-Frame](https://niutech.github.io/x-frame/).

## License

&copy; 2019 Jerzy Głowacki under Apache License 2.0.
