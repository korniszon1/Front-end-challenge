const url = ' https://itunes.apple.com/us/rss/topalbums/limit=100/json';
let songs = '';
var seekto,seeking=false;
let setvolume = document.getElementById('volumeRange');
let slider = document.getElementById('songRange');
const source = [];
let currentsong = 0;
let isplay = false;
const audio = document.getElementById('currentsong');
let curtime, list,usd;
let load = false;
let muteSong = false;
const imgspace = document.getElementById('currentsongimg');
const range = document.getElementById('range');
const cursor = document.getElementById('time');
async function getApi()
{
    const api = await fetch(url);
    const data = await api.json();
    const all = data.feed;
    list = all.entry;
    const id = list[0].id.attributes['im:id'];
    img = list[currentsong]['im:image'][2].label;
    imgspace.innerHTML = '<img class="img" height="75px" src="'+img+'">';
    let listlength = (list.length)-1;
    console.log(listlength);

    for(i=0;i<list.length;i++)
    {
        img = list[i]['im:image'][2].label;
        document.getElementById('background').innerHTML += '<img class="img-fluid col-3 col-lg-1 img-bg fastanimated fadeIn" id="img-bg" height="75px" src="'+img+'"  onclick="show('+i+')">';
    }
    console.log(list);
    for(i=0;i<list.length;i++)
    {
            const id = list[i].id.attributes['im:id'];
            songs +=''+id+',';
    }
    const m_url = 'https://itunes.apple.com/lookup?id='+songs+'&entity=song&limit=1&version=1';
    const m_api = await fetch(m_url)
    const m_data = await m_api.json();
    const m_all = m_data.results;
    source[0] = m_all[0].previewUrl;
    let a = 0;
    console.log(m_all);
    for(i=1;i<m_all.length;i = i+2)
    {
        source[a] = m_all[i].previewUrl;
        a++;
    }
    console.log(source);    
    createAudio();
    timeupdate();
    // var sources = document.createElement('source');
    // var sources = track.getElementsByTagName('source');
    // console.log(source[5]); 
    // sources.setAttribute('src', source[6]);
    // track.appendChild(sources);

    // document.getElementById('container').innerHTML = '<audio control=""><source src='+m_all[i].previewUrl+'></audio>';
    // const song = m_all[1].previewUrl;
    // console.log(m_all)
    // console.log(songs);
    //https://itunes.apple.com/us/lookup?id=1023678453
    for(i=0;i<list.length;i++)
    {
        if(i==0)
        {
            img = list[i]['im:image'][2].label;
            const curlist= list[i]['im:name'].label;
            const curlistA = list[i]['im:artist'].label;
            const pos = list[i].id.label['im:id'];
            // document.getElementById('space').innerHTML = '<div class="something col-12"><i class="fas fa-th"></i></div>';
            // '<div class="col-12 songlistPause songlist animated FadeInUp" id="songlist'+i+'" onclick="changeSong('+i+')"><img class="col-3 col-lg-1 img-info" src="'+img+'"><div class="content col-9 col-lg-11 d-flex justify-content-between align-items-center" onclick="show('+i+')"><a id="myul">'+(i+1)+': '+curlist+'</a></div></div>';
            document.getElementById('space').innerHTML = '<div id="songid'+i+'" class="spaceCon animated FadeIn"><div id="songlist'+i+'" class="songlistPause songlist " onclick="changeSong('+i+')"><img class="col-3 col-lg-1 img-info" height="75px" src="'+img+'"></div><div  id="songlistSearch'+i+'" class="content col-9 col-lg-11 d-flex justify-content-between align-items-center" onclick="show('+i+')"><a class="title"><q>'+curlist+'</q> - '+curlistA+'<mark>top'+(i+1)+'</mark><mark>top '+(i+1)+'</mark></a></div></div>';
        }else
        {
            img = list[i]['im:image'][2].label;
            const curlist= list[i]['im:name'].label;
            const curlistA = list[i]['im:artist'].label;
            const pos = list[i].id.label['im:id'];
            document.getElementById('space').innerHTML += '<div id="songid'+i+'" class="spaceCon animated FadeIn"><div id="songlist'+i+'" class="songlistPause songlist" onclick="changeSong('+i+')"><img class="col-3 col-lg-1 img-info" height="75px" src="'+img+'"></div><div  id="songlistSearch'+i+'" class="content col-9 col-lg-11 d-flex justify-content-between align-items-center" onclick="show('+i+')"><a class="title"><q>'+curlist+'</q> - '+curlistA+'<mark>top'+(i+1)+'</mark><mark>top '+(i+1)+'</mark></a></div></div>';
        }
        
     }
     getUSD();
}
async function getUSD()
{
    let usd_url = 'http://api.nbp.pl/api/exchangerates/rates/a/usd/?format=json'
    const api = await fetch(usd_url);
    const data = await api.json();
    const usd_array = data.rates;
    usd = usd_array[0].mid
}
async function show(album)
{
    const api = await fetch(url);
    const data = await api.json();
    const all = data.feed;
    list = all.entry;
    let curalbum = list[album];
    console.log(curalbum)
    let releaseDate = curalbum['im:releaseDate'].attributes.label;
    console.log(releaseDate);
    let itemCount = curalbum['im:itemCount'].label;
    let price = curalbum['im:price'].attributes.amount
    let href;
    let hrefcheck;
    if(curalbum['im:artist'].attributes)
    {
        href = curalbum['im:artist'].attributes.href;
    }else
    {
        href = curalbum.link.attributes.href;
    }

    
    // releaseDate = releaseDate.replace('January','stycznia');
    // releaseDate = releaseDate.replace('February','lutego');
    // releaseDate = releaseDate.replace('March','marca');
    // releaseDate = releaseDate.replace('April','kwietnia');
    // releaseDate = releaseDate.replace('May','maja');
    // releaseDate = releaseDate.replace('June','czerwca');
    // releaseDate = releaseDate.replace('July','lipca');
    // releaseDate = releaseDate.replace('August','sierpnia');
    // releaseDate = releaseDate.replace('September','września');
    // releaseDate = releaseDate.replace('October','października');
    // releaseDate = releaseDate.replace('November','listopada');
    // releaseDate = releaseDate.replace('December','grudnia');
    if(releaseDate.search('January')!=-1)
    {
        let res = releaseDate.slice(7, 10);
        res = res.replace(",",' '); 
        const year = releaseDate.slice(11,releaseDate.length)
        releaseDate = res+" stycznia "+year
    }
    if(releaseDate.search('February')!=-1)
    {
        let c = releaseDate.lastIndexOf('March');
        let res = releaseDate.slice(8, 11);
        res = res.replace(",",' '); 
        const year = releaseDate.slice(12,releaseDate.length)
        releaseDate = res+" lutego "+year
    }
    if(releaseDate.search('March')!=-1)
    {
        let c = releaseDate.lastIndexOf('March');
        let res = releaseDate.slice(5, 8);
        res = res.replace(",",' '); 
        const year = releaseDate.slice(9,releaseDate.length)
        releaseDate = res+" marca "+year
    }
    if(releaseDate.search('April')!=-1)
    {
        let c = releaseDate.lastIndexOf('March');
        let res = releaseDate.slice(5, 8);
        res = res.replace(",",' '); 
        const year = releaseDate.slice(9,releaseDate.length)
        releaseDate = res+" kwietnia "+year
    }
    if(releaseDate.search('May')!=-1)
    {
        let c = releaseDate.lastIndexOf('March');
        let res = releaseDate.slice(3, 6);
        res = res.replace(",",' '); 
        const year = releaseDate.slice(7,releaseDate.length)
        releaseDate = res+" maja "+year
    }
    if(releaseDate.search('June')!=-1)
    {
        let c = releaseDate.lastIndexOf('March');
        let res = releaseDate.slice(4, 7);
        res = res.replace(",",' '); 
        const year = releaseDate.slice(8,releaseDate.length)
        releaseDate = res+" czerwca "+year
    }
    if(releaseDate.search('July')!=-1)
    {
        let c = releaseDate.lastIndexOf('March');
        let res = releaseDate.slice(4, 7);
        res = res.replace(",",' '); 
        const year = releaseDate.slice(8,releaseDate.length)
        releaseDate = res+" lipca "+year
    }
    if(releaseDate.search('August')!=-1)
    {
        let c = releaseDate.lastIndexOf('March');
        let res = releaseDate.slice(6, 9);
        res = res.replace(",",' '); 
        const year = releaseDate.slice(10,releaseDate.length)
        releaseDate = res+" sierpnia "+year
    }
    if(releaseDate.search('September')!=-1)
    {
        let c = releaseDate.lastIndexOf('March');
        let res = releaseDate.slice(9, 12);
        res = res.replace(",",' '); 
        const year = releaseDate.slice(13,releaseDate.length)
        releaseDate = res+" września "+year
    }
    if(releaseDate.search('October')!=-1)
    {
        let c = releaseDate.lastIndexOf('March');
        let res = releaseDate.slice(7, 10);
        res = res.replace(",",' '); 
        const year = releaseDate.slice(11,releaseDate.length)
        releaseDate = res+" października "+year
    }
    if(releaseDate.search('November')!=-1)
    {
        let c = releaseDate.lastIndexOf('March');
        let res = releaseDate.slice(8, 11);
        res = res.replace(",",' '); 
        const year = releaseDate.slice(12,releaseDate.length)
        releaseDate = res+" listopada "+year
    }
    if(releaseDate.search('December')!=-1)
    {
        let c = releaseDate.lastIndexOf('March');
        let res = releaseDate.slice(8, 11);
        res = res.replace(",",' '); 
        const year = releaseDate.slice(12,releaseDate.length)
        releaseDate = res+" grudnia "+year
    }
    img = curalbum['im:image'][2].label;
    document.getElementById('info').innerHTML += '<div class="info-box-bg animated fadeIn"><div class="info-box container mx-2 col-12"><div class="header col-12 d-flex justify-content-between"><img class="col-12 col-md-2 img-info-box" src="'+img+'"><h1 class="h1 d-none d-md-block text-center mx-auto col-12 col-md-6">'+curalbum['im:name'].label+'</h1><div class="exit d-flex justify-content-center align-items-center" onclick="exit()"><i class="fas fa-times"></i></div></div><div class="info-content d-flex flex-row flex-wrap justify-content-between"><h1 class="h1 d-block d-md-none col-12 text-center">'+curalbum['im:name'].label+'</h1><p class="col-12">Stworzone przez <a class="link" href="'+href+'" target="_blank"><u>'+curalbum['im:artist'].label+'</u></a> album pod tytułem <a href="'+curalbum.link.attributes.href+'" target="_blank"><i>"'+curalbum['im:name'].label+'"</i></a>. Album został wydany '+releaseDate+'. Aktualnie nr. '+(album+1)+' na iTunes. Album zawiera '+itemCount+' piosenek. Za album zapłacimy aktualnie '+(Math.round((price*usd) * 100) / 100)+' zł</p><a href="'+curalbum.link.attributes.href+'" target="_blank"><div class="btn itunes">Czytaj wiecej</div></a><p class="copy text-center col-4">'+curalbum.rights.label+'</p></div></div>'
}
function exit()
{
    document.getElementById('info').innerHTML = '';
}
function lishow(c)
{
    const block = document.getElementById('block');
    const con = document.getElementById('container');
    const background = document.getElementById('background');
    audio.pause();
    if(c==0)
    {
        document.getElementById('nav-link1').classList.remove('disabled');
        document.getElementById('nav-link2').classList.remove('disabled');
        document.getElementById('upcon').style.display = "flex";
        document.getElementById('myInput').style.display = "block";
        document.getElementById('list').classList.add('active-btn');
        document.getElementById('blocklist').classList.remove('active-btn');
        document.getElementsByClassName('container')[0].style.display = 'block';
        console.log('sieeeeeeeeeeeeeeeeeema')
        block.classList.add('block');
        for(i=0;i<list.length;i++)
        {
            let imgbg = document.getElementsByClassName('img-bg')[i];
            imgbg.style.filter = 'grayscale(100)opacity(30%)';
        }
        background.style.position = 'fixed';
    }
    if(c==1)
    {
        document.getElementById('myInput').style.display = "none";
        document.getElementById('upcon').style.display = "none";
        document.getElementById('list').classList.remove('active-btn');
        document.getElementById('blocklist').classList.add('active-btn');
        document.getElementById('nav-link1').classList.add('disabled');
        document.getElementById('nav-link2').classList.add('disabled');
        document.getElementsByClassName('container')[0].style.display = 'none';
        background.style.position = 'absolute';
        for(i=0;i<list.length;i++)
        {
            let imgbg = document.getElementsByClassName('img-bg')[i];
            imgbg.style.filter = 'grayscale(100)opacity(70%)';
        }

        block.classList.remove('block');
    }
}
function changeSong(x)
{
    if(currentsong != x)
    {
        isplay = false;
    }
    console.log(currentsong)
    const songlist = document.getElementById('songlist'+currentsong);
    songlist.classList.remove('songlistPlayed');
    songlist.classList.add('songlistPause');
    currentsong = x;
    console.log(x);
    img = list[currentsong]['im:image'][2].label;
    imgspace.innerHTML = '<img class="img" height="75px" src="'+img+'">';
    audio.pause();
    document.getElementById('playpausebtn').innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
    audio.load();
    loadtrack();
    checkplay(currentsong);
    setTimeout(function(){timeupdate()},500);
}
function createAudio()
{
    setvolume.value = 50;
    sources = document.createElement('source');
    sources.setAttribute('src', source[currentsong]);
    audio.appendChild(sources);
    loadtrack();
}
function loadtrack()
{
    slider.value = 0;
    sources.setAttribute('src', source[currentsong]);
    load = true;
}
function checkplay(y)
{
    y = currentsong;
    const songlist = document.getElementById('songlist'+y);
    songlist.classList.remove('songlistPause');
    if(isplay == false)
    {
        songlist.classList.add('songlistPlayed');
        songlist.classList.remove('songlistPause');
        audio.play();
        isplay=true;
        document.getElementById('playpausebtn').innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>'
    }else
    {
        songlist.classList.remove('songlistPlayed');
        songlist.classList.add('songlistPause');
        audio.pause();
        isplay=false;
        document.getElementById('playpausebtn').innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>'
    }
}
function seek(event)
{
    if(seeking){
        let a = window.innerWidth;
        let b = (a - slider.offsetWidth)/2;
        slider.value = ((event.clientX - b)/slider.offsetWidth)*100;
        seekto = audio.duration * (slider.value / 100);
        audio.currentTime = seekto;
    }
}
function mute()
{
    if(muteSong==false)
    {
        setvolume.value = 0;
        muteSong = true;
        volume();
    }else if(muteSong==true)
    {
        setvolume.value = 50;
        muteSong = false;
        volume();
    }
    
}
function volume(event)
{
    if(true)
    {
        audio.volume = setvolume.value / 100;
        if(setvolume.value <= 5)
        {
            document.getElementById('VolumeIcon').innerHTML = '<i class="fas fa-volume-off"></i>';
        }else if(setvolume.value <= 50)
        {
            document.getElementById('VolumeIcon').innerHTML = '<i class="fas fa-volume-down"></i>';
        }else if(setvolume.value > 30)
        {
            document.getElementById('VolumeIcon').innerHTML = '<i class="fas fa-volume-up"></i>'
        }
    }

}
function timeupdate()
{

        const now = audio.currentTime * (100/audio.duration);
        slider.value = now;
        if(isNaN(now))
        {
            slider.value=0;
        }
        volume();
        var curmins = Math.floor(audio.currentTime / 60);
        var cursecs = Math.floor(audio.currentTime - curmins * 60);
        var durmins = Math.floor(audio.duration / 60);
        var dursecs = Math.floor(audio.duration - durmins * 60);
        if(cursecs < 10){ cursecs = "0"+cursecs; }
        if(dursecs < 10){ dursecs = "0"+dursecs; }
        if(curmins < 10){ curmins = "0"+curmins; }
        if(durmins < 10){ durmins = "0"+durmins; }
        if(isNaN(dursecs))
        {
            setTimeout(function(){timeupdate()},100);
        }
        curtimetext.innerHTML = curmins+":"+cursecs;
        durtimetext.innerHTML = durmins+":"+dursecs;

    
    if(slider.value == 100)
    {
        loadtrack();
        audio.pause();
        isplay=false;
        document.getElementById('playpausebtn').innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>'
    }
}
function timeupdatetext(event)
{
    if(load)
    {
        // const now = audio.currentTime * (100/audio.duration);
        // seekto = audio.duration * (now / 100);
        let a = window.innerWidth;
        let b = (a - slider.offsetWidth)/2;
        // seekto = time * (slider.value / 100);
        // cursor.innerHTML = seekto;
        curtime = (((event.clientX - b)/slider.offsetWidth))*audio.duration;
        var curmins = Math.floor(curtime / 60);
        var cursecs = Math.floor(curtime - curmins * 60);
        var durmins = Math.floor(audio.duration / 60);
	    var dursecs = Math.floor(audio.duration - durmins * 60);
        if(cursecs < 10){ cursecs = "0"+cursecs; }
        if(curmins < 10){ curmins = "0"+curmins; }
        let timeall = curmins+":"+cursecs;
        if(timeall == '0-1:59')
        {
            timeall = '0:00'
        }
        time.innerHTML = timeall;
    }  
}
function searchtext() {
    let input, filter, space, a, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    for (i = 0; i < list.length; i++) {
        const songdis = document.getElementById("songid"+i);
        const songli = document.getElementById('songlistSearch'+i);
        a = songli.getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            songdis.style.display = "";
        } else {
            songdis.style.display = "none";
        }
    }
}
audio.addEventListener("timeupdate", function(){ timeupdate(); });
slider.addEventListener("mousedown", function(event){ seeking=true; seek(event); });
slider.addEventListener("mousemove", function(event){ seek(event); });
slider.addEventListener("mouseup",function(){ seeking=false; });

range.addEventListener("mousedown", function(event){timeupdatetext(event); });
range.addEventListener("mousemove", function(event){timeupdatetext(event); });
range.addEventListener("mouseover", function(event){timeupdatetext(event); });

setvolume.addEventListener("mousedown", function(event){ volume(event); });
setvolume.addEventListener("mousemove", function(event){ volume(event); });
setvolume.addEventListener("mouseup",function(){; });
document.addEventListener('mousemove',
function(e)
{
    let x = e.clientX;
    cursor.style.left =  x+"px";
});
volume();
getApi();