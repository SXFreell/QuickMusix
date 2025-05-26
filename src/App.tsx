// 获取地址栏的参数
const urlParams = new URLSearchParams(window.location.search);
const QQMUSIC = urlParams.get('qm');
const NEMUSIC = urlParams.get('ne');
// const KGMUSIC = urlParams.get('kg');
const KWMUSIC = urlParams.get('kw');

import { Button } from "@arco-design/web-react";
import axios from "axios";
import { useEffect, useState } from "react";
import QQIcon from './assets/qq.svg';
import NEIcon from './assets/ne.svg';
// import KGIcon from './assets/kg.svg';
// import KWIcon from './assets/kw.svg';
import './App.scss'

function App() {
  useEffect(() => {
    if (!KWMUSIC) return;
    axios.get(`https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=${KWMUSIC}`).then(res => {
      setSongName(res.data.data.songinfo.songName)
      setImgUrl(res.data.data.songinfo.pic)
      if (document.title !== res.data.data.songinfo.songName) {
        document.title = res.data.data.songinfo.songName
        // 修改icon为歌曲封面
        if (res.data.data.songinfo.pic) {
          const link = (document.querySelector("link[rel*='icon']") || document.createElement('link')) as HTMLLinkElement;
          link.type = 'image/x-icon';
          link.rel = 'shortcut icon';
          link.href = res.data.data.songinfo.pic;
          document.getElementsByTagName('head')[0].appendChild(link);
        }
      }
    });
  }, [])

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
    // 初始计算一次
    handleResize();
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
        {KWMUSIC ? <>
        <img className="bgpic" id="bgpic" src={imgUrl} alt={songName} />
        <img className="pic" id="pic" style={{ marginTop: picTop }} src={imgUrl} alt={songName} />
        <div className="nameContent">
          <span className="name">{songName}</span>
        </div>
        </> : <div className={"noKW"}>没有酷我音乐id无法获取封面和音乐名</div>}
        <div className="actionContent">
          { QQMUSIC ? <Button type="primary" className={"button"} icon={<img width={16} src={QQIcon} />} onClick={() => {
            window.open(`qqmusic://qq.com/media/playSonglist?p={"song":[{"type":"0","songmid":"${QQMUSIC}"}],"action":"play"}`, '_self')
          }}>QQ音乐播放</Button> : <></> }
          { NEMUSIC ? <Button type="primary" className={"button"} icon={<img width={16} src={NEIcon} />} onClick={() => {
            window.open(`orpheus://song/${NEMUSIC}/?autoplay=1`, '_self')
          }}>网易云音乐播放</Button> : <></> }
          {/* { KWMUSIC ? <Button type="primary" className={"button"} icon={<img width={16} src={KGIcon} />} onClick={() => {
            window.open('qqmusic://qq.com/media/playSonglist?p={"song":[{"type":"0","songmid":"000HJTeW3gxknS"}],"action":"play"}', '_self')
          }}>酷狗音乐播放</Button> : <></> } */}
          {/* { KWMUSIC ? <Button type="primary" className={"button"} icon={<img width={16} src={KWIcon} />} onClick={() => {
            window.open('qqmusic://qq.com/media/playSonglist?p={"song":[{"type":"0","songmid":"000HJTeW3gxknS"}],"action":"play"}', '_self')
          }}>酷我音乐播放</Button> : <></> } */}
        </div>
      </div>
    </>
  )
}

export default App
