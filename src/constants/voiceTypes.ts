import { VoiceTypes, ApiType } from '../types/tts';

// Voice types data organized by API type and categories
export const VOICE_TYPES_DATA: Record<ApiType, VoiceTypes> = {
  doubao: {
    '多情感': [
      { value: 'zh_male_beijingxiaoye_emo_v2_mars_bigtts', label: '北京小爷（多情感）' },
      { value: 'zh_female_roumeinvyou_emo_v2_mars_bigtts', label: '柔美女友（多情感）' },
      { value: 'zh_male_yangguangqingnian_emo_v2_mars_bigtts', label: '阳光青年（多情感）' },
      { value: 'zh_female_meilinvyou_emo_v2_mars_bigtts', label: '魅力女友（多情感）' },
      { value: 'zh_female_shuangkuaisisi_emo_v2_mars_bigtts', label: '爽快思思（多情感）' },
      { value: 'zh_female_tianxinxiaomei_emo_v2_mars_bigtts', label: '甜心小美（多情感）' },
      { value: 'zh_female_gaolengyujie_emo_v2_mars_bigtts', label: '高冷御姐（多情感）' },
      { value: 'zh_male_aojiaobazong_emo_v2_mars_bigtts', label: '傲娇霸总（多情感）' },
      { value: 'zh_male_guangzhoudege_emo_mars_bigtts', label: '广州德哥（多情感）' },
      { value: 'zh_male_jingqiangkanye_emo_mars_bigtts', label: '京腔侃爷（多情感）' },
      { value: 'zh_female_linjuayi_emo_v2_mars_bigtts', label: '邻居阿姨（多情感）' },
      { value: 'zh_male_yourougongzi_emo_v2_mars_bigtts', label: '优柔公子（多情感）' },
      { value: 'zh_male_ruyayichen_emo_v2_mars_bigtts', label: '儒雅男友（多情感）' },
      { value: 'zh_male_junlangnanyou_emo_v2_mars_bigtts', label: '俊朗男友（多情感）' },
      { value: 'zh_male_lengkugege_emo_v2_mars_bigtts', label: '冷酷哥哥（多情感）' },
      { value: 'en_male_glen_emo_v2_mars_bigtts', label: 'Glen' },
      { value: 'en_male_sylus_emo_v2_mars_bigtts', label: 'Sylus' },
      { value: 'en_female_candice_emo_v2_mars_bigtts', label: 'Candice' },
      { value: 'en_male_corey_emo_v2_mars_bigtts', label: 'Corey' },
      { value: 'en_female_nadia_tips_emo_v2_mars_bigtts', label: 'Nadia' },
      { value: 'en_female_skye_emo_v2_mars_bigtts', label: 'Serena' }
    ],
    '通用场景': [
      { value: 'zh_female_tianmeitaozi_mars_bigtts', label: '甜美桃子' },
      { value: 'zh_female_vv_mars_bigtts', label: 'Vivi' },
      { value: 'zh_female_cancan_mars_bigtts', label: '灿灿/Shiny' },
      { value: 'zh_female_qingxinnvsheng_mars_bigtts', label: '清新女声' },
      { value: 'zh_female_shuangkuaisisi_moon_bigtts', label: '爽快思思/Skye' },
      { value: 'zh_male_wennuanahu_moon_bigtts', label: '温暖阿虎/Alvin' },
      { value: 'zh_male_shaonianzixin_moon_bigtts', label: '少年梓辛/Brayan' },
      { value: 'zh_female_zhixingnvsheng_mars_bigtts', label: '知性女声' },
      { value: 'zh_male_qingshuangnanda_mars_bigtts', label: '清爽男大' },
      { value: 'zh_female_linjianvhai_moon_bigtts', label: '邻家女孩' },
      { value: 'zh_male_yuanboxiaoshu_moon_bigtts', label: '渊博小叔' },
      { value: 'zh_male_yangguangqingnian_moon_bigtts', label: '阳光青年' },
      { value: 'zh_female_tianmeixiaoyuan_moon_bigtts', label: '甜美小源' },
      { value: 'zh_female_qingchezizi_moon_bigtts', label: '清澈梓梓' },
      { value: 'zh_male_jieshuoxiaoming_moon_bigtts', label: '解说小明' },
      { value: 'zh_female_kailangjiejie_moon_bigtts', label: '开朗姐姐' },
      { value: 'zh_male_linjiananhai_moon_bigtts', label: '邻家男孩' },
      { value: 'zh_female_tianmeiyueyue_moon_bigtts', label: '甜美悦悦' },
      { value: 'zh_female_xinlingjitang_moon_bigtts', label: '心灵鸡汤' },
      { value: 'zh_male_wenrouxiaoge_mars_bigtts', label: '温柔小哥' },
      { value: 'zh_female_qinqienvsheng_moon_bigtts', label: '亲切女声' },
      { value: 'zh_male_qingyiyuxuan_mars_bigtts', label: '阳光阿辰' },
      { value: 'zh_male_xudong_conversation_wvae_bigtts', label: '快乐小东' },
      { value: 'en_male_jason_conversation_wvae_bigtts', label: '开朗学长' },
      { value: 'zh_female_sophie_conversation_wvae_bigtts', label: '魅力苏菲' }
    ],
    '多语种': [
      { value: 'en_male_smith_mars_bigtts', label: 'Smith (英式英语)' },
      { value: 'en_female_anna_mars_bigtts', label: 'Anna (英式英语)' },
      { value: 'en_male_adam_mars_bigtts', label: 'Adam (美式英语)' },
      { value: 'en_female_sarah_mars_bigtts', label: 'Sarah (澳洲英语)' },
      { value: 'en_male_dryw_mars_bigtts', label: 'Dryw (澳洲英语)' },
      { value: 'multi_male_jingqiangkanye_moon_bigtts', label: 'かずね（和音）/Javier (日语、西语)' },
      { value: 'multi_female_shuangkuaisisi_moon_bigtts', label: 'はるこ（晴子）/Esmeralda (日语、西语)' },
      { value: 'multi_male_wanqudashu_moon_bigtts', label: 'ひろし（広志）/Roberto (日语、西语)' },
      { value: 'multi_female_gaolengyujie_moon_bigtts', label: 'あけみ（朱美）(日语)' },
      { value: 'en_female_amanda_mars_bigtts', label: 'Amanda (美式英语)' },
      { value: 'en_male_jackson_mars_bigtts', label: 'Jackson (美式英语)' },
      { value: 'multi_zh_male_youyoujunzi_moon_bigtts', label: 'ひかる（光）(日语)' },
      { value: 'en_female_emily_mars_bigtts', label: 'Emily (英式英语)' },
      { value: 'zh_male_xudong_conversation_wvae_bigtts', label: 'Daniel (英式英语)' },
      { value: 'zh_male_M100_conversation_wvae_bigtts', label: 'Lucas (美式英语)' },
      { value: 'multi_female_maomao_conversation_wvae_bigtts', label: 'Diana (西语)' },
      { value: 'multi_male_M100_conversation_wvae_bigtts', label: 'Lucía (西语)' },
      { value: 'multi_female_sophie_conversation_wvae_bigtts', label: 'Sofía (西语)' },
      { value: 'multi_male_xudong_conversation_wvae_bigtts', label: 'Daníel (西语)' },
      { value: 'en_female_dacey_conversation_wvae_bigtts', label: 'Daisy (美式英语)' },
      { value: 'en_male_charlie_conversation_wvae_bigtts', label: 'Owen (美式英语)' },
      { value: 'en_female_sarah_new_conversation_wvae_bigtts', label: 'Luna (美式英语)' }
    ],
    '趣味口音': [
      { value: 'zh_male_jingqiangkanye_moon_bigtts', label: '京腔侃爷/Harmony (北京口音)' },
      { value: 'zh_female_wanwanxiaohe_moon_bigtts', label: '湾湾小何 (台湾口音)' },
      { value: 'zh_female_wanqudashu_moon_bigtts', label: '湾区大叔 (广东口音)' },
      { value: 'zh_female_daimengchuanmei_moon_bigtts', label: '呆萌川妹 (四川口音)' },
      { value: 'zh_male_guozhoudege_moon_bigtts', label: '广州德哥 (广东口音)' },
      { value: 'zh_male_beijingxiaoye_moon_bigtts', label: '北京小爷 (北京口音)' },
      { value: 'zh_male_haoyuxiaoge_moon_bigtts', label: '浩宇小哥 (青岛口音)' },
      { value: 'zh_male_guangxiyuanzhou_moon_bigtts', label: '广西远舟 (广西口音)' },
      { value: 'zh_female_meituojieer_moon_bigtts', label: '妹坨洁儿 (长沙口音)' },
      { value: 'zh_male_yuzhouzixuan_moon_bigtts', label: '豫州子轩 (河南口音)' }
    ],
    '角色扮演': [
      { value: 'zh_male_naiqimengwa_mars_bigtts', label: '奶气萌娃' },
      { value: 'zh_female_popo_mars_bigtts', label: '婆婆' },
      { value: 'zh_female_gaolengyujie_moon_bigtts', label: '高冷御姐' },
      { value: 'zh_male_aojiaobazong_moon_bigtts', label: '傲娇霸总' },
      { value: 'zh_female_meilinvyou_moon_bigtts', label: '魅力女友' },
      { value: 'zh_male_shenyeboke_moon_bigtts', label: '深夜播客' },
      { value: 'zh_female_sajiaonvyou_moon_bigtts', label: '柔美女友' },
      { value: 'zh_female_yuanqinvyou_moon_bigtts', label: '撒娇学妹' },
      { value: 'zh_male_dongfanghaoran_moon_bigtts', label: '东方浩然' },
      { value: 'zh_male_zhoujielun_emo_v2_mars_bigtts', label: '双节棍小哥 (台湾口音)' }
    ],
    '视频配音': [
      { value: 'zh_male_M100_conversation_wvae_bigtts', label: '悠悠君子' },
      { value: 'zh_female_maomao_conversation_wvae_bigtts', label: '文静毛毛' },
      { value: 'zh_female_wenrouxiaoya_moon_bigtts', label: '温柔小雅' },
      { value: 'zh_male_tiancaitongsheng_mars_bigtts', label: '天才童声' },
      { value: 'zh_male_sunwukong_mars_bigtts', label: '猴哥' },
      { value: 'zh_male_xionger_mars_bigtts', label: '熊二' },
      { value: 'zh_female_peiqi_mars_bigtts', label: '佩奇猪' },
      { value: 'zh_female_wuzetian_mars_bigtts', label: '武则天' },
      { value: 'zh_female_gujie_mars_bigtts', label: '顾姐' },
      { value: 'zh_female_yingtaowanzi_mars_bigtts', label: '樱桃丸子' },
      { value: 'zh_male_chunhui_mars_bigtts', label: '广告解说' },
      { value: 'zh_female_shaoergushi_mars_bigtts', label: '少儿故事' },
      { value: 'zh_male_silang_mars_bigtts', label: '四郎' },
      { value: 'zh_male_jieshuonansheng_mars_bigtts', label: '磁性解说男声/Morgan' },
      { value: 'zh_female_jitangmeimei_mars_bigtts', label: '鸡汤妹妹/Hope' },
      { value: 'zh_female_tiexinnvsheng_mars_bigtts', label: '贴心女声/Candy' },
      { value: 'zh_female_qiaopinvsheng_mars_bigtts', label: '俏皮女声' },
      { value: 'zh_female_mengyatou_mars_bigtts', label: '萌丫头/Cutey' },
      { value: 'zh_male_lanxiaoyang_mars_bigtts', label: '懒音绵宝' },
      { value: 'zh_male_dongmanhaimian_mars_bigtts', label: '亮嗓萌仔' }
    ],
    '有声阅读': [
      { value: 'zh_male_changtianyi_mars_bigtts', label: '悬疑解说' },
      { value: 'zh_male_ruyaqingnian_mars_bigtts', label: '儒雅青年' },
      { value: 'zh_male_baqiqingshu_mars_bigtts', label: '霸气青叔' },
      { value: 'zh_male_qingcang_mars_bigtts', label: '擎苍' },
      { value: 'zh_male_yangguangqingnian_mars_bigtts', label: '活力小哥' },
      { value: 'zh_female_gufengshaoyu_mars_bigtts', label: '古风少御' },
      { value: 'zh_female_wenroushunv_mars_bigtts', label: '温柔淑女' },
      { value: 'zh_male_fanjuanqingnian_mars_bigtts', label: '反卷青年' }
    ]
  },
  azure: {
    '中文普通话': [
      { value: 'zh-CN-XiaoxiaoNeural', label: '晓晓 (女)' },
      { value: 'zh-CN-YunxiNeural', label: '云希 (男)' },
      { value: 'zh-CN-YunjianNeural', label: '云健 (男)' },
      { value: 'zh-CN-XiaoyiNeural', label: '晓伊 (女)' },
      { value: 'zh-CN-YunyangNeural', label: '云扬 (男)' },
      { value: 'zh-CN-XiaochenNeural', label: '晓辰 (女)' },
      { value: 'zh-CN-XiaohanNeural', label: '晓涵 (女)' },
      { value: 'zh-CN-XiaomengNeural', label: '晓梦 (女)' },
      { value: 'zh-CN-XiaomoNeural', label: '晓墨 (女)' },
      { value: 'zh-CN-XiaoqiuNeural', label: '晓秋 (女)' },
      { value: 'zh-CN-XiaorouNeural', label: '晓柔 (女)' },
      { value: 'zh-CN-XiaoruiNeural', label: '晓睿 (女)' },
      { value: 'zh-CN-XiaoshuangNeural', label: '晓双 (女, 儿童)' },
      { value: 'zh-CN-XiaoyanNeural', label: '晓颜 (女)' },
      { value: 'zh-CN-XiaoyouNeural', label: '晓悠 (女, 儿童)' },
      { value: 'zh-CN-XiaozhenNeural', label: '晓甄 (女)' },
      { value: 'zh-CN-YunfengNeural', label: '云枫 (男)' },
      { value: 'zh-CN-YunhaoNeural', label: '云皓 (男)' },
      { value: 'zh-CN-YunjieNeural', label: '云杰 (男)' },
      { value: 'zh-CN-YunxiaNeural', label: '云夏 (男)' },
      { value: 'zh-CN-YunyeNeural', label: '云野 (男)' },
      { value: 'zh-CN-YunzeNeural', label: '云泽 (男)' }
    ],
    '多语言版本': [
      { value: 'zh-CN-XiaochenMultilingualNeural', label: '晓辰多语言 (女)' },
      { value: 'zh-CN-XiaoxiaoMultilingualNeural', label: '晓晓多语言 (女)' },
      { value: 'zh-CN-XiaoyuMultilingualNeural', label: '晓宇多语言 (女)' },
      { value: 'zh-CN-YunyiMultilingualNeural', label: '云逸多语言 (男)' },

      // The following neural voice is available in public preview. Voices and styles in public preview are 
      // only available in these service regions: East US, Southeast Asia, and West Europe.
      // { value: 'zh-CN-YunfanMultilingualNeural', label: '云帆多语言 (男)' },
      // { value: 'zh-CN-YunxiaoMultilingualNeural', label: '云霄多语言 (男)' }
    ],
    // '高清版本': [

    //   // The following neural voice is available in public preview. Voices and styles in public preview are 
    //   // only available in these service regions: East US, Southeast Asia, and West Europe.
    //   // { value: 'zh-CN-Xiaochen:DragonHDFlashLatestNeural', label: '晓辰高清闪电版 (女)' },
    //   // { value: 'zh-CN-Xiaoxiao:DragonHDFlashLatestNeural', label: '晓晓高清闪电版 (女)' },
    //   // { value: 'zh-CN-Xiaoxiao2:DragonHDFlashLatestNeural', label: '晓晓2高清闪电版 (女)' },
    //   // { value: 'zh-CN-Yunxiao:DragonHDFlashLatestNeural', label: '云霄高清闪电版 (男)' },
    //   // { value: 'zh-CN-Yunyi:DragonHDFlashLatestNeural', label: '云逸高清闪电版 (男)' },

    //   // { value: 'zh-CN-Xiaochen:DragonHDLatestNeural', label: '晓辰高清版 (女)' },
    //   // { value: 'zh-CN-Yunfan:DragonHDLatestNeural', label: '云帆高清版 (男)' }
    // ],
    '方言版本': [
      { value: 'zh-CN-XiaoxiaoDialectsNeural', label: '晓晓方言版 (女)' },
      { value: 'zh-CN-shandong-YunxiangNeural', label: '山东云翔 (男)' },
      { value: 'zh-CN-henan-YundengNeural', label: '河南云登 (男)' },
      { value: 'zh-CN-guangxi-YunqiNeural', label: '广西云奇 (男)' },
      { value: 'zh-CN-liaoning-XiaobeiNeural', label: '辽宁晓北 (女)' },
      { value: 'zh-CN-liaoning-YunbiaoNeural', label: '辽宁云彪 (男)' },
      { value: 'zh-CN-shaanxi-XiaoniNeural', label: '陕西晓妮 (女)' },
      { value: 'zh-CN-sichuan-YunxiNeural', label: '四川云希 (男)' }
    ]
  },
  minimax: {
    '青年音色': [
      { value: 'male-qn-qingse', label: '青涩青年音色' },
      { value: 'male-qn-jingying', label: '精英青年音色' },
      { value: 'male-qn-badao', label: '霸道青年音色' },
      { value: 'male-qn-daxuesheng', label: '青年大学生音色' }
    ],
    '女性音色': [
      { value: 'female-shaonv', label: '少女音色' },
      { value: 'female-yujie', label: '御姐音色' },
      { value: 'female-chengshu', label: '成熟女性音色' },
      { value: 'female-tianmei', label: '甜美女性音色' }
    ],
    '主持人音色': [
      { value: 'presenter_male', label: '男性主持人' },
      { value: 'presenter_female', label: '女性主持人' }
    ],
    '有声书音色': [
      { value: 'audiobook_male_1', label: '男性有声书1' },
      { value: 'audiobook_male_2', label: '男性有声书2' },
      { value: 'audiobook_female_1', label: '女性有声书1' },
      { value: 'audiobook_female_2', label: '女性有声书2' }
    ],
    '精品音色': [
      { value: 'male-qn-qingse-jingpin', label: '青涩青年音色-beta' },
      { value: 'male-qn-jingying-jingpin', label: '精英青年音色-beta' },
      { value: 'male-qn-badao-jingpin', label: '霸道青年音色-beta' },
      { value: 'male-qn-daxuesheng-jingpin', label: '青年大学生音色-beta' },
      { value: 'female-shaonv-jingpin', label: '少女音色-beta' },
      { value: 'female-yujie-jingpin', label: '御姐音色-beta' },
      { value: 'female-chengshu-jingpin', label: '成熟女性音色-beta' },
      { value: 'female-tianmei-jingpin', label: '甜美女性音色-beta' }
    ],
    '儿童音色': [
      { value: 'clever_boy', label: '聪明男童' },
      { value: 'cute_boy', label: '可爱男童' },
      { value: 'lovely_girl', label: '萌萌女童' },
      { value: 'cartoon_pig', label: '卡通猪小琪' }
    ],
    '角色扮演': [
      { value: 'bingjiao_didi', label: '病娇弟弟' },
      { value: 'junlang_nanyou', label: '俊朗男友' },
      { value: 'chunzhen_xuedi', label: '纯真学弟' },
      { value: 'lengdan_xiongzhang', label: '冷淡学长' },
      { value: 'badao_shaoye', label: '霸道少爷' },
      { value: 'tianxin_xiaoling', label: '甜心小玲' },
      { value: 'qiaopi_mengmei', label: '俏皮萌妹' },
      { value: 'wumei_yujie', label: '妩媚御姐' },
      { value: 'diadia_xuemei', label: '嗲嗲学妹' },
      { value: 'danya_xuejie', label: '淡雅学姐' }
    ],
    '节日音色': [
      { value: 'Santa_Claus', label: 'Santa Claus' },
      { value: 'Grinch', label: 'Grinch' },
      { value: 'Rudolph', label: 'Rudolph' },
      { value: 'Arnold', label: 'Arnold' },
      { value: 'Charming_Santa', label: 'Charming Santa' },
      { value: 'Charming_Lady', label: 'Charming Lady' },
      { value: 'Sweet_Girl', label: 'Sweet Girl' },
      { value: 'Cute_Elf', label: 'Cute Elf' },
      { value: 'Attractive_Girl', label: 'Attractive Girl' },
      { value: 'Serene_Woman', label: 'Serene Woman' }
    ]
  }
};