const remarkEmoji = require('remark-emoji')
const remarkOembed = require('remark-oembed')
const remarkSmartypants = require('@ngsctt/remark-smartypants')
const remarkExternalLinks = require('remark-external-links')
const remarkSlug = require('remark-slug')

module.exports = {
    remarkPlugins: [
        remarkEmoji,
        remarkOembed,
        remarkSmartypants,
        remarkExternalLinks,
        remarkSlug
    ],
    rehypePlugins: []
}