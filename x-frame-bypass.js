customElements.define('x-frame-bypass', class extends HTMLIFrameElement {
	constructor () {
		super()
	}
	connectedCallback () {
		this.load(this.src)
		this.src = ''
	}
	load (url, options) {
		if (!url || !url.startsWith('http'))
			throw new Error('src does not start with http(s)://')
		console.log('Loading X-Frame-Bypass:', url)
		this.srcdoc = `<html>
<head>
	<style>
	.loader {
		position: absolute;
		top: calc(50% - 25px);
		left: calc(50% - 25px);
		width: 50px;
		height: 50px;
		background-color: #333;
		border-radius: 50%;  
		animation: loader 1s infinite ease-in-out;
	}
	@keyframes loader {
		0% {
		transform: scale(0);
		}
		100% {
		transform: scale(1);
		opacity: 0;
		}
	}
	</style>
</head>
<body>
	<div class="loader"></div>
</body>
</html>`
		this.fetchProxy(url, options, 0).then(res => res.text()).then(data => {
			if (data)
				this.srcdoc = data.replace(/<head>/i, `<head>
	<base href="${url}">
	<script>
	// X-Frame-Bypass navigation event handlers
	document.addEventListener("click", e => {
		if (frameElement && document.activeElement && document.activeElement.href) {
			e.preventDefault()
			frameElement.load(document.activeElement.href)
		}
	})
	document.addEventListener("submit", e => {
		if (frameElement && document.activeElement && document.activeElement.form) {
			e.preventDefault()
			if (document.activeElement.form.method === 'post')
				frameElement.load(document.activeElement.form.action, {method: 'post', body: new FormData(document.activeElement.form)})
			else
				frameElement.load(document.activeElement.form.action + '?' + new URLSearchParams(new FormData(document.activeElement.form)))
		}
	})
	</script>`)
		}).catch(e => console.error('Cannot load X-Frame-Bypass:', e))
	}
	fetchProxy (url, options, i) {
		const proxy = [
			'https://cors-anywhere.herokuapp.com/',
			'https://cors.io/?',
			'https://jsonp.afeld.me/?url='
		]
		return fetch(proxy[i] + url, options).catch(error => {
			if (i === proxy.length - 1)
				throw error
			return this.fetchProxy(url, options, i + 1)
		})
	}
}, {extends: 'iframe'})