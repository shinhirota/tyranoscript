
tyrano.plugin.kag.menu ={
    
    tyrano:null,
    kag:null,
    
    snap:null,
    
    init:function(){
        
    },
    
    showMenu:function(call_back){
        
        ///処理待ち状態の時は、実行してはいけない
       if(this.kag.layer.layer_event.css("display") =="none"){
            return false;
       }
       
       //上記と同義
       if(this.kag.stat.is_strong_stop == true){
            return false;
       }
        
        var that = this;
        
        this.kag.stat.is_skip = false;
        
        var layer_menu = this.kag.layer.getMenuLayer();
        
        layer_menu.empty();
        
        this.kag.html("menu",{},function(html_str){
            
            var j_menu = $(html_str);
            
            layer_menu.append(j_menu);
        
            layer_menu.find(".menu_skip").click(function(){
                
                //スキップを開始する
                layer_menu.html("");
                layer_menu.hide();
                if(that.kag.config.configVisible=="true"){
                    $(".button_menu").show();
                }
                //nextOrder にして、
                that.kag.stat.is_skip = true;
                
                ///処理待ち状態の時は、実行してはいけない
                if(that.kag.layer.layer_event.css("display") =="none"){
                    //alert("今、スキップしない");
                    //that.kag.ftag.nextOrder();
                }else{
                    //alert("スキップするよ");
                    that.kag.ftag.nextOrder();
                    
                }
                
                
                
            });
            
            layer_menu.find(".menu_close").click(function(e){
                layer_menu.hide();
                if(that.kag.config.configVisible=="true"){
                    $(".button_menu").show();
                }
            });
            
            layer_menu.find(".menu_window_close").click(function(e){
                
                //ウィンドウ消去
                that.kag.layer.hideMessageLayers();
                
                layer_menu.hide();
                if(that.kag.config.configVisible=="true"){
                    $(".button_menu").show();
                }
                
            });
            
            layer_menu.find(".menu_save").click(function(e){
                
                that.displaySave();
                
            });
            
            layer_menu.find(".menu_load").click(function(e){
                
                that.displayLoad();
                
            });
            
            //タイトルに戻る
            layer_menu.find(".menu_back_title").click(function(){
                
                
                if(!confirm("タイトルに戻ります。よろしいですね？")){
                    return false;
                }
                //first.ks の *start へ戻ります
                location.reload();
            });
            
            layer_menu.show();
            $(".button_menu").hide();
            
            
        });
         
    },
    
    
    displaySave:function(){
        
        //セーブ画面作成
            
            var that = this;
            
            this.kag.stat.is_skip = false;
        
            
            var array_save = that.getSaveData();
            var array = array_save.data; //セーブデータ配列
            
            var layer_menu = that.kag.layer.getMenuLayer();
            
            for (var i=0;i<array.length;i++){
                array[i].num = i;
            }
            
            this.kag.html("save",{array_save:array},function(html_str){
                var j_save = $(html_str);
                j_save.find(".save_display_area").each(function(){
                    
                   $(this).click(function(e){
                        var num = $(this).attr("data-num");
                        
                        that.snap = null;
                        that.doSave(num);
                        var layer_menu = that.kag.layer.getMenuLayer();
                        layer_menu.hide();
                        layer_menu.empty();
                        if(that.kag.config.configVisible=="true"){
                            $(".button_menu").show();
                        }
                   }) ;
                });
                
                var layer_menu = that.kag.layer.getMenuLayer();
                
                that.setMenu(j_save);
                
            });
            
            
            
            //背景素材挿入
            /*
            var j_menu_save_img =$("<img src='tyrano/images/kag/menu_save_bg.jpg' style='z-index:-1;left:0px;top:0px;position:absolute;' />");
            j_menu_save_img.css("width",this.kag.config.scWidth);
            j_menu_save_img.css("height",this.kag.config.scHeight);
            j_save.append(j_menu_save_img);
            */
           
            
    },
    
    //セーブを実行する
    doSave:function(num){
        
        var array_save = this.getSaveData();
        
        var data = {};
        var that = this;
        
        if(this.snap == null){
            //ここはサムネイルイメージ作成のため、callback指定する
            this.snapSave(this.kag.stat.current_message_str,
                function(){
                    //現在、停止中のステータスなら、[_s]ポジションからセーブデータ取得
                    if(that.snap.stat.is_strong_stop == true){
                        alert("ここではセーブできません");
                        return false;
                    }
                    
                    data = that.snap;
                    data.save_date = $.getNowDate()+"　"+$.getNowTime();
                    array_save.data[num] = data;
                    $.setStorage(that.kag.config.projectID+"_tyrano_data",array_save);
                    
                }
            );
        
        }
        
    },
    
    //doSaveSnap 自動セーブのデータを保存する
    doSetAutoSave:function(){
    	
    	var data = this.snap;
        data.save_date = $.getNowDate()+"　"+$.getNowTime();
        $.setStorage(this.kag.config.projectID+"_tyrano_auto_save",data);
                            
    },
    
    //自動保存のデータを読み込む
    loadAutoSave:function(){
    	var data = $.getStorage(this.kag.config.projectID+"_tyrano_auto_save");
    	
    	if(data){
        	data = eval("("+data+")");
    	}else{
        	return false;
       }
    	this.loadGameData($.extend(true,{},data));
    },
    
    //セーブ状態のスナップを保存します。
    snapSave:function(title,call_back){
        
        var that = this;
        
        //画面のキャプチャも取るよ
        
        var _current_order_index = that.kag.ftag.current_order_index;
        var _stat = $.extend(true, {}, $.cloneObject(that.kag.stat));
        
        if(this.kag.config.configThumbnail =="false"){
            
             //サムネデータを保存しない
             var img_code = "";
             var data = {};
                    
             data.title = title;
             data.stat = _stat;
             data.current_order_index = _current_order_index -1; //１つ前
             data.save_date = $.getNowDate()+"　"+$.getNowTime();
             data.img_data = img_code;
             
             //レイヤ部分のHTMLを取得
             var layer_obj = that.kag.layer.getLayeyHtml();
             data.layer = layer_obj;
             
             that.snap= $.extend(true, {}, $.cloneObject(data));
             
             if(call_back){
                call_back();
             }
            
        }else{
            
           html2canvas($("#tyrano_base").get(0), {
                onrendered: function(canvas) {
                    // canvas is the final rendered <canvas> element
                    //console.log(canvas);
                    var img_code = canvas.toDataURL();
                    
                    /*
                    scenario = scenario || "";
                    order_index = order_index || "";
                    */
                   
                    var data = {};
                    
                    data.title = title;
                    data.stat = _stat;
                    data.current_order_index = _current_order_index -1; //１つ前
                    data.save_date = $.getNowDate()+"　"+$.getNowTime();
                    data.img_data = img_code;
                    
                    //レイヤ部分のHTMLを取得
                    var layer_obj = that.kag.layer.getLayeyHtml();
                    data.layer = layer_obj;
                    
                    that.snap= $.extend(true, {}, $.cloneObject(data));
                    
                    
                    if(call_back){
                        call_back();
                    }
                }
            });
        
            
        }
        
        
        
    },
    
    displayLoad:function(){
        
            var that = this;
            
            this.kag.stat.is_skip = false;
            
            var array_save = that.getSaveData();
            var array = array_save.data; //セーブデータ配列
            
            var layer_menu = that.kag.layer.getMenuLayer();
            
            for (var i=0;i<array.length;i++){
                array[i].num = i;
            }
            
            this.kag.html("load",{array_save:array},function(html_str){
                var j_save = $(html_str);
                j_save.find(".save_display_area").each(function(){
                    
                   $(this).click(function(e){
                        var num = $(this).attr("data-num");
                        that.snap = null;
                        that.loadGame(num);
                        var layer_menu = that.kag.layer.getMenuLayer();
                        layer_menu.hide();
                        layer_menu.empty();
                        if(that.kag.config.configVisible=="true"){
                            $(".button_menu").show();
                        }
                   }) ;
                });
                
                var layer_menu = that.kag.layer.getMenuLayer();
                
                that.setMenu(j_save);
                
            });
            
    },
    
    
    
    //ゲームを途中から開始します
    loadGame:function(num){
       
       var array_save = this.getSaveData();
       var array = array_save.data; //セーブデータ配列
       
       this.loadGameData($.extend(true,{},array[num]));
       
    },
    
    loadGameData:function(data){
    	
    	var auto_next = "yes";
       
        //layerの復元
        this.kag.layer.setLayerHtml(data.layer);
        
        //その他ステータスの設定
        this.kag.stat = data.stat;
        
        //停止の場合は復活
        this.kag.stat.is_strong_stop = false;
        
        //一旦音楽と効果音は全て止めないと
        
        this.kag.ftag.startTag("stopbgm",{stop:"true"});
        this.kag.ftag.startTag("stopse",{stop:"true"});
         
        //音楽再生
        if(this.kag.stat.current_bgm != ""){
        
            var mstorage = this.kag.stat.current_bgm;
            
            var pm ={
                loop:"true",
                storage:mstorage,
                /*fadein:"true",*/
                /*time:2000,*/
                stop:"true"
            }
                    
            this.kag.ftag.startTag("playbgm",pm);
    
        }
        
        //カーソルの復元
        this.kag.setCursor(this.kag.stat.current_cursor);
        
        //ジャンプ
        //data.stat.current_scenario; 
        //data.current_order_index;
        //必ず、ファイルロード。別シナリオ経由的な
        //this.kag.ftag.startTag("call",{storage:"make.ks"});
        
        var insert = {
          
          name:"call",
          pm:{storage:"make.ks"},
          val:"" 
            
        };
        
        this.kag.ftag.nextOrderWithIndex(data.current_order_index,data.stat.current_scenario,true,insert,auto_next);
        
    },
    
    //メニュー画面に指定のJクエリオブジェクト追加
      setMenu:function(j_obj){
            
            var that = this;
        
            var layer_menu = this.kag.layer.getMenuLayer();
        
            layer_menu.empty();
        
            var menu_html = ""
        
            +"<div class='menu_item menu_close' style='float:right;'><img src='tyrano/images/kag/menu_button_close.png' /></div>"
            +"<div style='clear:both'></div>"
            +"";
        
            var j_menu = $(menu_html);
            layer_menu.append(j_menu);

            layer_menu.find(".menu_close").click(function(e){
                layer_menu.hide();
                if(that.kag.config.configVisible=="true"){
                    $(".button_menu").show();
                }
                
                //that.kag.ftag.nextOrder();
                
            });
            
            layer_menu.append(j_obj);
            layer_menu.show();
            
            
        },
        
    
    //メニューを隠します
    hideMenu:function(){
        
    },
    
    //セーブデータを取得します
    getSaveData:function(){
        
        var tmp_array = $.getStorage(this.kag.config.projectID+"_tyrano_data");
        
        if(tmp_array){
        
            // データがある場合は一覧として表示します
            return eval("("+tmp_array+")");
            
        }else{
            
            tmp_array = new Array();
            
            var root = {kind:"save"};
            
            for(var i=0;i<5;i++){
            
                var json ={};
                json.title  = "まだ、保存されているデータがありません"; // ラストテキスト
                json.current_order_index = 0;
                json.save_date = "　";
                json.img_data  ="";
                json.stat = {};
                
                tmp_array.push(json);
            
            }
            
            root.data = tmp_array;
            
            return root;
        
        }
        
    },
    
    //バックログ画面表示
    displayLog:function(){
            
            var that = this;
            this.kag.stat.is_skip = false;
            
            var j_save = $("<div></div>");
            
            this.kag.html("backlog",{},function(html_str){
                
                var j_menu = $(html_str);
                
                var layer_menu = that.kag.layer.getMenuLayer();
                layer_menu.empty();
                layer_menu.append(j_menu);
                
                layer_menu.find(".menu_close").click(function(){
                    layer_menu.hide();
                    if(that.kag.config.configVisible=="true"){
                        $(".button_menu").show();
                    }
                });
                
                var log_str = "";
                
                var array_log = that.kag.variable.tf.system.backlog;
                
                for (var i=0;i<array_log.length;i++){
                    log_str += array_log[i]+"<br />";
                }
                
                layer_menu.find(".log_body").html(log_str);
                layer_menu.show();
                
                //一番下固定させる
                layer_menu.find(".log_body").scrollTop(9999999999);
                
                $(".button_menu").hide();
                
                
            });
            
    },
    
    
      
    test:function(){
        
    }
};


