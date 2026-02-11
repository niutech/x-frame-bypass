customElements.define('x-frame-bypass', class extends HTMLIFrameElement {
	static get observedAttributes() {
		return ['src']
	}
	constructor () {
		super()
	}
	attributeChangedCallback () {
		this.load(this.src)
	}
	connectedCallback () {
		if (!this.getAttribute('sandbox')) this.sandbox = 'allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-top-navigation-by-user-activation'
		this._onMessage = e => {
			if (e.source === this.contentWindow && e.data && e.data.type === 'X-Frame-Bypass-Load') {
				this.load(e.data.url, e.data.options)
			}
		}
		window.addEventListener('message', this._onMessage)
	}
	disconnectedCallback () {
		window.removeEventListener('message', this._onMessage)
	}
	load (url, options) {
		if (!url) return
		if (!url.startsWith('http')) throw new Error('X-Frame-Bypass src ' + url + ' does not start with http(s)://')
		console.log('X-Frame-Bypass loading:', url)
		this.srcdoc = '<!DOCTYPE html><html><head><style>.loader {position: absolute;top: calc(50% - 25px);left: calc(50% - 25px);width: 50px;height: 50px;background-color: #333;border-radius: 50%;animation: loader 1s infinite ease-in-out;}@keyframes loader {0% {transform: scale(0);}100% {transform: scale(1);opacity: 0;}}</style></head><body><div class="loader"></div></body></html>'
		if (options && options.body && !(options.body instanceof FormData)) {
			const formData = new FormData()
			Object.entries(options.body).forEach(([key, value]) => formData.append(key, value))
			options.body = formData
		}
		this.fetchProxy(url, options, 0).then(res => res.text()).then(data => {
			if (!data) return
			const script = `<script>
	// X-Frame-Bypass navigation event handlers
	document.addEventListener('click', e => {
		const a = e.target.closest('a')
		if (a && a.href) {
			if (a.target && a.target !== '_self') return
			e.preventDefault()
			window.parent.postMessage({type: 'X-Frame-Bypass-Load', url: a.href}, '*')
		}
	})
	document.addEventListener('submit', e => {
		e.preventDefault()
		const form = e.target
		const formData = new FormData(form)
		if (form.method === 'post') {
			const body = {}
			formData.forEach((value, key) => { body[key] = value })
			window.parent.postMessage({type: 'X-Frame-Bypass-Load', url: form.action, options: {method: 'post', body}}, '*')
		} else {
			window.parent.postMessage({type: 'X-Frame-Bypass-Load', url: form.action + '?' + new URLSearchParams(formData)}, '*')
		}
	})
</script>`
			let html = data.replace(/<head([^>]*)>/i, '<head$1><base href="' + url + '">' + script)
			if (html === data) {
				html = '<base href="' + url + '">' + script + data
			}
			this.srcdoc = html.replace(/ crossorigin=['"][^'"]*['"]/gi, '')
		}).catch(e => console.error('Cannot load X-Frame-Bypass:', e))
	}
	fetchProxy (url, options, i) {
		const proxies = (options || {}).proxies || (this.getAttribute('proxies') ? this.getAttribute('proxies').split(',') : [
			'https://api.allorigins.win/raw?url=',
			'https://api.codetabs.com/v1/proxy/?quest=',
			'https://cors-anywhere.herokuapp.com/'
		])
		if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) {
			return fetch(url, options).then(res => {
				if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
				return res
			})
		}
		return fetch(proxies[i] + encodeURIComponent(url), options).then(res => {
			if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
			return res
		}).catch(error => {
			if (i === proxies.length - 1) throw error
			return this.fetchProxy(url, options, i + 1)
		})
	}
}, {extends: 'iframe'})
