customElements.define('x-frame', class extends HTMLIFrameElement {
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
		console.log('Loading X-Frame:', url)
		this.fetchProxy(url, options, 0).then(res => res.text()).then(data => {
			if (data)
				this.srcdoc = data.replace(/<head>/i, `<head>
	<base href="${url}">
	<script>
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
		}).catch(e => console.error('Cannot load X-Frame:', e))
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