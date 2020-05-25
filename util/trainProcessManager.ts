interface FailedLog {
  [index: string]: string;
}

interface TrainData {
  TotalToTrain: number,
  CurrentTrained: number,
  Status: string,
  FailedIds: Array<number>,
  FailedLogs: FailedLog
}

export default class TrainProcessManager {
  instance: WebSocket
  constructor() {
    console.log('wsManager try to connect ' + 'ws://' + document.domain + '/ws')
    this.instance = new WebSocket('ws://'+document.domain+'/ws');
    // 检测断开则重连， 未断开则发送信息维持生命
    setInterval(() => {
      if(this.instance.readyState === this.instance.CLOSED) {
        console.log('reconnecting websocket')
        this.instance = new WebSocket('ws://' + document.domain + '/ws');
      } else {
        this.instance.send('1');
      }
    }, 5000);
  }

  addListener(workcellId: number, cb: (data: TrainData) => void) {
    this.instance.addEventListener('message', (ev) => {
      const trainData = JSON.parse(ev.data);
      if(trainData.WorkcellId === workcellId) {
        cb(trainData);
      }
    })
  }
}