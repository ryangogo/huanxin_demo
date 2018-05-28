/**
 * 环信的连接创建以及函数回调等操作
 * @type {*|connection}
 */


//创建连接
var conn = new WebIM.connection({
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
    url: WebIM.config.xmppURL,
    heartBeatWait: WebIM.config.heartBeatWait,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    autoReconnectInterval: WebIM.config.autoReconnectInterval,
    apiUrl: WebIM.config.apiURL,
    isAutoLogin: true
});
WebIM.Emoji = {
    path: 'static/img/face/'  /*表情包路径*/
    , map: {
        '[):]': 'ee_1.png',
        '[:D]': 'ee_2.png',
        '[;)]': 'ee_3.png',
        '[:-o]': 'ee_4.png',
        '[:p]': 'ee_5.png'
    }
};
conn.listen({
    onOpened: function ( message ) {
        // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
        // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
        // 则无需调用conn.setPresence();
    },//连接成功回调
    onClosed: function ( message ) {},         //连接关闭回调
    onTextMessage: function ( message ) {
        show_recive_msg(message);
        /*{"id":"469922613167129060","type":"chat","from":"admin123","to":"admin1","data":"呵呵","ext":
         {"weichat":{"originTy{"id":"469922613167129060","type":"chat","from":"admin123","to":"admin1","data":"呵呵","ext":{"weichat":{"originType":"webim"}},"error":false,"errorText":"","errorCode":""}*/
    },    //收到文本消息
    onEmojiMessage: function ( message ) {
        /*alert(JSON.stringify(message));*/
        /*{"id":"469942844967092712","type":"chat","from":"admin1","to":"admin123","data":
         [{"type":"emoji","data":"static/img/faces/ee_1.png"},
         {"type":"txt","data":"啊哈哈哈"},
         {"type":"emoji","data":"static/img/faces/ee_1.png"}],
         "ext":{"weichat":{"originType":"webim"}},"error":false,"errorText":"","errorCode":""}*/
        var emoji_msg = "";
        $.each(message.data,function(i,element){
            if(element.type == "emoji"){
                emoji_msg = emoji_msg + '<img src="'+ element.data +'"/>';
            }else if(element.type == "txt"){
                emoji_msg = emoji_msg + element.data
            }
        });
        var answer = '<li>'+
            '<div class="answerHead"><img src="static/img/tou.jpg"/></div>'+
            '<div class="answers"><img class="jiao" src="static/img/jiao.jpg">'+emoji_msg+'</div>'+
            '</li>';
        $(".fri_" + message.from).append(answer);
        $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
    },   //收到表情消息
    onPictureMessage: function ( message ) {
        /*alert(JSON.stringify(message));*/
        var img_tmp = '<img src="'+message.url+'" style="width:100px;height:100px;">'
        var answer = '<li>'+
            '<div class="answerHead"><img src="static/img/tou.jpg"/></div>'+
            '<div class="pic_answers">'+ img_tmp +'</div>'+
            '</li>';
        $(".fri_" + message.from).append(answer);
        $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
    }, //收到图片消息
    onCmdMessage: function ( message ) {},     //收到命令消息
    onAudioMessage: function ( message ) {},   //收到音频消息
    onLocationMessage: function ( message ) {},//收到位置消息
    onFileMessage: function ( message ) {},    //收到文件消息
    onVideoMessage: function (message) {
        var node = document.getElementById('privateVideo');
        var option = {
            url: message.url,
            headers: {
                'Accept': 'audio/mp4'
            },
            onFileDownloadComplete: function (response) {
                var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
                node.src = objectURL;
            },
            onFileDownloadError: function () {
                console.log('File down load error.')
            }
        };
        WebIM.utils.download.call(conn, option);
    },   //收到视频消息
    onPresence: function ( message ) {
        /*alert(JSON.stringify(message));*/
        /*"from":"admin123","to":"admin1","fromJid":"1180170811178001#webim_admin123@easemob.com/webim_device_uuid",
            "toJid":"1180170811178001#webim_admin1@easemob.com/webim_device_uuid",
            "type":"unavailable","chatroom":false,"presence_type":"","original_type":"unavailable"}*/
        if (message.type == 'subscribe'){
            layer.confirm('用户'+ message.from + '请求添加您为好友', {
                btn: ['同意','拒绝'] //按钮
            }, function(){//同意
                conn.subscribed({
                    to: message.from,
                    message : '[resp:true]'
                });
            }, function(){//拒绝
                conn.unsubscribed({
                    to: message.from,
                    message : 'rejectAddFriend'
                });
            });
        }else if(message.type == 'subscribed'){
            layer.msg("成功添加"+message.from+"为好友");
            add_one_right(message);
            add_one_left(message);
            /*add_one(message);*/
        }
        /*{"from":"admin1","to":"admin123","fromJid":"1180170811178001#webim_admin1@easemob.com","toJid":"1180170811178001#webim_admin123@easemob.com",
            "type":"subscribe","chatroom":false,"status":"加个好友呗!","code":null,"presence_type":"","original_type":"subscribe"}*/
    },       //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
    onRoster: function ( message ) {
        /*alert(JSON.stringify(message));*/
        /*layer.confirm('您是如何看待前端开发？', {
            btn: ['重要','奇葩'] //按钮
        }, function(){
            layer.msg('的确很重要', {icon: 1});
        }, function(){
            layer.msg('也可以这样', {
                time: 20000, //20s后自动关闭
                btn: ['明白了', '知道了']
            });
        });*/
    },         //处理好友申请
    onInviteMessage: function ( message ) {
        alert(JSON.stringify(message));
        /*"type":"invite","from":"admin123","roomid":"50348961103873","reason":""*/
        layer.confirm('用户 '+message.from+'邀请您入群', {
            btn: ['同意','拒绝'] //按钮
        }, function(){
            var options = {
                applicant: applicant,
                groupId: groupId,
                success: function(resp){
                    console.log(resp);
                },
                error: function(e){}
            };
            conn.agreeJoinGroup(options);
        }, function(){
            layer.msg('也可以这样', {
                time: 20000, //20s后自动关闭
                btn: ['明白了', '知道了']
            });
        });

    },  //处理群组邀请
    onOnline: function () {},                  //本机网络连接成功
    onOffline: function () {},                 //本机网络掉线
    onError: function ( message ) {},          //失败回调
    onBlacklistUpdate: function (list) {       //黑名单变动
        // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
        console.log(list);
    },
    onReceivedMessage: function(message){},    //收到消息送达服务器回执
    onDeliveredMessage: function(message){},   //收到消息送达客户端回执
    onReadMessage: function(message){},        //收到消息已读回执
    onCreateGroup: function(message){
        /*alert(JSON.stringify(message))*/
    },        //创建群组成功回执（需调用createGroupNew）
    onMutedMessage: function(message){}        //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
});//创建连接
