Page({
  data: {
    contactWays: [
      {
        title: '客服邮箱',
        value: 'xiao_shi_jie@126.com',
        icon: '✉️',
        copyable: true
      },
      {
        title: '工作时间',
        value: '周一至周五 9:00-18:00',
        icon: '🕒',
        copyable: false
      },
      {
        title: '官方微信',
        value: 'xiaoshijie_wx',
        icon: '💬',
        copyable: true
      }
    ],
    faqs: [
      {
        question: '如何获得小树奖励？',
        answer: '您可以通过参与时城竞答或城市漫游活动获得小树奖励。在竞答中答对问题、参与阵营对战或完成城市漫游任务都可以获得相应数量的小树。'
      },
      {
        question: '小树有什么用途？',
        answer: '小树是晓时节的虚拟奖励，可以用来兑换一些特殊功能和内容，例如获取更多城市解锁机会、特殊的节气主题等。'
      },
      {
        question: '为什么我的足迹没有记录？',
        answer: '足迹需要您在漫游城市时完成一定的互动或阅读任务才会记录。如果您只是浏览了城市介绍但没有完成相关互动，则不会留下足迹。'
      },
      {
        question: '如何分享我的足迹？',
        answer: '在"我的足迹"页面，点击单个足迹或者"分享"按钮，即可将您的足迹分享给好友或朋友圈。'
      }
    ]
  },
  
  copyText(e) {
    const text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success() {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        });
      }
    });
  },
  
  onShareAppMessage() {
    return {
      title: '联系客服 - 晓时节',
      path: '/pages/cloudDwelling/index'
    };
  }
}) 
 
 
 
 
 
 