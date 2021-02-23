'use strict'
;(function({ BloggerData }) {
  const bloggerData = BloggerData({
    css: {
      highlight: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/styles/default.min.css',
      'highlight-markdown': 'https://bloggerdata.surge.sh/helloimnote/highlight.markdown.css'
    },
    libs: {
      highlight: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/highlight.min',
      'markdown-it': 'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.0.4/markdown-it.min',
      jquery: 'https://code.jquery.com/jquery-3.5.1.slim.min'
    }
  })
  bloggerData.init({
    fn: o => bloggerData.getLibs({ 'highlight': 'hljs', 'markdown-it': 'MarkdownIt', 'jquery': '$', 'lodash': '_' })
      .then(({ ...libs }) => ({ ...o, ...libs })).then(o => {
      const { React, ReactDOM, hljs, MarkdownIt, $ } = o
      // HeaderTitleBar
      const getHeaderTitleBar = function(titleText) {
        const HeaderTitleBar = function() {
          const [title, setTitle] = React.useState(titleText)
          return React.createElement('h1', { className: 'title', onClick: function() { setTitle('hahaho') } }, title)
        }
        return HeaderTitleBar
      }
      const orgTitle = document.querySelector('#header-inner .titlewrapper h1.title').textContent
      ReactDOM.render(React.createElement(getHeaderTitleBar(orgTitle)), document.querySelector('#header-inner .titlewrapper'))
      // CodeBox
      const getCodeBox = function(markdownDiv, { $, hljs, md }) {
        const getParsedReactElements = (list) => list.map((o, key) => typeof o === 'string' ? o : React.createElement(o.tagName, { key, className: o.className }, getParsedReactElements(o.value)))
        const getParsedNodes = (nodes) => [...nodes]
          .map(el => el.nodeName === '#text'
            ? el.nodeValue
            : ({
              tagName: el.tagName.toLowerCase(),
              className: el.className,
              value: getParsedNodes(el.childNodes) 
            }))
        const preCode = markdownDiv.innerHTML
        const $code = $(md.render(preCode))
        const orgCodes = getParsedNodes($code)
        const CodeBox = function() {
          const [codes] = React.useState(orgCodes)
          React.useEffect(() => {
            markdownDiv.querySelectorAll('pre code').forEach(el => {
              hljs.highlightBlock(el)
            })
          }, [codes])
          return React.createElement(
            'pre',
            null,
            ...getParsedReactElements(codes)
          )
        }
        return CodeBox
      }
      
      const md = MarkdownIt()
      ;[...document.querySelectorAll('noscript.original-content')].forEach(el => {
        const innerHTML = el.innerHTML
        el.parentElement.querySelector('.csr-content').innerHTML = innerHTML
        ;[...el.nextElementSibling.querySelectorAll('.markdown')].forEach(markdown => {
          const CodeBox = getCodeBox(markdown, { $, hljs, md })
          ReactDOM.render(React.createElement(CodeBox), markdown)
        })
      })
    })
  })
})(window)
