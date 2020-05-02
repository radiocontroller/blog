module.exports = {
  title: '骑摩托的rcer',
  description: '山路老头乐，赛道小罗西!',
  head: [
    ['meta', { name: 'keywords', content: '骑摩托的rcer' }],
    ['link', { rel: "icon", href: "/favicon.png"}]
  ],
  markdown: {
    lineNumbers: false
  },
  themeConfig: {
    // repo: 'radiocontroller/moto',
    // editLinks: true,
    // docsRepo: 'radiocontroller/moto',
    docsDir: 'docs',
    // editLinkText: 'Edit this page on GitHub',
    // lastUpdated: 'Last Updated',
    nav: [
      { text: '日常溜车', link: '/travel/' },
      { text: '骑行装备', link: '/equip/' },
      { text: '联系方式', link: '/about/contact' }
    ],
    sidebar: {
      '/travel/': require('./conf/sidebar/travel'),
      '/equip/': require('./conf/sidebar/equip')
    }
  }
};