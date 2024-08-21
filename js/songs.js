let song_api = 'http://127.0.0.1:5500/bollywood/';
var song_link = [];
var song_title = [];
var play_idx = -1;
let is_play = false;
let playbtn = document.querySelector('.play_button_bar');
let audio = new Audio();
let nextbtn = document.querySelector('.next_song');
let prevbtn = document.querySelector('.last_song')
let songs;
let currSongName = document.querySelector('.songname');
let previous = [];
let next = [];
let playbar = document.querySelector('.playlength');
let circle = document.querySelector('.circle');
let finished = document.querySelector('.finished');
let timer = document.querySelector('.time');
async function getSong() {
    let api = await fetch(song_api);
    // console.log(api);
    let songs = await api.text();
    // console.log(songs);
    let div = document.createElement('div');
    div.innerHTML = songs;
    let link = div.getElementsByTagName('a');
    // console.log(link);
    for (let i = 3; i < link.length; i++) {
        // console.log(link[i].title);
        song_link.push(link[i].href);
        song_title.push(link[i].title);
        // is_playing.push(false);
    }
    main();
}
function changeButton() {
    if (is_play) {
        playbtn.setAttribute('src', './svg/pause.svg');
        console.log('played')
    }
    else {
        playbtn.setAttribute('src', './svg/play_button_bar.svg');
        console.log('paused')
    }
}
getSong();
function pause_audio(x) {
    x.pause();
    is_play = false;
    changeButton();
}

async function main() {

    // console.log('song_title',song_title);
    let song_list = document.querySelector('.songlist');
    for (let i = 0; i < song_title.length; i++) {
        let div = document.createElement('div');
        div.setAttribute('class', `songs`);
        div.innerText = song_title[i].substring(0, song_title[i].indexOf('.'));
        // console.log(div,song_title[i]);
        song_list.append(div);

    }

    songs = document.querySelectorAll('.songs');
    for (let i = 0; i < song_link.length; i++) 
        {
            //when user clicks on a song name
        songs[i].addEventListener('click', () => 
        {
            if (play_idx == -1) {
                if (previous[0] != i)
                    previous.unshift(i);//appends at first
            }
            if (play_idx + 1) {
                songs[play_idx].removeAttribute('style');
                if (previous[0] != play_idx)
                    previous.unshift(play_idx);
                play_idx = undefined;
                pause_audio(audio);
            }
            audio = new Audio(song_link[i]);
            audio.play();

            currSongName.innerText = song_title[play_idx].substring(0, song_title[i].indexOf('.'));
            play_idx = i;
            is_play = true;
            changeButton();
            songs[i].setAttribute('style', 'color:lightgreen;');
            console.log(previous);
            circle.style.left = `-4px`;
            finished.style.width = 0;
        })
       
    }
}
function pause_play() {
    if (!(play_idx + 1)) {
        audio = new Audio(song_link[0]);
        play_idx = 0;
        is_play = true;
        audio.play();
        songs[play_idx].setAttribute('style', 'color:lightgreen;');
    }

    else if (is_play) {
        audio.pause();
        is_play = false;
        songs[play_idx].removeAttribute('style');
    }
    else {
        is_play = true;
        audio.play();
        songs[play_idx].setAttribute('style', 'color:lightgreen;');
    }
    changeButton();
}
playbtn.addEventListener('click', () => {
    pause_play();
})
document.body.addEventListener('keypress', (e) => {
    if (e.key == ' ')
        pause_play();
})

function play_song(idx) {
    console.log(songs[idx]);
    audio = new Audio(song_link[play_idx]);
    audio.play();
    currSongName.innerText = song_title[play_idx].substring(0, song_title[i].indexOf('.'));
    is_play = true;
    songs[idx].setAttribute('style', 'color:lightgreen;');
    changeButton();
    circle.style.left = `-4px`;
    finished.style.width = 0;
}
// if one song ends , then next should start

    setInterval(()=>
    {
        if(audio.ended)
            {
                songs[play_idx].removeAttribute('style');
                previous.unshift(play_idx);//removes first element of array
                play_idx = (play_idx + 1) % songs.length;
                play_song(play_idx);
                console.log('next song please');   
            }
    },1000);

    function playPreviousSong()
    {
        if (previous.length) {
            audio.pause();
            songs[play_idx].removeAttribute('style');
            if (play_idx != next[0])
                next.unshift(play_idx);//removes first element of array
            play_idx = previous[0];
            play_song(play_idx);
            previous.shift();
        }
        else if (play_idx + 1)//!= -1
        {
            audio.pause();
            songs[play_idx].removeAttribute('style');
            if (play_idx != next[0])
                next.unshift(play_idx);//removes first element of array
            play_idx--;
            changeButton();
            play_song(play_idx);
        }
        console.log('previous ', previous);
        console.log('play_idx ', play_idx);
        console.log('next ', next);
    
    }
//previous button
prevbtn.addEventListener('click', () => {
    playPreviousSong();
   })

function playNextSong()
{
    if (!(play_idx + 1))//-1
    {
        play_idx++;
        if (previous[0] != play_idx)
            previous.unshift(play_idx);
        // await play_next_song(songs[play_idx],play_idx);
    }
    else if (next.length) {
        audio.pause();
        songs[play_idx].removeAttribute('style');
        if (previous[0] != play_idx)
            previous.unshift(play_idx);
        play_idx = next[0];
        next.shift();
        // await play_next_song(songs[play_idx],play_idx);
    }
    else {
        audio.pause();
        songs[play_idx].removeAttribute('style');
        previous.unshift(play_idx);//removes first element of array
        play_idx = (play_idx + 1) % songs.length;
        // await play_next_song(songs[play_idx],play_idx);
    }
    play_song(play_idx);

    console.log('previous ', previous);
    console.log('play_idx ', play_idx);
    console.log('next ', next);
}

//next button
nextbtn.addEventListener('click', async () => {
    playNextSong();
})
document.body.addEventListener('keydown',(key)=>
{
    if(key.key == 'ArrowRight')
        playNextSong();
    else if(key.key == 'ArrowLeft')
        playPreviousSong();
})

function convertSeconds(seconds) {
    if (isNaN(seconds)) {
        return '00:00';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    // Add a leading zero if seconds are less than 10
    const Seconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    
    return `${Math.floor(minutes).toString().padStart(2, '0')}:${Math.floor(Seconds).toString().padStart(2, '0')}`;
}


function setTime(currtime,totaltime)
{
    timer.innerText = `${convertSeconds(currtime)}/${convertSeconds(totaltime)}`;
}
setInterval(()=>
{
    audio.addEventListener("timeupdate",()=>
        {
            let currtime = audio.currentTime;
            let totaltime = audio.duration;
            // console.log(currtime,totaltime);
            setTime(currtime,totaltime);
            finished.style.width = `${currtime/totaltime*100}%`;
            circle.style.left = `${currtime/totaltime*100}%`;
        })
},1000);
// change the songlength
playbar.addEventListener('click',(evt)=>
{
    console.log(evt.offsetX,playbar.clientWidth);
    audio.currentTime = (evt.offsetX/playbar.clientWidth)*audio.duration;
    setTime(audio.currentTime,audio.duration);
}
)