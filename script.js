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

    for(i=0;i<list.length;i++)
    {
        img = list[i]['im:image'][2].label;
        document.getElementById('background').innerHTML += '<img class="img-fluid col-3 col-lg-1 img-bg fastanimated fadeIn" id="img-bg" height="75px" src="'+img+'"  onclick="show('+i+')">';
    }
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
    for(i=1;i<m_all.length;i = i+2)
    {
        source[a] = m_all[i].previewUrl;
        a++;
    }
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

const fetchAlbum = async (url, albumId) => {
    const api = await fetch(url);
    const {feed: {entry}} = await api.json();

    return entry[albumId];
}

const mapToCurrentAlbum = (album, usd) => {
    const name = album['im:name'].label;
    const artistName = album['im:artist'].label;
    const songAmount = album['im:itemCount'].label;;
    const link = album.link.attributes.href;
    const rights = album.rights.label;
    const releaseDate = album['im:releaseDate'].attributes.label;
    const img = album['im:image'][2].label;

    const rawPrice = album['im:price'].attributes.amount;
    const price = (Math.round((rawPrice*usd) * 100) / 100);

    const authorLink = album['im:artist'].attributes 
        ? album['im:artist'].attributes.href
        : album.link.attributes.href;

    const formattedReleaseDate = new Date(releaseDate)
        .toLocaleDateString("pl-PL", {  year: 'numeric', month: 'long', day: 'numeric' });        

    return { name, artistName, price, link, authorLink, formattedReleaseDate, rights, img, songAmount };
}

function getHtmlPopUp(currentAlbum, albumId) {
    const albumNumber = albumId + 1; 
    return `
    <div class="info-box-bg animated fadeIn">
        <div class="info-box container mx-2 col-12">
            <div class="header col-12 d-flex justify-content-between">
                <img class="col-12 col-md-2 img-info-box" src="${currentAlbum.img}">
                <h1 class="h1 d-none d-md-block text-center mx-auto col-12 col-md-6"> ${currentAlbum.name} </h1>
                <div class="exit d-flex justify-content-center align-items-center" onclick="exit()">
                    <i class="fas fa-times"></i>
                </div>
            </div>
            <div class="info-content d-flex flex-row flex-wrap justify-content-between">
                <h1 class="h1 d-block d-md-none col-12 text-center">${currentAlbum.name}</h1>
                <p class="col-12">Stworzone przez 
                    <a class="link" href="${currentAlbum.authorLink}" target="_blank"><u> ${currentAlbum.artistName}</u></a> album pod tytułem 
                    <a href=" ${currentAlbum.link}" target="_blank"><i>"${currentAlbum.name}"</i></a>. Album został wydany 
                    ${currentAlbum.formattedReleaseDate}. Aktualnie nr. ${albumNumber}' na iTunes. Album zawiera ${currentAlbum.songAmount}' piosenek. Za album zapłacimy aktualnie 
                    ${currentAlbum.price} zł
                </p>
                <a href="${currentAlbum.link}" target="_blank">
                    <div class="btn itunes">
                        Czytaj wiecej
                    </div>
                </a>
            <p class="copy text-center col-4">${currentAlbum.rights}</p>
        </div>
    </div>`
}

async function show(albumId)
{
    const popUpHtml = getHtmlPopUp(mapToCurrentAlbum(await fetchAlbum(url, albumId), usd), albumId); 
    document.getElementById('info').innerHTML += popUpHtml;
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
    const songlist = document.getElementById('songlist'+currentsong);
    songlist.classList.remove('songlistPlayed');
    songlist.classList.add('songlistPause');
    currentsong = x;
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