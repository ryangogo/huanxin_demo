$(document).ready(function(){

	/**
	 * 监听点击好友列表
	 */
	$('.conLeft li').live('click',function(){

		var before_click_user = $("#friend_id").val();
		$(".fri_" +　before_click_user).hide();//展示当前对话的div

		$(this).addClass('bg').siblings().removeClass('bg');
		var intername=$(this).children('.liRight').children('.intername').text();
		$('.headName').text(intername);
		/*$('.newsList').html('');*/
		$("#friend_id").val(intername);
		$(".fri_" +　intername).show();//展示当前对话的div
	});
	/**
	 * 发送对话控制
	 */
	$('.sendBtn').live('click',function(){
		var text = $("#dope").html();
		commit_message();
		$("#dope").html("")
	});
	$('.ExP').on('mouseenter',function(){
		$('.emjon').show();
	});
	$('.emjon').on('mouseleave',function(){
		$('.emjon').hide();
	});
	$('.emjon li').live('click',function(){
		var imgSrc=$(this).children('img').attr('src');
		var img_tmp = '<img class="Expr" src="'+imgSrc+'">';
		$("#dope").append(img_tmp);
	});

	//---------------------------------------------------------------以上是Demo里面带的，以及对其修改的，以下是我写的-----------------------------------------------------------------------

	/*var friend_class = "friend";//全局变量，用于拼接好友id形成好友对话列表的div
	var group_class = "group";//全局变量，用于拼接群组id形成群组对话列表的div*/


	/**
	 * 登录控制
	 */
	$("#login_button").click(function(){
		login();
		$('#msg_input').hide();
		$('#conversation_ui').show();
		$("#user_msg").text("");
		var user_name = $("#username").val();
		$("#user_msg").text(user_name);
		setTimeout( function(){ get_roster()}, 1000 );

	});
	/**
	 * 注册控制
	 */
	$("#regist_button").click(function(){
		regist();
	});
	/**
	 * 添加好友控制
	 */
	$("#add_friend").click(function(){
		layer.open({
			type: 2,
			title: '输入好友id',
			area: ['300px' , '200px'],
//            fixed: false, //不固定
//            maxmin: true,
			skin: 'layui-layer-rim', //加上边框
//            shadeClose: true,
			content:'static/add_friend.html',
			btn: ['确定', '取消'],
			yes: function(index, layero){
				var body = layer.getChildFrame('body', index);
				var iframeWin = window[layero.find('iframe')[0]['name']];//得到iframe页的窗口对象，执行iframe页的方法：
				var friend_id = iframeWin.get_id();//调用子页面的方法，得到子页面返回的ids
				add_friend(friend_id);
				layer.close(index);//需要手动关闭窗口
			}
		});
	});
	/**
	 * 获取好友列表控制
	 */
	/*$("#user_msg").click(function(){
		get_roster();
	});*/

	/**
	 * 删除好友控制
	 */
	$("#delete_friends").click(function(){
		var friend_id = $("#friend_id").val();
		removeFriends(friend_id);
		get_roster();//刷新好友列表
	});

	/**
	 * 发送图片控制
	 */
	$("#send_pic").click(function(){
		$("#pic").click();
	})
	$("#pic").change(function(){
		sendPrivateImg("pic");
	})

});
/**
 * 注册
 */
function regist(){
	var username = $("#username").val();
	var password = $("#password").val();
	var nickname = $("#nickname").val();
	var options = {
		username: username,
		password: password,
		nickname: nickname,
		appKey: WebIM.config.appkey,
		success: function () {
			layer.msg('注册成功');
		},
		error: function () {
			layer.msg('注册失败');
		},
		apiUrl: WebIM.config.apiURL
	};
	conn.registerUser(options);
}
/**
 * 登录
 */
function login(){
	var username = $("#username").val();
	var password = $("#password").val();
	var options = {
		apiUrl: WebIM.config.apiURL,
		user: username,
		pwd: password,
		success: function () {
			layer.msg('登录成功');
		},
		error: function () {
			layer.msg('登录失败');
		},
		appKey: WebIM.config.appkey

	};
	conn.open(options);
}
/**
 * 获取好友列表
 */
function get_roster(){
	var options = {
		success: function ( roster ){
			add_frieds_to_friend_list(roster);//向好友列表中添加好友
			add_friend_div(roster);//向右侧对话模块儿中添加div
		}
	};
	conn.getRoster(options);
}
/**
 * 向好友列表中添加所有好友
 */
function add_frieds_to_friend_list(friend){
	clear_friend_list();
	/*{"subscription":"none","jid":"_admin123@easemob.com","ask":"subscribe","name":"admin123","groups":[]}*/
	var htm_final = "";
	$.each(friend,function(i,element){
		var htm =
		'<li class="">'   																	 +
			'<div class="liLeft"><img src="/static/img/20170926103645_04.jpg"/></div>'        +
			'<div class="liRight">'                                                          +
				'<span class="intername">'+ element.name +'</span>'                          +
				'<span class="infor"></span>'                                          +
			'</div>'                                                                         +
		'</li>';
		htm_final = htm_final + htm;
	});
	htm_final = '<ul>'+ htm_final  +'</ul>';
	$(".conLeft").append(htm_final);
}
/**
 * 清空好友列表
 */
function clear_friend_list(){
	$(".conLeft").children()[0].remove();
	/*$(".conLeft").append(
		'<ul></ul>'
	)*/
}
/**
 * 删除好友
 */
function removeFriends(username) {
	conn.removeRoster({
		to: username,
		success: function () {  // 删除成功
			layer.msg('删除成功');
			conn.unsubscribed({
				to:username
			});
		},
		error: function () {    // 删除失败
			layer.msg('删除失败');
		}
	});
};
/**
 * 获取将要添加的好友的id
 */
function get_will_add_friend(){
	layer.open({
		type: 2,
		title: '输入好友id',
		area: ['300px' , '200px'],
//            fixed: false, //不固定
//            maxmin: true,
		skin: 'layui-layer-rim', //加上边框
//            shadeClose: true,
		content:'static/add_friend.html',
		btn: ['确定', '取消'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];//得到iframe页的窗口对象，执行iframe页的方法：
			var friend_id = iframeWin.get_id();//调用子页面的方法，得到子页面返回的ids
			add_friend(friend_id);
			layer.close(index);//需要手动关闭窗口
		}
	});

}
/**
 * 添加好友
 */
function add_friend(id){
	var options = {
		to: id,
		// Demo里面接收方没有展现出来这个message，在status字段里面
		message: '加个好友呗!'
	};
	conn.subscribe(options);
}
/*--------------------------------------------好友相关方法-----------------------------------------------------------------------*/
/**
 * 提交textarea中的消息
 */
function commit_message(){
	var news = $('#dope').html();
	var reciver_id = $("#friend_id").val();
	send_message(news,reciver_id);
	if(news==''){
		layer.msg('不能为空');
	}else{
		$('#dope').val('');
		var str='';
		str+='<li>'+
			'<div class="nesHead"><img src="static/img/6.jpg"/></div>'+
			'<div class="news"><img class="jiao" src="static/img/20170926103645_03_02.jpg">'+news+'</div>'+
			'</li>';
		$('.fri_' + reciver_id).append(str);
		/*setTimeout(answers,1000);*/
		$('.conLeft').find('li.bg').children('.liRight').children('.infor').text("");
		$('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
	}
}

/**
 * 发送消息
 * @param to_one_message 准备发送的信息
 * @param reciver_id 准备接收信息的人
 */
function send_message(to_one_message,reciver_id){
	var id = conn.getUniqueId();                 // 生成本地消息id
	var msg = new WebIM.message('txt', id);      // 创建文本消息
	msg.set({
		msg: to_one_message,                  // 消息内容
		to: reciver_id,                          // 接收消息对象（用户id）
		roomType: false,
		success: function (id, serverMsgId) {
			/*alert("消息发送成功")*/
		},
		fail: function(e){
			layer.msg("消息发送失败")
		}
	});
	msg.body.chatType = 'singleChat';
	conn.send(msg.body);
}
/**
 * 展示接收到的消息
 */
function show_recive_msg(message){
	/*layer.msg(data);*/
	var answer = '<li>'+
		'<div class="answerHead"><img src="static/img/tou.jpg"/></div>'+
		'<div class="answers"><img class="jiao" src="static/img/jiao.jpg">'+message.data+'</div>'+
		'</li>';
	$(".fri_" + message.from).append(answer);
	$('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
}
/**
 * 向右侧对话模块儿中添加div
 * @param roster
 */
function add_friend_div(friend){
	var htm_final = "";

	$.each(friend,function(i,element){
		var f_class = "fri_" + element.name
		var htm =
		'<ul style="display:none" class="'+ f_class +'"></ul>';
		htm_final = htm_final + htm;
	});
	$(".RightCont").prepend(htm_final);
}
/**
 * 添一个<li>到右边对话模块儿
 * @param message
 */
function add_one_right(message){
	//
	var f_class = "fri_" + message.from;
	var htm =
		'<ul style="display:none" class="'+ f_class +'"></ul>';
	$(".RightCont").prepend(htm);
}
/**
 * 添加一个div到左边好友展示
 * @param message
 */
function add_one_left(message){
	var htm =
		'<li class="">'   																	 +
		'<div class="liLeft"><img src="static/img/20170926103645_04.jpg"/></div>'        +
		'<div class="liRight">'                                                          +
		'<span class="intername">'+ message.from +'</span>'                              +
		'<span class="infor"></span>'                                              +
		'</div>'                                                                         +
		'</li>';
	$(".conLeft").children('ul').prepend(htm);
}



/**
 * 私聊发送图片消息
 */
function sendPrivateImg(obj) {
	var id = conn.getUniqueId();                   // 生成本地消息id
	var msg = new WebIM.message('img', id);        // 创建图片消息
	var input = document.getElementById(obj);  // 选择图片的input
	var file = WebIM.utils.getFileUrl(input);      // 将图片转化为二进制文件
	var allowType = {
		'jpg': true,
		'gif': true,
		'png': true,
		'bmp': true
	};
	if (file.filetype.toLowerCase() in allowType) {
		var option = {
			apiUrl: WebIM.config.apiURL,
			file: file,
			to: $("#friend_id").val(),                    // 接收消息对象
			roomType: false,
			chatType: 'singleChat',
			onFileUploadError: function () {      // 消息上传失败
				layer.msg("上传失败")
			},
			onFileUploadComplete: function (data) {   // 消息上传成功
				/*layer.msg("上传成功")*/
				/*alert(JSON.stringify(data));*/
				var pic_uri = data.uri+"/"+data.entities[0].uuid;
				var pic = '<img src="'+pic_uri+'" style="width:100px;height:100px;">';
				var reciver_id = $("#friend_id").val();
				var str = '<li">'+
					'<div class="nesHead" ><img src="static/img/6.jpg" /></div>'+
					'<div>'+ pic +'</div>'+
					'</li>';
				$('.fri_' + reciver_id).append(str);
				/*setTimeout(answers,1000);*/
				$('.conLeft').find('li.bg').children('.liRight').children('.infor').text("");
				$('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
			},
			success: function () {                // 消息发送成功
				console.log('Success');
			},
			flashUpload: WebIM.flashUpload
		};
		msg.set(option);
		conn.send(msg.body);
	}
};
