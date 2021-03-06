window.onload=function(){
    var a = window.location.href,
    u = document.getElementById("u"),
    p = document.getElementById("p"),
    v = document.getElementById("verifycode"),
    i = document.getElementById("verifyimgArea"),
    d = document.getElementById("uin_del");
    c = document.getElementById("authClick");
    caps = document.getElementById("caps_lock_tips");
    flogin={
	p_blur: function() {
	    caps.style.display="none";
	},
	p_focus: function(t) {
	    flogin.detectCapsLock(t) ? caps.style.display="block" : caps.style.display="none";
	},
	p_keypress: function(t){
	    flogin.p_focus(t);
	},
	detectCapsLock: function(t) {
            var e = t.keyCode || t.which,
            i = t.shiftKey || 16 == e || !1;
            return !!(e >= 65 && e <= 90 && !i || e >= 97 && e <= 122 && i)
	},
	submit: function() {
	    var e = $(".err-msg");
	    pf.disable();
	    var nickname = u.value.trim(),
            pwd = p.value;
	    alert(nickname);
	    alert(pwd);
            if (nickname.length == 0 ||  pwd.length == 0)
		return e.text("请输入用户名和密码"), e.fadeIn(), setTimeout(function() {
                    e.fadeOut()
		}, 3e3), void pf.enable();
            if (pwd.length < 6)
		return e.text("密码不正确!"), e.fadeIn(), setTimeout(function() {
                    e.fadeOut()
		}, 3e3), void pf.enable()
            $.ajax({
		type: "POST",
		url: "/cfd/auth",
		data: {
                    'username': nickname,
                    'password': pwd
		},
		dataType: "json",
		success: function(a) {
                    if (a.ret){
			alert(111);
			window.location.href= "/cfd/dashboard";
		    }else{
			alert(222);
			return e.text("你输入的帐号或密码不正确，请重新输入。"), e.fadeIn(), setTimeout(function() {
			    e.fadeOut()
			}, 3e3), void pf.enable();
                    }
		},
		error: function(a) {
		    alert('ddd');
		    alert(a.status);
                    return pf.enable(), a && 401 == a.status ? (e.innerText="你输入的帐号或密码不正确，请重新输入。", e.fadeIn(), setTimeout(function() {
                        e.fadeOut()
                    }, 3e3), removeCookie("uid"), removeCookie("sid"), void removeCookie("username")) : a && 502 == a.status || a && 503 == a.status ? void (window.location.href = "/authentication?action=server_down") : void 0
		}
            })
	},
    }
    $.ev.add(p, "focus", flogin.p_focus);
    $.ev.add(p, "blur", flogin.p_blur);
    $.ev.add(p, "keypress", flogin.p_keypress);
    $.ev.add(c, "click", flogin.submit);
    var pf = function() {
        return {
            disable: function() {
                $("#authClick").attr("disabled", "disabled")
            },
            enable: function() {
                $("#authClick").removeAttr("disabled")
            }
        }
    }()
};
