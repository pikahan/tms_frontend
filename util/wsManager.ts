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

class WsManager {
  readonly instance: WebSocket
  constructor(address: string) {
    this.instance = new WebSocket(address);
    // 心跳信号
    setInterval(() => {
      this.instance.send('1');
    }, 5000);
  }

  addListener(workcellId: number, cb: (data: TrainData) => void) {
    this.instance.addEventListener('message', (ev) => {
      const trainData = JSON.parse(ev.data);

      if(trainData.workcellId === workcellId) {
        cb(trainData);
      }
    })
  }
}