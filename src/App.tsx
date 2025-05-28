// 获取地址栏的参数
const urlParams = new URLSearchParams(window.location.search);
const ID = urlParams.get('id');
// const KWMUSIC = urlParams.get('kw');

import { Button } from "@arco-design/web-react";
import axios from "axios";
import { useEffect, useState } from "react";
import QQIcon from './assets/qq.svg';
import NEIcon from './assets/ne.svg';
import KGIcon from './assets/kg.svg';
import QSIcon from './assets/qs.svg';
// import KWIcon from './assets/kw.svg';
// import type { ImgType, GlobalConfig, Server } from "./interface";
import type { ImgType, GlobalConfig, Server, Music } from "./interface";
import './App.scss'

// 判断是不是Https
// const https: boolean = window.location.protocol === "https:";

// 获取配置
const config: GlobalConfig = JSON.parse(localStorage.getItem("config") || "{}");

const getMusicJSON = (Servers: Server[]): Promise<Map<string, Music>> => {
  const musicMap: Map<string, Music> = new Map<string, Music>();
  return new Promise((resolve, reject) => {
    for(let i in Servers) {
      if (Servers[i].enable) {
        axios.get(Servers[i].url).then(res => {
          if (res.status === 200) {
            res.data.forEach((music: Music) => {
              musicMap.set(music.id, music);
            });
            resolve(musicMap);
          } else {
            reject(res.statusText);
          }
        }).catch(err => {
          reject(err.toString());
        });
      }
      break;
    }
  })
}

const getMusicImage = (type: ImgType, data: string) => {
  switch (type) {
    case "qm":
      return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${data}.jpg?max_age=2592000`;
    case "ne":
      return `https://p1.music.126.net/${data}.jpg`;
    case "url":
      return data;
    default:
      return "";
  }
}


function App() {
  useEffect(() => {
    getMusicJSON(config.data.servers).then((res: Map<string, Music>) => {
      const music = ID ? res.get(ID) : null;
      if (music) {
        setSongName(music.name);
        music.qm && setQQMUSIC(music.qm);
        music.ne && setNEMUSIC(music.ne);
        music.kg && setKGMUSIC(music.kg);
        music.qs && setQSMUSIC(music.qs);
        document.title = music.name;
        const tempImgUrl: string = getMusicImage(music.img.type, music.img.data);
        if (tempImgUrl) {
          setImgUrl(tempImgUrl);
          const link = (document.querySelector("link[rel*='icon']") || document.createElement('link')) as HTMLLinkElement;
          link.type = 'image/x-icon';
          link.rel ='shortcut icon';
          link.href = tempImgUrl;
          document.getElementsByTagName('head')[0].appendChild(link);
        }
      }
    }).catch(err => {
      console.log(err);
    })
  }, [])

  const [QQMUSIC, setQQMUSIC] = useState("");
  const [NEMUSIC, setNEMUSIC] = useState("");
  const [KGMUSIC, setKGMUSIC] = useState("");
  const [QSMUSIC, setQSMUSIC] = useState("");

  const [songName, setSongName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [picTop, setPicTop] = useState(0);

  const handleResize = () => {
    const bgpicWidth = document.getElementById("bgpic")?.clientWidth;
    const picWidth = document.getElementById("pic")?.clientWidth;
    if (bgpicWidth && picWidth) {
      setPicTop((bgpicWidth - picWidth) / 2);
      return;
    }
  };

  // 监听页面大小变化
  useEffect(() => {
    // 添加监听
    window.addEventListener('resize', handleResize);

    // 清理函数：组件卸载时移除监听
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // 空依赖数组确保只在挂载/卸载时执行

  return (
    <>
      <div className="quickmusix">
        {songName ? <>
        <img className="bgpic" id="bgpic" onLoad={handleResize} src={imgUrl} alt={songName} />
        <img className="pic" id="pic" style={{ marginTop: picTop }} src={imgUrl} alt={songName} />
        <div className="nameContent">
          <span className="name">{songName}</span>
        </div>
        </> : <div className={"noKW"}>没有在收录库中找到该音乐哦，请检查分享id</div>}
        <div className="actionContent">
          { QQMUSIC ? <Button type="primary" className={"button"} icon={<img width={16} src={QQIcon} />} onClick={() => {
            window.open(`qqmusic://qq.com/media/playSonglist?p={"song":[{"type":"0","songmid":"${QQMUSIC}"}],"action":"play"}`, '_self')
          }}>QQ音乐播放</Button> : <></> }
          { NEMUSIC ? <Button type="primary" className={"button"} icon={<img width={16} src={NEIcon} />} onClick={() => {
            window.open(`orpheus://song/${NEMUSIC}/?autoplay=1`, '_self')
          }}>网易云音乐播放</Button> : <></> }
          { KGMUSIC ? <Button type="primary" className={"button"} icon={<img width={16} src={KGIcon} />} onClick={() => {
            window.open(`kugou://start.weixin?{"cmd":212,"jsonStr":${KGMUSIC}}`, '_self')
          }}>酷狗音乐播放</Button> : <></> }
          { QSMUSIC ? <Button type="primary" className={"button"} icon={<img width={16} src={QSIcon} />} onClick={() => {
            window.open(`luna://luna.com/playing?track_id=${QSMUSIC}`, '_self')
          }}>汽水音乐播放</Button> : <></> }
        </div>
      </div>
    </>
  )
}

export default App
