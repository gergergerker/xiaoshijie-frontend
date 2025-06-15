Page({
  data: {
    chapter: '',
    type: '',
    title: '',
    images: [],
    loading: true,
    audioContext: null,
    isPlaying: false,
    currentPlayingIndex: -1,
    area: '',
    term: '',
    season: '',
    apiBaseUrl: 'https://api.timemuseum.domain',  // 配置API基础URL
    uploadConfig: {
      imageUrl: '/upload/image',
      audioUrl: '/upload/audio',
      maxImageSize: 5, // MB
      maxAudioSize: 10, // MB
      supportedImageFormats: ['jpg', 'jpeg', 'png'],
      supportedAudioFormats: ['mp3', 'wav']
    }
  },

  onLoad: function(options) {
    const { type, chapter, area, term, season, title } = options;
    
    if (!type || (type === 'city' && !chapter) || (type === 'season' && !area) 
        || (type === 'seasonIntro' && !season)) {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }

    this.setData({
      type,
      chapter: chapter || '',
      area: area || '',
      term: term || '',
      season: season || '',
      title: title || '',
      loading: true
    });

    // 创建音频上下文
    this.audioContext = wx.createInnerAudioContext();
    this.audioContext.onEnded(() => {
      this.setData({
        isPlaying: false,
        currentPlayingIndex: -1
      });
    });
    
    this.audioContext.onError((res) => {
      console.log('音频播放错误:', res);
      wx.showToast({
        title: '音频加载失败',
        icon: 'none'
      });
      this.setData({
        isPlaying: false,
        currentPlayingIndex: -1
      });
    });

    // 获取标题
    if (!title) {
      this.getTitle(type, chapter, area, term, season);
    }
    
    // 加载图片和相关内容
    this.loadContent(type, chapter, area, term, season);
  },

  getTitle: function(type, chapter, area, term, season) {
    let title = '';
    
    if (type === 'city') {
      switch(chapter) {
        case 'concept': title = '城市概念篇'; break;
        case 'origin': title = '城市起源篇'; break;
        case 'ancient': title = '古城篇'; break;
        case 'scale': title = '规模篇'; break;
        case 'function': title = '职能篇'; break;
        case 'location': title = '位置篇'; break;
        case 'form': title = '形态篇'; break;
        case 'capital': title = '首都篇'; break;
        case 'literature': title = '名著篇'; break;
        case 'ranking': title = '名称篇'; break;
        default: title = '城市百科';
      }
    } else if (type === 'season') {
      // 根据区域生成标题
      switch(area) {
        case 'astronomy': title = '节气天文篇'; break;
        case 'climate': title = '节气气候篇'; break;
        case 'tools': title = '节气工具篇'; break;
        case 'calendar': title = '节气历法篇'; break;
        case 'crops': title = '节气作物篇'; break;
        case 'painting': title = '节气绘画篇'; break;
        case 'literature': title = '节气文学篇'; break;
        case 'music': title = '节气音乐篇'; break;
        default: title = '节气文化';
      }
    } else if (type === 'seasonIntro') {
      // 季节介绍页标题已由调用页面传入
      return;
    } else if (type === 'solarTerm') {
      title = `${term} 节气详解`;
    }
    
    this.setData({ title });
  },

  loadContent: function(type, chapter, area, term, season) {
    // 这里应该向后端API请求获取内容数据
    // 例如: GET /api/content?type=seasonIntro&season=spring
    
    // 实际项目中，下面的API调用代码将替代模拟数据
    /*
    wx.request({
      url: `${this.data.apiBaseUrl}/content`,
      data: {
        type: type,
        chapter: chapter,
        area: area,
        term: term,
        season: season
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          this.setData({
            images: res.data.images,
            loading: false
          });
        } else {
          this.handleAPIError();
        }
      },
      fail: () => {
        this.handleAPIError();
      }
    });
    */
    
    // 模拟数据
    this.loadImages(type, chapter, area, term, season);
  },

  loadImages: function(type, chapter, area, term, season) {
    // 模拟API请求获取图片列表
    // 实际应用中，这里会向后端请求获取对应章节的图片资源
    
    // 示例：模拟两张A4纸图片（示意图片上传区域）
    const mockImages = [
      { 
        url: '../../images/placeholder-a4.svg', 
        width: 595, // A4纸宽度 (72dpi)
        height: 842, // A4纸高度 (72dpi)
        audioUrl: '', // 音频API将返回的URL
        isPlaceholder: true, // 标记为占位图，实际项目中会由后端上传的真实图片替换
      },
      { 
        url: '../../images/placeholder-a4.svg', 
        width: 595,
        height: 842,
        audioUrl: '',
        isPlaceholder: true,
      }
    ];
    
    if (type === 'city') {
      // 模拟不同章节有不同数量的图片
      if (chapter === 'concept') {
        // 概念篇有3张
        mockImages.push({
          url: '../../images/placeholder-a4.svg',
          width: 595,
          height: 842,
          audioUrl: '',
          isPlaceholder: true,
        });
      } else if (chapter === 'origin') {
        // 起源篇有1张
        mockImages.pop();
      }
    } else if (type === 'season') {
      // 模拟不同区域有不同数量的图片
      if (area === 'astronomy' || area === 'literature') {
        // 天文篇和文学篇有3张
        mockImages.push({
          url: '../../images/placeholder-a4.svg',
          width: 595,
          height: 842,
          audioUrl: '',
          isPlaceholder: true,
        });
      } else if (area === 'tools' || area === 'music') {
        // 工具篇和音乐篇有1张
        mockImages.pop();
      }
    } else if (type === 'seasonIntro') {
      // 季节介绍页的内容
      if (season === 'all') {
        // 总体介绍有3张
        mockImages.push({
          url: '../../images/placeholder-a4.svg',
          width: 595,
          height: 842,
          audioUrl: '',
          isPlaceholder: true,
        });
      }
    }
    
    // 模拟网络延迟
    setTimeout(() => {
      this.setData({
        images: mockImages,
        loading: false
      });
    }, 800);
  },

  // 上传图片
  uploadImage: function() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        const fileSize = res.tempFiles[0].size / (1024 * 1024); // 转换为MB
        
        // 检查文件大小
        if (fileSize > this.data.uploadConfig.maxImageSize) {
          wx.showToast({
            title: `图片不能超过${this.data.uploadConfig.maxImageSize}MB`,
            icon: 'none'
          });
          return;
        }
        
        // 检查文件格式
        const extension = tempFilePath.substring(tempFilePath.lastIndexOf('.') + 1).toLowerCase();
        if (!this.data.uploadConfig.supportedImageFormats.includes(extension)) {
          wx.showToast({
            title: '请上传JPG或PNG格式图片',
            icon: 'none'
          });
          return;
        }
        
        // 显示上传中提示
        wx.showLoading({
          title: '正在上传...',
        });
        
        // 上传图片到服务器
        wx.uploadFile({
          url: this.data.apiBaseUrl + this.data.uploadConfig.imageUrl,
          filePath: tempFilePath,
          name: 'image',
          formData: {
            'type': this.data.type,
            'chapter': this.data.chapter,
            'area': this.data.area,
            'term': this.data.term,
            'season': this.data.season
          },
          success: (uploadRes) => {
            wx.hideLoading();
            
            const data = JSON.parse(uploadRes.data);
            if (data.success) {
              wx.showToast({
                title: '上传成功',
              });
              
              // 重新加载内容
              this.loadContent(
                this.data.type, 
                this.data.chapter, 
                this.data.area, 
                this.data.term,
                this.data.season
              );
            } else {
              wx.showToast({
                title: data.message || '上传失败',
                icon: 'none'
              });
            }
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            });
          }
        });
      }
    });
  },
  
  // 上传音频
  uploadAudio: function(e) {
    const { index } = e.currentTarget.dataset;
    
    wx.chooseMedia({
      count: 1,
      mediaType: ['audio'],
      sourceType: ['album'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        const fileSize = res.tempFiles[0].size / (1024 * 1024); // 转换为MB
        
        // 检查文件大小
        if (fileSize > this.data.uploadConfig.maxAudioSize) {
          wx.showToast({
            title: `音频不能超过${this.data.uploadConfig.maxAudioSize}MB`,
            icon: 'none'
          });
          return;
        }
        
        // 检查文件格式
        const extension = tempFilePath.substring(tempFilePath.lastIndexOf('.') + 1).toLowerCase();
        if (!this.data.uploadConfig.supportedAudioFormats.includes(extension)) {
          wx.showToast({
            title: '请上传MP3或WAV格式音频',
            icon: 'none'
          });
          return;
        }
        
        // 显示上传中提示
        wx.showLoading({
          title: '正在上传...',
        });
        
        // 上传音频到服务器
        wx.uploadFile({
          url: this.data.apiBaseUrl + this.data.uploadConfig.audioUrl,
          filePath: tempFilePath,
          name: 'audio',
          formData: {
            'type': this.data.type,
            'chapter': this.data.chapter,
            'area': this.data.area,
            'term': this.data.term,
            'season': this.data.season,
            'imageIndex': index
          },
          success: (uploadRes) => {
            wx.hideLoading();
            
            const data = JSON.parse(uploadRes.data);
            if (data.success) {
              wx.showToast({
                title: '上传成功',
              });
              
              // 更新当前图片的音频URL
              const newImages = [...this.data.images];
              newImages[index].audioUrl = data.audioUrl;
              
              this.setData({
                images: newImages
              });
            } else {
              wx.showToast({
                title: data.message || '上传失败',
                icon: 'none'
              });
            }
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            });
          }
        });
      }
    });
  },

  // 预览图片
  previewImage: function(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.images.map(img => img.url);
    
    wx.previewImage({
      current: urls[index],
      urls: urls
    });
  },

  // 播放音频
  playAudio: function(e) {
    const { index } = e.currentTarget.dataset;
    const { currentPlayingIndex, isPlaying } = this.data;
    
    // 如果当前有音频在播放
    if (isPlaying) {
      // 如果是同一个音频，则暂停播放
      if (currentPlayingIndex === index) {
        this.audioContext.pause();
        this.setData({
          isPlaying: false,
          currentPlayingIndex: -1
        });
        return;
      }
      
      // 如果是不同的音频，则停止当前正在播放的
      this.audioContext.stop();
    }
    
    // 实际应用中，这里会使用API返回的音频URL
    const audioUrl = this.data.images[index].audioUrl;
    
    if (!audioUrl) {
      wx.showToast({
        title: '该内容暂无音频',
        icon: 'none'
      });
      return;
    }
    
    this.audioContext.src = audioUrl;
    this.audioContext.play();
    
    this.setData({
      isPlaying: true,
      currentPlayingIndex: index
    });
  },
  
  // 返回上一页
  navigateBack: function() {
    wx.navigateBack({
      delta: 1
    });
  },
  
  // 处理API错误
  handleAPIError: function() {
    wx.showToast({
      title: '内容加载失败，请稍后再试',
      icon: 'none'
    });
    this.setData({
      loading: false
    });
  },

  onUnload: function() {
    // 页面卸载时停止并销毁音频
    if (this.audioContext) {
      this.audioContext.stop();
      this.audioContext.destroy();
    }
  }
});