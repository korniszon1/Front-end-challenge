const url = ' https://itunes.apple.com/us/rss/topalbums/limit=100/json';
let songs = '';
var seekto,seeking=false;
let setvolume = document.getElementById('volumeRange');
let slider = document.getElementById('songRange');
const source = [];
let currentsong = 0;
let isplay = false;
const audio = document.getElementById('currentsong');
let curtime ;
let load = false;
let list;
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
    for(i=0;i<list.length;i++)
    {
        img = list[i]['im:image'][2].label;
        document.getElementById('background').innerHTML += '<img class="img-fluid col-3 col-lg-1 img-bg" height="75px" src="'+img+'">';
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
    console.log(m_all[0]);
    for(i=1;i<m_all.length;i = i+2)
    {
        source[a] = m_all[i].previewUrl;
        a++;
    }
    console.log(source);
    createAudio();
    setTimeout(function(){timeupdate()},500);
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
            const curlist= list[i].title.label;
            const pos = list[i].id.label['im:id'];
            document.getElementById('space').innerHTML = "<div class='col-12 songlist'><a onclick='changeSong("+i+")'>"+(i+1)+""+curlist+"</a></div>";
        }else
        {
            const curlist= list[i].title.label;
            const pos = list[i].id.label['im:id'];
            document.getElementById('space').innerHTML += "<div class='col-12 songlist'><a onclick='changeSong("+i+")'>"+(i+1)+""+curlist+"</a></div>";
        }
        
     }
}
function changeSong(x)
{
    currentsong = x;
    console.log(x);
    img = list[currentsong]['im:image'][2].label;
    imgspace.innerHTML = '<img class="img" height="75px" src="'+img+'">';
    audio.pause();
    isplay=false;
    document.getElementById('playpausebtn').innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
    audio.load();
    loadtrack();
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
function checkplay()
{
    if(isplay == false)
    {
        audio.play();
        isplay=true;
        document.getElementById('playpausebtn').innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>'
    }else
    {
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
        time.innerHTML = curmins+":"+cursecs;
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