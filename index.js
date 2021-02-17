'use strict'
;(function() {
  // from https://github.com/tserkov/vue-plugin-load-script/blob/master/index.js
  let loadScript = function (src) {
    return new Promise(function (resolve, reject) {
      let shouldAppend = false
      let el = document.querySelector('script[src="' + src + '"]')
      if (!el) {
        el = document.createElement('script')
        el.type = 'text/javascript'
        el.async = true
        el.src = src
        shouldAppend = true
      } else if (el.hasAttribute('data-loaded')) {
        resolve(el)
        return
      }

      el.addEventListener('error', reject)
      el.addEventListener('abort', reject)
      el.addEventListener('load', function loadScriptHandler() {
        el.setAttribute('data-loaded', true)
        resolve(el)
      })

      if (shouldAppend) { document.head.appendChild(el) }
    })
  }
  // eslint-disable-next-line no-unused-vars
  let unloadScript = function (src) {
    // eslint-disable-line no-param-reassign
    return new Promise(function (resolve, reject) {
      const el = document.querySelector('script[src="' + src + '"]')

      if (!el) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject()
        return
      }

      document.head.removeChild(el)

      resolve()
    })
  }
  loadScript('https://unpkg.com/requirejs@2.3.6/require.js')
    .then(() => {
      const { requirejs, require } = window
      requirejs.config({
        paths: {
          react: 'https://unpkg.com/react@17/umd/react.production.min',
          'react-dom': 'https://unpkg.com/react-dom@17/umd/react-dom.production.min'
        }
      })
      require(['react', 'react-dom'], function(React, ReactDOM) {
        // console.log('React', React)
        // console.log('ReactDOM', ReactDOM)
        const orgTitle = document.querySelector('#header-inner .titlewrapper h1.title').textContent
        const HeaderTitleBar = function() {
          const [title, setTitle] = React.useState(orgTitle)
          return React.createElement('h1', { class: 'title', onClick: function() { setTitle('hahaho') } }, title)
        }
        ReactDOM.render(React.createElement(HeaderTitleBar), document.querySelector('#header-inner .titlewrapper'))
      })
    })
})(window)
