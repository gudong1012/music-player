//保存音乐列表信息
var musicList = [];

//声明变量，保存当前播放的是哪一首歌曲
var currentIndex = 0;



//1.加载音乐列表信息
$.ajax({
    type:"get",//请求方式
    url:"../music.json",//路径
    dataType:"json", //类型json
    success: function(data){
        //拿到数据保存起来
        musicList = data;
        //渲染数据 把索引传过去
        render(musicList[currentIndex]);
        //把数据加载到 renderMusicList
        renderMusicList(musicList)

    }
})
//给播放按钮绑定点击事件
$("#playBtn").on("click",function(){
     //通过 audio 标签的 paused(暂停)判断是否是播放状态
    // if($(this).hasClass('fa-play')){
       if($("audio").get(0).paused) {
        //暂停状态，应该播放
        //修改播放按钮的图标状态
        $(this).removeClass('fa-play').addClass('fa-pause');
       
        //让音乐信息卡片显示出来
        $('.player-info').animate({
            top:'-100%',
            opacity:1,
        },'slow')

        //让封面旋转起来
        $('.cover').css({
            "animation-play-state": "running"
        })

        //让音乐播放起来  用  get 获取原生 audio 标签索引
        $("audio").get(0).play();

    }else{
        //播放状态，应该暂停
        $(this).removeClass('fa-pause').addClass('fa-play');
        
        //让音乐信息卡片影藏
        $('.player-info').animate({
            top: '0%',
            opacity:0
        },'slow')

        //让封面暂停
        $('.cover').css({
            "animation-play-state": "paused"
        });

        //让音乐暂停
        $("audio").get(0).pause();
    }
       //重新渲染音乐列表数据 
       renderMusicList(musicList);
})

//给上一首按钮绑定点击事件
$("#prevBtn").on("click", function(){
    //判断音乐所有是否大于0如果大于0就减减
    if(currentIndex > 0){
        currentIndex --;
    }else{
        //如果小于 0 就直接跳到最后一首歌
        currentIndex = musicList.length - 1;
    }
    //判断之后要重新渲染歌曲信息
    render(musicList[currentIndex]);
    //让音乐播放 触发 playBtn 点击事件
    $("#playBtn").trigger("click");
})

//给下一首按钮绑定点击事件
$("#nextBtn").on("click", function(){
    if(currentIndex < musicList.length - 1){
        currentIndex ++;
    }else{
        currentIndex = 0;
    }
    //重新渲染歌曲
    render(musicList[currentIndex]);
    //让音乐播放 触发 playBtn 暂停播放事件
    $("#playBtn").trigger("click");
})
//给音乐列表按钮绑定点击事件
$("#openModal").on("click", function(){
    $(".modal").css({
        display:"block",
    })


})

//监听音乐播放完毕的事件
$("audio").on("ended", function(){
    //触发下一首歌的点击事件
    $("#nextBtn").trigger("click")
})

//通过事件委托给音乐列表的播放按钮绑定点击事件
$(".music-list").on("click", ".play-circle", function(){
    if($(this).hasClass("fa-play-circle")){
        var index = $(this).attr("data-index");
        currentIndex = index;
        render(musicList[currentIndex]);
        $("#playBtn").trigger("click");
    }else{
        $("#playBtn").trigger("click");
    }
})

//关闭模态框绑定事件
$(".modal-close").on("click", function(){
    $(".modal").css({
        display:"none",
    })
})

//监听 audio 标签的 timeupdate 事件
$("audio").on("timeupdate", function(){
    //获取音乐当前到的时间，单位:秒 刚开始没有时间就补零
    var currentTime = $("audio").get(0).currentTime || 0;
    //获取音乐的总时长,单位:秒  
    var duration = $("audio").get(0).duration || 0;

    //设置当前你播放时间
    $(".current-time").text(formatTime(currentTime));

    //设置进度条  总时长  除以  当前播放时长 乘以 %比
    var value = (currentTime / duration) * 100;
    $(".music_progress-line").css({
        width: value + "%",
    })
})

//时间格式化
function formatTime(time) {
    // 比如：329 转换成 05:29
    var min = parseInt(time / 60); //转换成整数   time秒单位换算
    var sec = parseInt(time % 60);
    //小于 10 的补上零 
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    return `${min}:${sec}`
}

//根据音乐列表数据，创建li
function renderMusicList(list){
    //清空音乐列表(不然会数据重复)
     $(".music-list").empty();

     //遍历音乐列表信息
    $.each(list, function (index, item){
        //判断当前索引是否和播放的索引相等
        var $li = $(`
            <li class="${index == currentIndex ? "playing" : ""} ">
                <span>0${index + 1}. ${item.name} - ${item.singer}</span>
                <span data-index="${index}" class="fa ${index == currentIndex && !$("audio").get(0).paused
                 ? "fa-pause-circle"
                 :" fa-play-circle"}  play-circle"></span>
            </li>
        `);
        //最后一定要添加到 li中
        $(".music-list").append($li)
    })
}
//根据信息，设置页面对应标签中的内容
function render(data) {
    $('.name').text(data.name);//歌名
    $('.singer-album').text(`${data.singer}`);//歌手
    $('.time').text(data.time);//歌曲时长
    $('.cover img').attr('src', data.cover);//歌曲封面
    $('audio').attr("src", data.audio_url);//歌曲音频
    //背景图片
    $('.mask_bg').css({
        background:`url("${data.cover}") no-repeat center center`
    })
}
