console.log('lets begging the javascript');
let currentsong = new Audio();
function formatSeconds(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60); // ensures no milliseconds
    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');
    return `${formattedMins}:${formattedSecs}`;
}


async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/song/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/song/")[1])
        }
    }
    return songs
}
let playmusic = (track, pause = false) => {
    // let audio = new Audio("/song/" + track);
    currentsong.src = "/song/" + track
    if (!pause) {
        currentsong.play()
        play.src = "/svg/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

    // audio.play();
}
async function main() {
    let songs = await getsongs()
    playmusic(songs[0], true)
    console.log(songs);

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        // let li = document.createElement("li");
        // li.textContent = song;
        // songul.appendChild(li);
        songul.innerHTML = songul.innerHTML + `<li><img class="invert" src="/svg/music.svg" alt="music-logo">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div></div>
                            </div>
                            <div class="playnow flex">
                                <img class="invert" src="/svg/play2.svg" alt="">
                            </div></li>`
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    play.addEventListener("click", element => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "/svg/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "/svg/play2.svg"
        }
    })
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${formatSeconds(currentsong.currentTime)}/${formatSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"

    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    // add eventlistner for the left 
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playmusic(songs[index-1])
        }
    })
    next.addEventListener("click",()=>{
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index+1)>length){
            playmusic(songs[index+1])
        }
    })
    
}
main()
