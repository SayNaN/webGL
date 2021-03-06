window.onload=function(){
    var uin = document.getElementById("uin"),
    uin_msg = document.getElementById("uin-msg"),
    male = document.getElementById("male"),
    female = document.getElementById("female"),
    email = document.getElementById("email"),
    email_msg = document.getElementById("email-msg"),
    phone = document.getElementById("phone"),
    phone_msg = document.getElementById("phone-msg"),
    work = document.getElementById("work"),
    work_msg = document.getElementById("work-msg"),
    pwd = document.getElementById("password"),
    pwd_msg = document.getElementById("pwd-msg"),
    con_pwd = document.getElementById("confirm-password"),
    con_pwd_msg = document.getElementById("con-pwd-msg"),
    terms = document.getElementById("terms-and-conditions"),
    terms_msg = document.getElementById("terms-msg"),
    btn = document.getElementById("btn-msf-submit"),
    error_msg = document.getElementById("error-msg");
    
    fregi={
	disable: function() {
            $("#btn-msf-submit").attr("disabled", "disabled");
	},
        enable: function() {
            $("#btn-msf-submit").removeAttr("disabled");
        },
	u_change: function() {
	    var content = uin.value.trim();
	    if(content!=uin.value)
		uin.value=content;
	    if(content.length == 0){
		uin_msg.innerHTML = '<i class="fa fa-close" aria-hidden="true"></i>';
		return 0;
	    }else{
		uin_msg.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
		return 1;
	    }
	},
	e_change: function() {
	    var content = email.value.trim();
	    if(content!=email.value)
	    email.value=content;
	    if(content.length == 0){
		email_msg.innerHTML = '<i class="fa fa-close" aria-hidden="true"></i>';
		return 0;
	    }else{
		email_msg.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
		return 1;
	    }
	},
	submit: function() {
	    fregi.disable();
	    alert(fregi.u_change()*fregi.e_change());
            if (fregi.u_change()*fregi.e_change()){
		$.ajax({
		    type: "POST",
		    url: "/cfd/regs",
		    data: {
			username: uin.value.trim(),
			password: pwd.value.trim(),
			email:    email.value.trim(),
			phone:    phone.value.trim(),
			work:     work.value.trim(),
		    },
		    dataType: "json",
		    success: function(a) {
			if (a.ret){
			    window.location.href= "/cfd/dashboard";
			}else{
			    return alert(a.msg),error_msg.innerText=a.msg, error_msg.fadeIn(), setTimeout(function() {
			    error_msg.fadeOut()
			    }, 3e3), void pf.enable();
			}
		    },
		    error: function(a) {
			return fregi.enable(), a && 401 == a.status ? (e.innerText="你输入的帐号或密码不正确，请重新输入。", e.fadeIn(), setTimeout(function() {
			    e.fadeOut()
			}, 3e3), removeCookie("uid"), removeCookie("sid"), void removeCookie("username")) : a && 502 == a.status || a && 503 == a.status ? void (window.location.href = "/authentication?action=server_down") : void 0
		    }
		})
	    }else{
		alert('aaa');
		return fregi.enable(),void 0;
	    }
	}
    }
    $.ev.add(uin, "change", fregi.u_change);
    $.ev.add(email, "change", fregi.e_change);
    $.ev.add(btn, "click", fregi.submit);

};


/*
<i class="fa fa-close" aria-hidden="true"></i>
<i class="fa fa-check" aria-hidden="true"></i>
<i class="fa fa-info-circle" aria-hidden="true"></i>
*/
