# X-Frame-Bypass

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/x-frame-bypass)

X-Frame-Bypass is a [Web Component](https://www.webcomponents.org/introduction), specifically a [Customized Built-in Element](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example), which extends an IFrame to bypass the [`X-Frame-Options: deny/sameorigin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) response header. Normally such headers prevent embedding a web page in an `<iframe>` element, but X-Frame-Bypass is using a CORS proxy to allow this.

## Usage

1. (Optional) Include the [Custom Elements with Built-in Extends polyfill](https://github.com/ungap/custom-elements-builtin) for Safari:

		<script src="https://unpkg.com/@ungap/custom-elements-builtin"></script>

2. Include the X-Frame-Bypass JS module:

		<script type="module" src="https://unpkg.com/x-frame-bypass"></script>

3. Insert the X-Frame-Bypass Custom Element:

		<iframe is="x-frame-bypass" src="https://example.org/"></iframe>

## Demo

See the [Hacker News using X-Frame-Bypass](https://niutech.github.io/x-frame-bypass/). Supported are current versions of Chrome and Firefox browsers. Edge and Safari do not support Customized Built-in Elements yet.

## License

&copy; 2019 Jerzy Głowacki under Apache License 2.0.
