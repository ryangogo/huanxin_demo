$(document).ready(function(){

	/**
	 * 监听点击好友列表
	 */
	$('.conLeft li').live('click',function(){
		/*listen_left(".fri_");*/
		var before_click_user = $("#gro_or_fri").val();
		$(this).addClass('bg').siblings().removeClass('bg');
		var intername=$(this).children('.liRight').children('.intername').text();
		$(".fri_" +　before_click_user).hide();//展示当前对话的div
		$(".gro_" +　before_click_user).hide();//展示当前对话的div
		$('.headName').text(intername);
		/*$('.newsList').html('');*/
		$("#gro_or_fri").val(intername);
		$(".fri_" +　intername).show();//展示当前对话的div
	});
	/**
	 * 监听点击群组列表
	 */
	$('.conLeft_gro li').live('click',function(){
		var before_click_user = $("#gro_or_fri").val();
		$(this).addClass('bg').siblings().removeClass('bg');
		var intername=$(this).children('.liRight').children('.intername').text();
		var group_id=$(this).children('.liRight').children('input').val();
		$(".gro_" +　before_click_user).hide();//隐藏之前对话
		$(".fri_" +　before_click_user).hide();//隐藏之前对话
		$('.headName').text(intername);
		/*$('.newsList').html('');*/
		$("#gro_or_fri").val(intername);
		$("#group_id").val(group_id);
		$(".gro_" +　intername).show();//展示当前对话的div


		var pageNum = 1,
			pageSize = 1000;
		var options = {
			pageNum: pageNum,
			pageSize: pageSize,
			groupId: group_id,
			success: function (resp) {
				alert(JSON.stringify(resp));
			},
			error: function(e){}
		};
		conn.listGroupMember(options);
		/*"action":"get","application":"05406310-aa54-11e7-82fa-e9c7e84c4f7b","params":
		{"_v":["1527413655157"],"pagesize":["1000"],"pagenum":ji["1"]},
		"uri":"http://a1.easemob.com/1180170811178001/webim/chatgroups/50346566156289/users",
			"entities":[],"data":[{"owner":"admin123"}],"timestamp":1527413655744,"duration":1,
			"organization":"1180170811178001","applicationName":"webim","count":1*/


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
		$("#now_status").val("friend");
		setTimeout( function(){ get_roster();get_group()}, 1000 );

	});
	/**
	 * 注册控制
	 */
	$("#regist_button").click(function(){
		regist();
	});
	/**
	 * 添加好友/群组控制
	 */
	$("#add_friend").click(function(){
		var now_status = $("#now_status").val();
		if(now_status == "friend"){
			add_friend_msg();
		}else if(now_status == "group"){
			add_group_msg();
		}

	});
	/**
	 * 删除群组/好友控制
	 */
	$("#delete_friends").click(function(){
		var now_status = $("#now_status").val();
		if(now_status == "friend"){
			var friend_id = $("#gro_or_fri").val();
			removeFriends(friend_id);
			get_roster();//刷新好友列表
		}else if(now_status == "group"){
			var group_id = $("#group_id").val();
			var gro_or_fri = $("#gro_or_fri").val();
			alert(group_id);
			var role = queryGroupInfo(group_id);
			if(role == "owner");{
				dissolveGroup(group_id,gro_or_fri);//解散群组
			}
			/*get_group();//刷新群组列表*/
			layer.msg("当前为群组");
		}

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
	/**
	 * 切换个人/群组控制
	 */
	$("#change_role").click(function(){
		var gro_or_fri = $("#now_status").val();
		/*alert(gro_or_fri);*/
		if(gro_or_fri == "friend"){
			$("#now_status").val("group");
			$(".conLeft_gro").show();
			$(".conLeft").hide();
			$(".RightCont_Gro").show();
			$(".RightCont").hide();
			layer.msg("已切换为群组列表");
		}else if(gro_or_fri == "group"){
			$("#now_status").val("friend");
			$(".conLeft_gro").hide();
			$(".conLeft").show();
			$(".RightCont_Gro").hide();
			$(".RightCont").show();
			layer.msg("已切换为好友列表");
		}
	});
	/**
	 *	创建群组控制
	 */
	$("#create_group").click(function(){
		create_group_msg();
	});


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
	clear_fri_list();
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
 * 清空好友/群组列表
 */
function clear_fri_list(){
	$(".conLeft").children()[0].remove();
}
function clear_gro_list(){
	$(".conLeft_gro").children()[0].remove();
}
/**
 * 添加好友msg
 */
function add_friend_msg(){
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
	/*alert(1);*/
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
	var reciver_id = $("#gro_or_fri").val();
	if(news==''){
		layer.msg('不能为空');
	}else{
		send_message(news,reciver_id);
		$('#dope').val('');
		var str='';
		str+='<li>'+
				'<div class="nesHead"><img src="static/img/6.jpg"/></div>'+
				'<div class="news"><img class="jiao" src="static/img/20170926103645_03_02.jpg">'+news+'</div>'+
			'</li>';
		var status = $("#now_status").val();
		if(status == "friend"){
			$('.fri_' + reciver_id).append(str);
		}
		if(status == "group"){
			$('.gro_' + reciver_id).append(str);
		}
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
			to: $("#gro_or_fri").val(),                    // 接收消息对象
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
				var reciver_id = $("#gro_or_fri").val();
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
//	----------------------------------------------------------------群组----------------------------------------------------------------

/**
 * 获取当前用户加入的群组
 */
function get_group(){
	var options = {
		success: function (group) {
			add_group_to_group_list(group);//向好友列表中添加好友
			add_group_div(group);//向右侧群组对话模块儿中添加div
		},
		error: function (e) {
		}
	};
	conn.getGroup(options);
}
/**
 * 向群组列表中添加所有群组
 */
function add_group_to_group_list(group){
	/*alert(JSON.stringify(group));*/
	/*"action":"get","application":"05406310-aa54-11e7-82fa-e9c7e84c4f7b","uri":"http://a1.easemob.com/1180170811178001/webim/users/admin123/joined_chatgroups","entities":[],
		"data":[{"groupid":"1527151724075","groupname":"牛B哈哈哈哈哈哈"},
		{"groupid":"1527151690102","groupname":"牛B哈哈哈哈哈哈"},
		{"groupid":"1526986220783","groupname":"212"}]
		,"timestamp":1527241822523,"duration":0,"organization":"1180170811178001","applicationName":"webim","count":3}*/
	clear_gro_list();
	var htm_final = "";
	$.each(group.data,function(i,element){
		var htm =
			'<li class="">'   																	 +
			'<div class="liLeft"><img src="/static/img/20170926103645_04.jpg"/></div>'        +
			'<div class="liRight">'                                                          +
			'<span class="intername">'+ element.groupname +'</span>'                          +
			'<span class="infor" style="color: #888888">'+ element.groupid +'</span>'                                                    +
			'<input type="hidden" id="'+ element.groupid +'" value="'+ element.groupid +'"/>'                                                    +
			'</div>'                                                                         +
			'</li>';
		htm_final = htm_final + htm;
	});
	htm_final = '<ul>'+ htm_final  +'</ul>';
	$(".conLeft_gro").append(htm_final);
}

/**
 * 向右侧对话模块儿中添加div（群组）
 * @param roster
 */
function add_group_div(group){
	var htm_final = "";
	$.each(group.data,function(i,element){
		var f_class = "gro_" + element.groupname
		var htm =
			'<ul style="display:none" class="'+ f_class +'"></ul>';
		htm_final = htm_final + htm;
	});
	$(".RightCont_Gro").prepend(htm_final);
}
/**
 * 解散群组
 */
var dissolveGroup = function (groupId,gro_or_fri) {
	var option = {
		groupId: groupId,
		success: function () {
			$("#" + groupId).parent().parent().remove();
			$("." + "gro_" + gro_or_fri).remove();
			layer.msg("成功删除群组")
		}
	};
	conn.dissolveGroup(option);
};
//获取当前群组信息
var queryGroupInfo = function (group_id) {
	conn.queryRoomInfo({
		roomId: group_id,
		// settings 表示入群的权限，具体值待定
		// members[0]里面包含群主信息，其结构为{affiliation: 'owner', jid: appKey + '_' + username + '@easemob.com'}
		// jid中的username就是群主ID
		// fields的结构为：
		/*
		 {
		 affiliations: '2',
		 description: '12311231313',         // 群简介
		 maxusers: '200',                    // 群最大成员容量
		 name: '123',                        // 群名称
		 occupants: '2',
		 owner: 'easemob-demo#chatdemoui_mengyuanyuan'               // 群主jid
		 }
		 */
		success: function (settings, members, fields) {
			/*[{"jid":"admin123@easemob.com","affiliation":"owner"}]*/
			return(members[0].affiliation);
		},
		error: function () {
			layer.msg("未知错误！！！！")
		}
	});
};

/**
 * 加入群组
 */
function add_group_msg(){
	layer.open({
		type: 2,
		title: '加入群组',
		area: ['300px' , '200px'],
//            fixed: false, //不固定
//            maxmin: true,
		skin: 'layui-layer-rim', //加上边框
//            shadeClose: true,
		content:'static/add_group.html',
		btn: ['确定', '取消'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];//得到iframe页的窗口对象，执行iframe页的方法：
			var group_id = iframeWin.get_id();//调用子页面的方法，得到子页面返回的ids
			add_group(group_id);
			layer.close(index);//需要手动关闭窗口
		}
	});
}
/**
 * 加入群组
 */
function add_group(group_id){
	alert(group_id);
	var options = {
		groupId: group_id,
		success: function(resp) {
			console.log("Response: ", resp);
		},
		error: function(e) {
			alert(JSON.stringify(e));
		}
	};
	conn.joinGroup(options);
}
/**
 * 创建群组
 */
function create_group_msg(){
	layer.open({
		type: 2,
		title: '创建群组',
		area: ['300px' , '200px'],
//            fixed: false, //不固定
//            maxmin: true,
		skin: 'layui-layer-rim', //加上边框
//            shadeClose: true,
		content:'static/create_group.html',
		btn: ['确定', '取消'],
		yes: function(index, layero){
			var body = layer.getChildFrame('body', index);
			var iframeWin = window[layero.find('iframe')[0]['name']];//得到iframe页的窗口对象，执行iframe页的方法：
			var group_name = iframeWin.get_group_name();//调用子页面的方法，得到子页面返回的ids
			var member_name = iframeWin.get_member_name();//调用子页面的方法，得到子页面返回的ids
			var members = member_name.split(",");
			create_group(group_name,members);
			layer.close(index);//需要手动关闭窗口
		}
	});
}
/**
 * 创建群组
 * 创建群组成功后会在回调函数里调用onCreateGroup函数。
 * @param group_name
 * @param members
 */
function create_group(group_name,members){
	var options = {
		data: {
			groupname: group_name,
			desc: '帅哥美女看过来',//群组描述
			members: members,//members是用户名组成的数组
			public: true,//pub等于true时，创建为公开群
			approval: false,//approval等于true时，加群需要审批，为false时加群无需审批
			allowinvites: true
		},
		success: function (respData) {
			alert("成功" + JSON.stringify(respData))
		},
		error: function (respData) {
			alert("失败" + JSON.stringify(respData))
		}
	};
	conn.createGroupNew(options);
}
