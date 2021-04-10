module.exports = {
  theme: 'reco',
  title: '猫窝',
  head: [
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,user-scalable=no',
      },
    ],
  ],
  themeConfig: {
    type: 'blog',
    subSidebar: 'auto',
    logo: '/images/avatar.jpg',
    // author
    author: 'lidamao',
    authorAvatar: '/images/avatar.jpg',
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Category',
        items: [
          { text: 'Linux', link: '/categories/Linux/' },
          { text: 'Frontend', link: '/categories/Frontend/' },
          { text: 'PHP', link: '/categories/PHP/' },
          { text: 'Python', link: '/categories/Python/' },
        ],
      },
      {
        text: 'Tag',
        link: '/tag/',
      },
      { text: 'TimeLine', link: '/timeline/', icon: 'reco-date' },
    ],
    // 博客配置
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: 'Category', // 默认文案 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: 'Tag', // 默认文案 “标签”
      },
      socialLinks: [
        // 信息栏展示社交信息
      ],
    },
    // 备案
    record: '豫ICP备2020032528号-1',
    recordLink: 'http://beian.miit.gov.cn',
    cyberSecurityRecord: '豫公网安备 41018202000759号',
    cyberSecurityLink:
      'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41018202000759',
    // 项目开始时间，只填写年份
    startYear: '2020',
  },
};
