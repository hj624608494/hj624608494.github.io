function alertMsg(msg){
	alert(msg);
}

function setCookie(data){
	document.cookie = data.key + "=" + data.val;
}
// var data = {
// 	'key':'cookietest',
// 	'val' : 'test'
// }
// setCookie(data);

function getCookie(key){
	var arr,reg=new RegExp("(^| )"+key+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
	return unescape(arr[2]);
	else
	return null;
}
alert(getCookie('name'));