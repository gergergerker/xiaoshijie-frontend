Page({
  data: {
    title: '用户协议',
    content: [],
    isLoading: true
  },
  
  onLoad(options) {
    const type = options.type || 'user';
    
    if (type === 'user') {
      this.setData({
        title: '用户协议',
        content: this.getUserAgreementContent(),
        isLoading: false
      });
    } else if (type === 'privacy') {
      this.setData({
        title: '隐私政策',
        content: this.getPrivacyPolicyContent(),
        isLoading: false
      });
    }
  },
  
  getUserAgreementContent() {
    return [
      {
        title: '1. 接受条款',
        paragraphs: [
          '欢迎使用晓时节服务。请您在使用晓时节服务前仔细阅读本协议的全部内容。当您注册、使用晓时节服务时，即表示您已充分阅读、理解并接受本协议的全部内容，并与晓时节达成协议。',
          '如您不同意本协议的任何内容，请勿注册或使用晓时节服务。'
        ]
      },
      {
        title: '2. 服务内容',
        paragraphs: [
          '晓时节服务是基于二十四节气的文化探索小程序，致力于传承和推广中国传统节气文化。',
          '晓时节服务的具体内容由晓时节根据实际情况提供，包括但不限于节气知识探索、城市文化漫游、节气知识竞答等。'
        ]
      },
      {
        title: '3. 用户行为规范',
        paragraphs: [
          '用户在使用晓时节服务时，必须遵守中华人民共和国相关法律法规的规定，不得利用晓时节服务进行任何违法或不当的活动，包括但不限于：',
          '(1) 发布、传送、传播、储存违反国家法律法规禁止的内容；',
          '(2) 发布、传送、传播、储存侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的内容；',
          '(3) 恶意使用、干扰、破坏晓时节服务；',
          '(4) 其他违反法律法规、社会公德、公序良俗的行为。'
        ]
      },
      {
        title: '4. 知识产权',
        paragraphs: [
          '晓时节服务中的所有内容，包括但不限于文字、图片、音频、视频、软件、程序、版面设计等均受著作权、商标权及其他相关法律法规的保护。',
          '未经晓时节或相关权利人书面许可，任何人不得以任何形式进行使用或创造相关衍生作品。'
        ]
      },
      {
        title: '5. 免责声明',
        paragraphs: [
          '在法律允许的范围内，晓时节不承担因用户使用晓时节服务而产生的任何直接、间接、偶然、特殊或后果性的损害。',
          '晓时节不保证服务一定能满足用户的要求，也不保证服务不会中断，对服务的及时性、安全性、准确性也不作保证。'
        ]
      },
      {
        title: '6. 协议修改',
        paragraphs: [
          '晓时节有权在必要时修改本协议条款，协议条款一旦发生变动，将会在相关页面上提示修改内容。',
          '如果用户不同意修改后的条款，可以停止使用晓时节服务；如果用户继续使用晓时节服务，则视为接受修改后的协议。'
        ]
      },
      {
        title: '7. 法律管辖',
        paragraphs: [
          '本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。',
          '如发生晓时节服务条款与中华人民共和国法律相抵触时，则这些条款将完全按法律规定重新解释，而其他条款则依旧具有法律效力。'
        ]
      }
    ];
  },
  
  getPrivacyPolicyContent() {
    return [
      {
        title: '1. 引言',
        paragraphs: [
          '晓时节团队（以下简称"我们"）非常重视用户的隐私和个人信息保护。本隐私政策旨在向您说明我们如何收集、使用、存储和分享您的个人信息，以及您如何访问、更新、控制和保护您的个人信息。',
          '请您在使用晓时节服务前仔细阅读本隐私政策的全部内容。'
        ]
      },
      {
        title: '2. 我们收集的信息',
        paragraphs: [
          '为了向您提供服务，我们可能会收集以下信息：',
          '(1) 您主动提供的信息：包括但不限于您在注册、使用晓时节服务过程中提供的个人信息，如用户名、联系方式等；',
          '(2) 我们在您使用晓时节服务过程中自动收集的信息：包括但不限于设备信息、位置信息、日志信息等；',
          '(3) 我们从第三方获得的您的信息：如果您使用微信登录晓时节，我们可能会收到您的微信头像、昵称等基本信息。'
        ]
      },
      {
        title: '3. 信息的使用',
        paragraphs: [
          '我们可能将收集的信息用于以下目的：',
          '(1) 向您提供晓时节服务；',
          '(2) 改进、优化晓时节服务；',
          '(3) 开展内部审计、数据分析和研究；',
          '(4) 管理用户账号；',
          '(5) 经您授权的其他用途。'
        ]
      },
      {
        title: '4. 信息的共享与披露',
        paragraphs: [
          '除非获得您的明确同意，或法律法规另有规定，我们不会与任何第三方分享您的个人信息。',
          '我们可能会在以下情况下共享、转让、公开披露您的个人信息：',
          '(1) 获得您的明确同意；',
          '(2) 根据法律法规、法律程序的要求；',
          '(3) 为保护晓时节、我们的用户或公众的权益、财产或安全免遭损害；',
          '(4) 在涉及合并、收购、资产转让或类似的交易时。'
        ]
      },
      {
        title: '5. 信息的保护',
        paragraphs: [
          '我们致力于保护您的个人信息安全。我们使用各种安全技术和程序，以防信息的丢失、不当使用、未经授权阅览或披露。',
          '请您理解，由于技术的限制以及可能存在的各种恶意手段，即便我们尽最大努力加强安全措施，也不可能始终保证信息百分之百的安全。'
        ]
      },
      {
        title: '6. 您的权利',
        paragraphs: [
          '您对您的个人信息拥有以下权利：',
          '(1) 访问、更新、删除您的个人信息；',
          '(2) 要求我们限制对您个人信息的处理；',
          '(3) 反对我们处理您的个人信息；',
          '(4) 要求我们提供您个人信息的副本。'
        ]
      },
      {
        title: '7. 隐私政策的更新',
        paragraphs: [
          '我们可能会不时更新本隐私政策。当我们这样做时，我们会在晓时节上发布更新后的隐私政策，并更新"最后更新"日期。',
          '我们建议您定期查看本隐私政策，以了解我们如何保护您的信息。'
        ]
      },
      {
        title: '8. 联系我们',
        paragraphs: [
          '如果您对本隐私政策有任何疑问、意见或建议，请通过以下方式与我们联系：',
          '电子邮件：xiao_shi_jie@126.com'
        ]
      }
    ];
  },
  
  onShareAppMessage() {
    return {
      title: this.data.title + ' - 晓时节',
      path: '/pages/cloudDwelling/index'
    };
  }
}) 
 
 
 
 
 
 