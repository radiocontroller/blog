module.exports = {
  title: '山路老头乐',
  description: '联系邮箱：302643159@qq.com',
  head: [
    ['meta', { name: 'keywords', content: 'motor,program' }],
    ['link', { rel: "icon", href: "/favicon.png"}]
  ],
  markdown: {
    lineNumbers: false
  },
  plugins: [
    '@vuepress/active-header-links',
    '@vuepress/pagination',
    '@vuepress/medium-zoom',
    '@vuepress/back-to-top',
  ],
  themeConfig: {
    repo: 'radiocontroller/motor',
    // editLinks: true,
    // docsRepo: 'radiocontroller/moto',
    docsDir: 'docs',
    // editLinkText: 'Edit this page on GitHub',
    // lastUpdated: 'Last Updated',
    nav: [
      { text: '日常溜车', link: '/travel/' },
      // { text: '骑行装备', link: '/equip/' },
      { text: '程序相关', link: '/program/' }
      // { text: '联系方式', link: '/about/contact' }
    ],
    sidebar: {
      '/travel/': require('./conf/sidebar/travel'),
      // '/equip/': require('./conf/sidebar/equip'),
      '/program/': require('./conf/sidebar/program')
    }
  }
};