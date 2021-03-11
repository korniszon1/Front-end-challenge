const url = ' https://itunes.apple.com/us/rss/topalbums/limit=100/json';
let songs = '';
async function getApi()
{
    const api = await fetch(url);
    const data = await api.json();
    const all = data.feed;
    const list = all.entry;
    // const id = list[2].id.attributes['im:id'];
    

    for(i=0;i<list.length;i++)
    {
        const id = list[i].id.attributes['im:id'];
        songs +=id+',';
        
    }
    const m_url = 'https://itunes.apple.com/lookup?id='+songs+'&entity=song&limit=1';
    const m_api = await fetch(m_url)
    const m_data = await m_api.json();
    // const m_all = m_data.results;
    // const song = m_all[1].previewUrl;
    console.log(m_data)
    console.log(songs);
    //https://itunes.apple.com/us/lookup?id=1023678453
    // for(i=0;i<list.length;i++)
    // {
    //     const curlist= list[i]['im:name'].label;
    //     const pos = list[i].id.label['im:id']
    //     console.log(curlist);
    //     document.getElementById('container').innerHTML += "<div class='list'>"+curlist+"</div>";
    //  }
}

getApi();
